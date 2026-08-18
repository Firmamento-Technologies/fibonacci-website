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


class LaRegolaDellaSiglaEUNASOLA(unittest.TestCase):
    """⚠️ `SIGLA` vive in DUE file, e la copia e' dichiarata nel codice.

    🔴 Il difetto che questo presidio chiude e' **gia' avvenuto**: il
    2026-08-18 `provincia-vera.py` ha ripulito i dati spostando lo slug in
    `cercatoIn`, ⛔ ma `raccolta-cliniche.py` ⛔ non e' stato toccato ⇒ **73
    schede nuove** avevano gia' lo slug di nuovo in `provincia`, e **nessuna**
    aveva `cercatoIn`. Correggere l'istanza ⛔ non chiude la classe.
    """

    def _pattern(self, nome, simbolo):
        import re as _re
        src = (QUI / nome).read_text(encoding="utf-8")
        m = _re.search(simbolo + r'\s*=\s*re\.compile\((r?"[^"]*")\)', src)
        self.assertIsNotNone(m, f"{simbolo} non trovata in {nome}")
        return m.group(1)

    def test_le_due_copie_sono_IDENTICHE(self):
        self.assertEqual(self._pattern("provincia-vera.py", "SIGLA"),
                         self._pattern("raccolta-cliniche.py", "SIGLA_PROVINCIA"))

    def test_la_raccolta_NON_scrive_piu_lo_slug_in_provincia(self):
        # ⛔ La riga `"provincia": provincia,` nuda e' il difetto: scriveva
        # «rivalta-di-torino» dove chi legge si aspetta «TO».
        src = (QUI / "raccolta-cliniche.py").read_text(encoding="utf-8")
        self.assertNotIn('"provincia": provincia,', src)
        self.assertIn('"provincia": provincia if SIGLA_PROVINCIA.match', src)

    def test_la_raccolta_conserva_lo_slug_invece_di_buttarlo(self):
        # Lo slug e' un dato utile (DOVE abbiamo cercato): si rinomina, ⛔ non
        # si perde.
        src = (QUI / "raccolta-cliniche.py").read_text(encoding="utf-8")
        self.assertIn('"cercatoIn": provincia or ""', src)


if __name__ == "__main__":
    unittest.main(verbosity=2)
