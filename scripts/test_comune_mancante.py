#!/usr/bin/env python3
"""Il comune estratto dal dominio: i casi veri, e le quattro trappole.

🔴 Le stringhe qui sotto vengono da **domini reali**. Ognuna delle quattro
trappole ha prodotto, in una versione precedente, un comune **sbagliato** che
sembrava confermato.
"""
import importlib.util
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("cdd", QUI / "comune-mancante.py")
cdd = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cdd)

# provincia → comuni noti, come li costruisce `carica()`
PROV = {"br": ["brindisi"], "pd": ["padova"], "va": ["varese"], "rg": ["ragusa"],
        "mi": ["milano"], "to": ["torino"], "at": ["asti"], "sa": ["salerno"]}


def sch(dominio, provincia, nome=""):
    return {"dominio": dominio, "provincia": provincia, "nome": nome}


class ICasiVeri(unittest.TestCase):
    def test_il_pezzo_finisce_col_comune_dopo_una_parola_nota(self):
        for d, p, att in (("medicinaesteticabrindisi.com", "br", "brindisi"),
                          ("chirurgiaesteticavarese.com", "va", "varese"),
                          ("medicoesteticomilano.it", "mi", "milano")):
            self.assertEqual(cdd.estrai(sch(d, p), PROV)[0], att, d)

    def test_il_prefisso_sconosciuto_va_bene_se_il_TITOLO_nomina_la_citta(self):
        # `dermacare|padova`: «dermacare» ⛔ non sarà mai in una lista scritta a
        # mano. Il titolo e' un secondo segnale preso **dai dati**.
        self.assertEqual(cdd.estrai(sch("dermacarepadova.it", "pd",
                                        "Dermacare: Dermatologia e Medicina Estetica a Padova"),
                                    PROV)[0], "padova")

    def test_ma_il_titolo_deve_dirlo_come_PAROLA_INTERA(self):
        # 🔴 «Dott.ssa Daniela Siragusa» contiene «ragusa» come pezzo di
        # cognome: cercarlo come sottostringa riaprirebbe la trappola.
        self.assertIsNone(cdd.estrai(sch("danielasiragusa.it", "rg",
                                         "Dott.ssa Daniela Siragusa"), PROV)[0])

    def test_il_pezzo_E_il_comune(self):
        self.assertEqual(cdd.estrai(sch("dermatologia-ferrara.it", "fe"),
                                    {"fe": ["ferrara"]})[0], "ferrara")

    def test_il_pezzo_inizia_col_comune(self):
        self.assertEqual(cdd.estrai(sch("milanoklinik.com", "mi"), PROV)[0], "milano")

    def test_la_provenienza_viene_spiegata(self):
        _, perche = cdd.estrai(sch("medicinaesteticabrindisi.com", "br"), PROV)
        self.assertIn("brindisi", "medicinaesteticabrindisi")
        self.assertTrue(perche and "comune" in perche)


class LeQuattroTrappole(unittest.TestCase):
    def test_1_il_comune_DENTRO_una_parola(self):
        # «asti» sta dentro «chirurgia-pl-ASTI-ca». Con la provincia AT sembrava
        # perfino confermato.
        self.assertIsNone(cdd.estrai(sch("chirurgiaplasticadrleva.it", "at"), PROV)[0])

    def test_2_un_cognome_che_FINISCE_col_comune(self):
        # 🔴 `danielaSIRAGUSA.it` con provincia RG: due controlli d'accordo, e
        # sbagliato. Davanti a «ragusa» c'e' «danielasi», che ⛔ non e' una parola.
        self.assertIsNone(cdd.estrai(sch("danielasiragusa.it", "rg"), PROV)[0])

    def test_3_niente_provincia_niente_estrazione(self):
        # ⛔ Senza la seconda prova ⛔ non si indovina.
        self.assertIsNone(cdd.estrai(sch("medicinaesteticabrindisi.com", ""), PROV)[0])
        self.assertIsNone(cdd.estrai(sch("medicinaesteticabrindisi.com", "zz"), PROV)[0])

    def test_4_la_provincia_SBAGLIATA_non_conferma(self):
        # Se il dominio dice Brindisi ma la scheda dice Padova, ⛔ non si scrive
        # niente: le due prove devono essere **d'accordo**.
        self.assertIsNone(cdd.estrai(sch("medicinaesteticabrindisi.com", "pd"), PROV)[0])


class LaSpazzaturaNonEUnComune(unittest.TestCase):
    def test_le_parole_del_mestiere_sono_escluse_dalla_lista(self):
        for p in ("medicina", "estetica", "centro", "studio", "clinica", "chirurgia"):
            self.assertIn(p, cdd.SPAZZATURA, p)

    def test_medicina_estetica_milano_da_MILANO_non_MEDICINA(self):
        # «Medicina» E' un comune vero (BO), ⛔ ma qui e' la parola.
        self.assertEqual(cdd.estrai(sch("medicina-estetica-milano.it", "mi"), PROV)[0], "milano")


class ILimitiDichiarati(unittest.TestCase):
    def test_sotto_le_sei_lettere_NON_si_cerca(self):
        self.assertGreaterEqual(cdd.MIN, 6, "sotto le 6 lettere il rumore vince")

    def test_un_cognome_che_E_una_citta_passa_ed_e_dichiarato(self):
        # ⚠️ `valeria-salerno.com` con provincia SA: «Salerno» e' il COGNOME.
        # Passa, e ⛔ non c'e' modo di distinguerlo — ⛔ ma la provincia dice SA,
        # quindi il comune scritto resta **plausibile**. Il test esiste per
        # ⛔ non far credere che il caso sia coperto.
        self.assertEqual(cdd.estrai(sch("valeria-salerno.com", "sa"), PROV)[0], "salerno")


class LaProvenienzaDiceIlMetodoVERO(unittest.TestCase):
    def test_il_CAP_non_si_etichetta_come_dominio(self):
        # 🔴 Il prefisso era **fisso**: i 145 comuni venuti dal CAP si
        # portavano dietro «dal dominio». Una provenienza che ⛔ non dice il
        # metodo vero ⛔ non serve a niente.
        _, perche = cdd.estrai_dal_cap({"provincia": "na"}, {"80129": ("Napoli", "na")},
                                       "… 80129 …")
        self.assertTrue(perche.startswith("dal CAP"))
        self.assertNotIn("dal dominio", perche)


class MetodoB_DalCap(unittest.TestCase):
    """Il CAP e' un **codice**: ⛔ non e' ambiguo come una parola in un dominio."""

    MAPPA = {"80129": ("Napoli", "na"), "16128": ("Genova", "ge"), "05100": ("Terni", "tr")}

    def test_il_CAP_nella_pagina_da_il_comune(self):
        c, perche = cdd.estrai_dal_cap({"provincia": "na"}, self.MAPPA,
                                       "Via G. L. Bernini 45, 80129 Tel 081...")
        self.assertEqual(c, "Napoli")
        self.assertIn("80129", perche)

    def test_se_la_provincia_CONTRADDICE_il_CAP_non_si_sceglie(self):
        # 🔴 Misurato: 234 casi. Sceglierne uno a caso avrebbe messo studi nella
        # città sbagliata — e in un elenco per vicinanza è il danno peggiore.
        self.assertIsNone(cdd.estrai_dal_cap({"provincia": "ge"}, self.MAPPA,
                                             "… 80129 …")[0])

    def test_senza_provincia_il_CAP_basta(self):
        self.assertEqual(cdd.estrai_dal_cap({"provincia": ""}, self.MAPPA, "… 05100 …")[0],
                         "Terni")

    def test_un_numero_di_5_cifre_dentro_uno_piu_lungo_NON_e_un_CAP(self):
        # ⚠️ La prima versione di questo test era VUOTA: usava una P.IVA le cui
        # prime cifre ⛔ non erano un CAP mappato, quindi restava verde anche
        # togliendo i confini. Qui «80129» sta **dentro** la P.IVA.
        self.assertIsNone(cdd.estrai_dal_cap({"provincia": "na"}, self.MAPPA,
                                             "P.IVA 80129123456")[0])

    def test_un_numero_fuori_dall_intervallo_italiano(self):
        # 🔴 `00000` aveva imparato «Bergamo» e l'ha dato a **11 schede**.
        for c in ("00000", "00001", "99999", "abcde"):
            self.assertFalse(cdd.cap_plausibile(c), c)
        for c in ("00010", "20100", "98168", "80129"):
            self.assertTrue(cdd.cap_plausibile(c), c)

    def test_l_intervallo_NON_basta_a_escludere_i_CAP_STRANIERI(self):
        # ⚠️ **Dichiarato, ⛔ non nascosto**: `13485` (Berlino), `27701`
        # (Durham), `60606` (**Chicago**) cadono **dentro** l'intervallo
        # italiano. L'intervallo prende `00000`; gli stranieri li prende
        # l'altra guardia — il **nome del comune** in `SPAZZATURA`.
        # 🔑 Due problemi diversi, due guardie diverse: crederne una sola
        # sufficiente e' come credere che due prove d'accordo siano due prove.
        for c in ("13485", "27701", "60606"):
            self.assertTrue(cdd.cap_plausibile(c), c)
        for nome in ("Chicago", "ZoomInfo", "Catálogo"):
            schede = [(None, {"cap": "60606", "comune": nome, "provincia": "mi"})] * 3
            self.assertNotIn("60606", cdd.mappa_cap(schede), nome)

    def test_un_CAP_non_plausibile_NON_da_il_comune(self):
        self.assertIsNone(cdd.estrai_dal_cap({"provincia": "bg"}, {"00000": ("Bergamo", "bg")},
                                             "… 00000 …")[0])

    def test_i_valori_che_NON_sono_comuni_italiani_restano_fuori(self):
        # 🔴 «Zagreb», «GDPR», «USA», «Monday» stavano nel campo `comune` di
        # qualche scheda. Finche' `provincia` conteneva uno slug, il confronto
        # fra province li teneva fuori **per caso**; corretto quel campo, la
        # guardia e' caduta e sono usciti — 12 schede sarebbero finite a Zagabria.
        for v in ("Zagreb", "GDPR", "USA", "Monday", "Handcrafted"):
            schede = [(None, {"cap": "20100", "comune": v, "provincia": "mi"})] * 3
            self.assertNotIn("20100", cdd.mappa_cap(schede), v)

    def test_i_nomi_composti_TAGLIATI_A_META_non_entrano(self):
        # 🔴 «Porto» arrivava dal CAP 07046, che e' **Porto Torres**: la mappa
        # aveva imparato il nome monco da una scheda sbagliata.
        for v in ("Porto", "Torre", "Campo", "Sesto", "Rocca", "Pieve"):
            schede = [(None, {"cap": "07046", "comune": v, "provincia": "ss"})] * 3
            self.assertNotIn("07046", cdd.mappa_cap(schede), v)

    def test_il_comune_si_scrive_come_va_scritto(self):
        # 🔴 Il metodo dal dominio scriveva «genova» minuscolo, la forma
        # appiattita che serve solo a **confrontare**.
        veri = cdd.nomi_veri([(None, {"comune": "Genova"}), (None, {"comune": "Genova"}),
                              (None, {"comune": "Reggio Emilia"})])
        self.assertEqual(veri["genova"], "Genova")
        self.assertEqual(veri["reggioemilia"], "Reggio Emilia")

    def test_i_comuni_TRONCATI_non_entrano_nella_mappa(self):
        # «San» ⛔ non e' un comune: e' un nome tagliato a meta' in una scheda
        # sbagliata. Misurato: 5 schede sarebbero finite a «San».
        schede = [(None, {"cap": "47030", "comune": "San", "provincia": "fc"}),
                  (None, {"cap": "47030", "comune": "San", "provincia": "fc"})]
        self.assertNotIn("47030", cdd.mappa_cap(schede))

    def test_i_CAP_AMBIGUI_non_entrano_nella_mappa(self):
        # 326 CAP su 2.022 compaiono con più comuni: un CAP che punta a due
        # posti ⛔ non e' una prova.
        schede = [(None, {"cap": "20100", "comune": "Milano", "provincia": "mi"}),
                  (None, {"cap": "20100", "comune": "Sesto", "provincia": "mi"}),
                  (None, {"cap": "16128", "comune": "Genova", "provincia": "ge"}),
                  (None, {"cap": "16128", "comune": "Genova", "provincia": "ge"})]
        mp = cdd.mappa_cap(schede)
        self.assertNotIn("20100", mp, "un CAP ambiguo ⛔ non deve entrare")
        self.assertEqual(mp["16128"], ("Genova", "ge"))


class IlGiroINTERO_scriveSuFile(unittest.TestCase):
    """⚠️ Prova d'integrazione, e ⛔ non e' un lusso.

    🔴 Le prove per mutazione hanno mostrato **tre volte in un giorno** che un
    test puo' verificare una funzione **senza che nessuno la chiami**: qui
    `nomi_veri()` era giusta e `main()` ⛔ non la usava, e la mutazione
    sopravviveva. ⇒ un test che si ferma alla funzione ⛔ non copre il
    **cablaggio**.
    """

    def test_il_comune_scritto_sul_FILE_ha_le_maiuscole_giuste(self):
        import contextlib, io, json, sys, tempfile
        d = Path(tempfile.mkdtemp())
        (d / "prova.json").write_text(json.dumps([
            # due schede che insegnano come si scrive «Genova»…
            {"dominio": "a.it", "comune": "Genova", "provincia": "ge", "cap": "16121"},
            {"dominio": "b.it", "comune": "Genova", "provincia": "ge", "cap": "16121"},
            # …e una senza comune, il cui dominio finisce per «genova»
            {"dominio": "andigenova.it", "comune": "", "provincia": "ge",
             "nome": "ANDI Genova"},
        ], ensure_ascii=False), encoding="utf-8")
        vecchie = (cdd.CARTELLA, sys.argv)
        try:
            cdd.CARTELLA = d
            sys.argv = ["x", "--scrivi"]
            with contextlib.redirect_stdout(io.StringIO()):   # ⚠️ il rapporto coprirebbe il verdetto
                cdd.main()
        finally:
            cdd.CARTELLA, sys.argv = vecchie
        scritte = {r["dominio"]: r for r in json.loads((d / "prova.json").read_text(encoding="utf-8"))}
        self.assertEqual(scritte["andigenova.it"]["comune"], "Genova",
                         "il giro intero ha scritto la forma appiattita")


if __name__ == "__main__":
    unittest.main(verbosity=2)
