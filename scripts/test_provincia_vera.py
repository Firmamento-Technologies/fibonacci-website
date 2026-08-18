#!/usr/bin/env python3
"""`provincia`: il campo conteneva DOVE ABBIAMO CERCATO, ⛔ non dove sta lo studio.

🔴 Il difetto ⛔ non era di formato. Su 7.312 schede il valore era uno slug
(«mazzarino», «cadelbosco-di-sopra»), ⛔ ma quello slug e' **il posto in cui la
ricerca stava guardando**: `dolomitimedica.it` ha slug
`san-giorgio-delle-pertiche` e lo studio sta a **Castelfranco (TV)**.
⇒ tradurre lo slug in sigla avrebbe reso il dato **falso ma credibile**.
📏 E anche fra le schede con una sigla, **224 su 1.760 (13%)** erano smentite dal
loro stesso comune: `gemaclinique.it`, comune **Roma**, sigla **na**.
"""
import importlib.util
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("pv", QUI / "provincia-vera.py")
pv = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(pv)

CAPO = {"roma": "rm", "milano": "mi", "padova": "pd"}


class DalComuneCapoluogo(unittest.TestCase):
    def test_il_comune_capoluogo_da_la_sigla(self):
        s, perche = pv.provincia_vera({"comune": "Roma"}, CAPO, {})
        self.assertEqual(s, "rm")
        self.assertIn("capoluogo", perche)

    def test_funziona_con_accenti_e_maiuscole(self):
        self.assertEqual(pv.provincia_vera({"comune": "PADOVA"}, CAPO, {})[0], "pd")

    def test_un_comune_qualsiasi_NON_da_la_sigla(self):
        self.assertIsNone(pv.provincia_vera({"comune": "Grottaferrata"}, CAPO, {})[0])


class DalCapDominante(unittest.TestCase):
    def test_serve_almeno_3_schede_E_almeno_l_80_percento(self):
        # ⚠️ Doppia soglia: senza, 144 CAP su 796 risultavano ambigui — e un CAP
        # intero identifica UN solo comune, quindi l'ambiguita' e' delle SIGLE
        # che gia' abbiamo, ⛔ non del CAP.
        forte = [{"cap": "00191", "provincia": "rm"} for _ in range(5)]
        self.assertEqual(pv.sigle_dai_cap(forte).get("00191"), "rm")

    def test_due_schede_NON_bastano(self):
        self.assertNotIn("00191", pv.sigle_dai_cap([{"cap": "00191", "provincia": "rm"}] * 2))

    def test_una_maggioranza_debole_NON_basta(self):
        misto = ([{"cap": "00191", "provincia": "rm"}] * 3 +
                 [{"cap": "00191", "provincia": "na"}] * 3)
        self.assertNotIn("00191", pv.sigle_dai_cap(misto))

    def test_gli_slug_NON_entrano_nella_mappa(self):
        # Solo le sigle di due lettere contano: uno slug ⛔ non e' una provincia.
        slugs = [{"cap": "00191", "provincia": "mazzarino"}] * 9
        self.assertEqual(pv.sigle_dai_cap(slugs), {})


class CosaSuccedeAiDatiSbagliati(unittest.TestCase):
    def test_una_sigla_smentita_dal_comune_viene_CORRETTA(self):
        # `gemaclinique.it`: comune Roma, sigla «na».
        s, _ = pv.provincia_vera({"comune": "Roma", "provincia": "na"}, CAPO, {})
        self.assertEqual(s, "rm")

    def test_dove_NON_e_ricavabile_si_resta_senza(self):
        # 🔑 Un campo vuoto e' onesto; un campo pieno e sbagliato fa passare le
        # conferme che gli si appoggiano.
        self.assertIsNone(pv.provincia_vera({"comune": "", "cap": ""}, CAPO, {})[0])
        self.assertIsNone(pv.provincia_vera({"comune": "Vattelapesca"}, CAPO, {})[0])


if __name__ == "__main__":
    unittest.main(verbosity=2)
