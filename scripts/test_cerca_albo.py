#!/usr/bin/env python3
"""La ricerca dell'albo: che cosa conta come prova, e che cosa ⛔ non conta.

🔑 Il presidio che vale piu' di tutti e' `test_NON_promuove_niente`: l'albo e'
una **prova per chi rivede**, ⛔ non una decisione. Se un giorno qualcuno lo fa
scrivere nell'elenco, quel test diventa rosso.
"""
import importlib.util
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("albo", QUI / "cerca-albo.py")
albo = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(albo)


class LeFormeVERE(unittest.TestCase):
    """🔴 Le stringhe qui sotto sono **copiate da siti veri**, ⛔ non inventate.

    Le prime cinque erano **invisibili** alla `RE_ALBO` della raccolta fino al
    2026-08-18: sulle stesse 679 schede trovava **14**, allargata ne trova **34**.
    ⇒ ⛔ non era che l'albo non ci fosse: era che ⛔ non veniva riconosciuto.
    """

    CASI = [
        ("Iscritto all'ordine provinciale di Roma dei medici chirurghi", "Roma", ""),
        ("Iscrizione Albo Odontoiatri Taranto n. 23", "Taranto", "23"),
        ("Iscrizione Ordine Medici Brescia n. 5366", "Brescia", "5366"),
        ("Albo Provinciale dei Medici Chirurghi di BRESCIA n. 3715", "BRESCIA", "3715"),
        ("Iscrizione Ordine Prov.le dei Medici Chirurghi", "", ""),
        ("Iscrizione Ordine Provinciale di Roma dei Medici Chirurghi N. M47936", "Roma", "M47936"),
        ("Iscritta all'ordine degli Odontoiatri di Milano con il n° 5211", "Milano", "5211"),
        ("Iscrizione Albo 8088", "", "8088"),
        # ⚠️ Le forme che gia' funzionavano: ⛔ non devono rompersi.
        ("Iscritto all'Albo dei Medici di Milano n. 36292", "Milano", "36292"),
        ("Ordine dei Medici di Varese n. 6458", "Varese", "6458"),
    ]

    def test_ogni_forma_vera_viene_riconosciuta_ed_estratta(self):
        for testo, prov, num in self.CASI:
            e = albo.estrai(testo, "https://x.it/privacy")
            self.assertIsNotNone(e, f"⛔ RE_ALBO non vede: {testo}")
            self.assertEqual((e["provincia"], e["numero"]), (prov, num), testo)

    def test_una_partita_IVA_accanto_NON_diventa_il_numero(self):
        e = albo.estrai("P. Iva 03110520172 Iscrizione Ordine Medici Torino n. 20609", "u")
        self.assertEqual((e["provincia"], e["numero"]), ("Torino", "20609"))

    def test_le_parole_del_contorno_NON_diventano_province(self):
        # ⚠️ `dei`, `degli`, `chirurghi`, `medici` ⛔ non sono province.
        for t in ("Albo dei Medici n. 123", "Ordine degli Odontoiatri n. 99"):
            p, _ = albo.numero_e_provincia(t)
            self.assertNotIn(p.lower(), {"dei", "degli", "medici", "odontoiatri"}, t)


class CheCosaEProva(unittest.TestCase):
    def test_ordine_dei_medici_con_numero(self):
        e = albo.estrai("Direttore sanitario: C. Giani  Ordine dei Medici di Varese n. 6458",
                        "https://x.it/note-legali")
        self.assertEqual((e["provincia"], e["numero"]), ("Varese", "6458"))

    def test_il_direttore_sanitario_viene_SEGNALATO(self):
        # ⚠️ Dice «qui c'e' un medico», ⛔ NON «e' un libero professionista»:
        # il direttore sanitario lo nomina una STRUTTURA. Due domande diverse.
        e = albo.estrai("Direttore Sanitario: Dott. Silvio Saba, iscritto all'Albo "
                        "degli Odontoiatri di Roma n. 06411", "https://x.it/legal")
        self.assertTrue(e["conDirettoreSanitario"])

    def test_senza_direttore_sanitario_NON_viene_segnalato(self):
        e = albo.estrai("Iscritta all'Albo dei Medici di Pescara n. 4210", "https://x.it/p")
        self.assertFalse(e["conDirettoreSanitario"])

    def test_albo_SENZA_numero_resta_una_prova_debole_ma_esiste(self):
        e = albo.estrai("Sono iscritto all'albo e opero da vent'anni", "https://x.it/chi-siamo")
        self.assertIsNotNone(e)
        self.assertEqual(e["numero"], "", "un numero inventato dal nulla")

    def test_l_URL_dove_e_stato_trovato_viene_conservato(self):
        # ⚠️ Senza il «dove», chi rivede deve ricercarlo a mano: la prova
        # dev'essere **riaprbile**.
        e = albo.estrai("Ordine dei Medici di Bari n. 900", "https://x.it/note-legali/")
        self.assertEqual(e["dove"], "https://x.it/note-legali/")

    def test_il_contesto_viene_ripulito_dai_tag(self):
        e = albo.estrai("<div class='a'>Ordine dei Medici di Bari n. 900</div>", "u")
        self.assertNotIn("<", e["contesto"])
        self.assertIn("Ordine dei Medici di Bari", e["contesto"])


class CheCosaNONEProva(unittest.TestCase):
    def test_una_pagina_senza_albo(self):
        self.assertIsNone(albo.estrai("Filler e tossina botulinica a Milano", "u"))

    def test_ordine_di_grandezza_e_albo_d_oro_NON_sono_l_albo(self):
        # ⚠️ Allargare la regex ha un costo: questi devono restare fuori.
        for t in ("un ordine di grandezza piu' grande", "l'albo d'oro della societa'",
                  "iscriviti alla newsletter", "centro estetico e solarium"):
            self.assertIsNone(albo.estrai(t, "u"), t)

    def test_la_linea_guida_FNOMCeO_NON_e_un_numero(self):
        # 🔴 Misurato: «rispetta la linea guida nazionale della FNOMCeO» faceva
        # scattare RE_ALBO. E' una prova DEBOLE, e va restituita senza numero,
        # ⛔ non con un numero preso da un'altra frase.
        e = albo.estrai("Il sito rispetta la linea guida FNOMCeO in materia di "
                        "pubblicita' sanitaria. Ordine dei Medici. P.IVA 12345678901", "u")
        self.assertEqual(e["numero"], "", "ha scambiato una partita IVA per un numero d'albo")

    def test_un_numero_LONTANO_nella_pagina_NON_viene_attaccato(self):
        # 🔴 Questo test era VERDE senza controllare niente: usava un numero di
        # 11 cifre, che `\d{2,6}` scarta comunque. La prova per mutazione l'ha
        # trovato — allargando la finestra il test restava verde.
        # Ora il caso e' quello vero: DUE studi nella stessa pagina legale, e il
        # numero del secondo ⛔ non deve finire attaccato al primo.
        pagina = ("Ordine dei Medici. Il titolare del trattamento e' ACME Srl."
                  + " testo di riempimento." * 30
                  + " Il direttore e' iscritto all'Albo dei Medici di Roma n. 1234")
        e = albo.estrai(pagina, "u")
        self.assertEqual(e["numero"], "",
                         "ha attaccato al primo «albo» un numero che sta 600 caratteri dopo")

    def test_ma_un_numero_VICINO_viene_preso(self):
        # ⚠️ Il complementare: senza questo, restringere la finestra a zero
        # passerebbe lo stesso.
        e = albo.estrai("Iscritto all'Albo dei Medici di Roma n. 1234", "u")
        self.assertEqual(e["numero"], "1234")


class CheCosaLoScriptNONFa(unittest.TestCase):
    def test_NON_promuove_niente(self):
        # 🔴 Il presidio piu' importante del file.
        r = {"dominio": "x.it", "gruppo": "da-guardare", "nome": "N", "tipoSoggetto": "incerto"}
        fuori = albo.cerca(dict(r), con_rete=False)
        self.assertEqual(fuori["gruppo"], "da-guardare")
        self.assertEqual(fuori.get("tipoSoggetto"), "incerto")
        self.assertNotIn("escluso", fuori)
        self.assertIn("albo", fuori)

    def test_senza_rete_NON_scarica(self):
        # ⚠️ Il modo predefinito ⛔ non tocca la rete: si dev'essere sicuri.
        # 🔴 La prima versione di questo test era VERDE anche togliendo il
        # controllo: usava un dominio senza pagine in cache, quindi
        # `link_legali()` tornava vuoto e ⛔ non si arrivava mai a scaricare.
        # ⇒ ora la strada per la rete e' APERTA di proposito, e il test verifica
        # che ⛔ non venga percorsa.
        chiamate = []
        v_leg, v_link, v_rob = albo.racc.leggi, albo.link_legali, albo.racc.robots_permette
        albo.racc.leggi = lambda *a, **k: chiamate.append(a) or (None, None)
        albo.link_legali = lambda d: ["https://x.it/privacy"]
        albo.racc.robots_permette = lambda u: True
        try:
            r = albo.cerca({"dominio": "x.it", "gruppo": "da-guardare", "nome": "N"},
                           con_rete=False)
        finally:
            albo.racc.leggi, albo.link_legali = v_leg, v_link
            albo.racc.robots_permette = v_rob
        self.assertEqual(chiamate, [], "ha scaricato in modalita' SENZA rete")
        self.assertEqual(r["giro"], "cache")

    def test_riusa_le_regex_della_raccolta_e_NON_le_ricopia(self):
        # 🔑 Una seconda copia divergerebbe, e a divergere sarebbe quella che
        # nessuno rilegge.
        import re as _re
        fonte = (QUI / "cerca-albo.py").read_text(encoding="utf-8")
        self.assertNotIn("iscritt[oa]", fonte, "RE_ALBO e' stata RICOPIATA")
        self.assertTrue(albo.racc.RE_ALBO.search("iscritto all'albo"))


class RobotsEGentilezza(unittest.TestCase):
    def test_robots_viene_chiesto_PRIMA_di_leggere(self):
        ordine = []
        v_rob, v_leg, v_link = albo.racc.robots_permette, albo.racc.leggi, albo.link_legali
        albo.racc.robots_permette = lambda u: ordine.append("robots") or False
        albo.racc.leggi = lambda *a, **k: ordine.append("leggi") or (None, None)
        albo.link_legali = lambda d: ["https://x.it/privacy"]
        try:
            r = albo.cerca({"dominio": "x.it", "gruppo": "da-guardare", "nome": "N"}, con_rete=True)
        finally:
            albo.racc.robots_permette, albo.racc.leggi = v_rob, v_leg
            albo.link_legali = v_link
        self.assertEqual(ordine, ["robots"], "ha letto senza chiedere, o dopo aver chiesto")
        self.assertEqual(r["giro"], "robots-vieta")


if __name__ == "__main__":
    unittest.main(verbosity=2)
