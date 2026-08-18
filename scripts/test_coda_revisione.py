#!/usr/bin/env python3
"""La coda di revisione: che cosa ci entra, come si ordina, e che cosa ⛔ NON fa.

🔴 Il presidio che conta e' l'ultimo: **la coda ⛔ non promuove niente**. Se un
giorno qualcuno la fa scrivere nell'elenco, quel test diventa rosso — ed e' il
punto, perche' «dichiara un iniettivo» prova UNA di due cose, e solo una
appartiene a un elenco di medici.
"""
import importlib.util
import sys
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("coda", QUI / "coda-revisione.py")
coda = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(coda)


def scheda(**kw):
    base = {"dominio": "x.it", "tipoSoggetto": "incerto", "prestazioni": ["Filler"],
            "nome": "Studio X", "nomeStrutturato": None, "comune": "Milano"}
    base.update(kw)
    return base


def gruppo(**kw):
    c = coda.costruisci({"x.it": scheda(**kw)}, {})
    return c[0]["gruppo"] if c else None


class CheCosaEntra(unittest.TestCase):
    def test_incerto_con_iniettivo_entra(self):
        self.assertIsNotNone(gruppo())

    def test_incerto_SENZA_iniettivo_NON_entra(self):
        # Laser ed epilazione le fa anche un centro estetico: ⛔ non sono un segno.
        self.assertIsNone(gruppo(prestazioni=["Laser", "Epilazione", "Radiofrequenza"]))

    def test_impresa_con_iniettivo_NON_entra(self):
        # E' gia' nell'elenco: la coda serve agli ESCLUSI.
        self.assertIsNone(gruppo(tipoSoggetto="impresa"))

    def test_persona_con_iniettivo_NON_entra(self):
        self.assertIsNone(gruppo(tipoSoggetto="persona"))

    def test_senza_prestazioni_NON_entra(self):
        self.assertIsNone(gruppo(prestazioni=[]))


class ComeSiRaggruppa(unittest.TestCase):
    def test_titolo_nel_nome(self):
        self.assertEqual(gruppo(nome="Dott.ssa Stefania La Morgia"), "medico-probabile")
        self.assertEqual(gruppo(nome="Chirurgo Plastico Milano"), "medico-probabile")

    def test_il_nome_che_SEMBRA_una_persona_NON_basta(self):
        # 🔴 La regola c'era ed e' stata TOLTA misurandola: su 254 schede che la
        # superavano c'erano «Best Dermatology NYC» e «The Tweakments Guide».
        # ⇒ «due parole maiuscole» ⛔ non distingue una persona da un marchio.
        for n in ("Alessandra Ranza", "AD Aesthetics", "Art of Dermatology",
                  "Hyaluronic Filler Market"):
            self.assertEqual(gruppo(nome=n), "da-guardare", n)

    def test_bellezza_senza_termini_medici(self):
        for n in ("Estetista Irene", "Centro Estetico Porto Torres", "Amira Estetica Avanzata"):
            self.assertEqual(gruppo(nome=n), "segnale-contrario", n)

    def test_bellezza_CON_un_termine_medico_NON_e_segnale_contrario(self):
        # 🔴 «MEDICINA ESTETICA AVANZATA» e «Beautystudium Chirurgia Estetica»
        # contengono il lessico di bellezza **e** nominano la medicina.
        for n in ("MEDICINA ESTETICA AVANZATA", "Beautystudium Chirurgia Estetica e Medicina",
                  "Medical Beauty Milano Dott. Rossi"):
            self.assertNotEqual(gruppo(nome=n), "segnale-contrario", n)

    def test_nome_commerciale_qualsiasi(self):
        self.assertEqual(gruppo(nome="AD Aesthetics"), "da-guardare")


class SenzaCollocazione(unittest.TestCase):
    """🔵 Un elenco funziona per vicinanza: senza un luogo ⛔ non e' un candidato."""

    def test_niente_comune_niente_piva_niente_telefono_italiano(self):
        self.assertEqual(gruppo(nome="Dott. Mario Rossi", comune="", telefono="+15551234"),
                         "senza-collocazione")

    def test_il_titolo_NON_scavalca_la_collocazione(self):
        # ⚠️ L'ordine conta: prima «dove sei», poi «chi sei».
        self.assertEqual(gruppo(nome="Dott.ssa Anna Bianchi", comune=""), "senza-collocazione")

    def test_basta_UNO_dei_tre_segni(self):
        for k, val in (("comune", "Roma"), ("partitaIva", "01234567890"),
                       ("telefono", "+39 06 1234567"), ("telefono", "0612345")):
            campi = {"nome": "Dott. Mario Rossi", "comune": "", "telefono": "", k: val}
            self.assertNotEqual(gruppo(**campi), "senza-collocazione", f"{k}={val}")


class ComeSiOrdina(unittest.TestCase):
    def test_prima_i_medici_probabili_poi_il_segnale_contrario(self):
        s = {
            "a.it": scheda(dominio="a.it", nome="Centro Estetico Alfa"),
            "b.it": scheda(dominio="b.it", nome="Dott. Mario Rossi"),
            "c.it": scheda(dominio="c.it", nome="AD Aesthetics"),
            "d.it": scheda(dominio="d.it", nome="Dott. Ugo Bianchi", comune="", telefono="+1555"),
        }
        self.assertEqual([r["gruppo"] for r in coda.costruisci(s, {})],
                         ["medico-probabile", "da-guardare", "segnale-contrario",
                          "senza-collocazione"])

    def test_piu_iniettivi_dichiarati_viene_prima(self):
        s = {
            "a.it": scheda(dominio="a.it", nome="Dott. A", prestazioni=["Filler"]),
            "b.it": scheda(dominio="b.it", nome="Dott. B",
                           prestazioni=["Filler", "Tossina botulinica", "Mesoterapia"]),
        }
        self.assertEqual([r["dominio"] for r in coda.costruisci(s, {})], ["b.it", "a.it"])


class CheCosaLaCodaNONFa(unittest.TestCase):
    def test_NON_promuove_e_NON_modifica_la_scheda(self):
        # 🔴 Il presidio piu' importante del file.
        s = scheda(nome="Dott. Mario Rossi")
        prima = dict(s)
        r = coda.costruisci({"x.it": s}, {})[0]
        self.assertEqual(s, prima, "la coda ha MODIFICATO la scheda")
        self.assertEqual(s["tipoSoggetto"], "incerto", "la coda ha PROMOSSO la scheda")
        self.assertNotIn("escluso", r, "la coda ⛔ non decide l'inclusione nell'elenco")

    def test_una_decisione_gia_presa_resta_attaccata(self):
        r = coda.costruisci({"x.it": scheda()}, {"x.it": {"come": "medico", "nota": "albo"}})[0]
        self.assertEqual(r["decisa"], {"come": "medico", "nota": "albo"})


class IlNomeProprioDopoIlTitolo(unittest.TestCase):
    """Separa `Dott.ssa Monica Congiu` da `Chirurgo Plastico a Milano`."""

    def test_riconosce_un_nome_proprio(self):
        for t, att in (("Dott.ssa Monica Congiu", "Monica"),
                       ("Dott. Mario Loris Alagni", "Mario"),
                       ("Dr. Salvatore Rao", "Salvatore")):
            self.assertEqual(coda.nome_proprio(t), att, t)

    def test_le_MAIUSCOLE_contano_come_nome(self):
        self.assertEqual(coda.nome_proprio("DOTT.SSA GABRIELLA FRATTINI"), "GABRIELLA")

    def test_la_bandiera_re_I_serve(self):
        # 🔴 Senza `re.I` il modello cerca `dott` minuscolo e nei titoli c'e'
        # `Dott.ssa`: il gruppo A contava **1** scheda invece di 38, ⛔ senza
        # protestare. Questo test lo prende.
        self.assertIsNotNone(coda.nome_proprio("Dott.ssa Monica Congiu"))
        self.assertIsNotNone(coda.nome_proprio("DR. MARIO ROSSI"))

    def test_una_QUALIFICA_non_e_un_nome(self):
        for t in ("Chirurgo Plastico a Milano", "Studio Medico Gioana",
                  "Dott. Dentista a Rho", "Dr. Chirurgo Estetico"):
            self.assertIsNone(coda.nome_proprio(t), t)

    def test_le_parole_d_interfaccia_non_sono_nomi(self):
        # 🔴 Cercando nel CORPO della pagina si estraeva «Prenota» da «Dott…
        # Prenota una visita», e la regola prometteva a `persona` l'ASL di
        # Novara e un giornale locale. ⇒ si guarda solo il NOME della scheda,
        # e queste parole restano escluse comunque.
        for t in ("Dott. Prenota una visita", "Dr. Contatti", "Dott. Scopri di piu'"):
            self.assertIsNone(coda.nome_proprio(t), t)


class IDueGruppiDecisi(unittest.TestCase):
    """A e B sono **disgiunti**: la partita IVA li separa, ⛔ non li ordina."""

    def _coda(self):
        s = {
            "a.it": scheda(dominio="a.it", nome="Dott.ssa Anna Bianchi", partitaIva="01234567890"),
            "b.it": scheda(dominio="b.it", nome="Dott. Marco Verdi"),
            "c.it": scheda(dominio="c.it", nome="Chirurgo Plastico a Milano",
                           partitaIva="09876543210"),
        }
        return {r["dominio"]: r for r in coda.costruisci(s, {})}

    def test_A_vuole_la_partita_IVA_e_B_la_esclude(self):
        # ⚠️ Si chiama `gruppo_deciso()`, ⛔ NON si riscrive il criterio: un test
        # che riscrive il criterio **conferma se stesso** e ⛔ non diventa mai
        # rosso quando il codice cambia.
        righe = coda.costruisci({
            "a.it": scheda(dominio="a.it", nome="Dott.ssa Anna Bianchi", partitaIva="01234567890"),
            "b.it": scheda(dominio="b.it", nome="Dott. Marco Verdi"),
            "c.it": scheda(dominio="c.it", nome="Chirurgo Plastico a Milano",
                           partitaIva="09876543210"),
        }, {})
        A = [r["dominio"] for r in coda.gruppo_deciso(righe, True)]
        B = [r["dominio"] for r in coda.gruppo_deciso(righe, False)]
        self.assertEqual(A, ["a.it"])
        self.assertEqual(B, ["b.it"])
        self.assertEqual(set(A) & set(B), set(), "una scheda ⛔ non puo' stare in A e in B")

    def test_chi_ha_solo_una_QUALIFICA_resta_fuori_da_entrambi(self):
        # 🔴 «Chirurgo Plastico a Milano» ha la partita IVA ⛔ ma ⛔ nessun nome
        # proprio: ⛔ non entra ne' in A ne' in B. E' il gruppo C, che ⛔ non si
        # promuove: «Studio Medico X» puo' essere uno studio con piu' medici.
        c = self._coda()
        self.assertIsNone(coda.nome_proprio(c["c.it"]["nome"]))


if __name__ == "__main__":
    unittest.main(verbosity=2)
