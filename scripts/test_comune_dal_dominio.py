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
_spec = importlib.util.spec_from_file_location("cdd", QUI / "comune-dal-dominio.py")
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


if __name__ == "__main__":
    unittest.main(verbosity=2)
