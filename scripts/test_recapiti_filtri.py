#!/usr/bin/env python3
"""I filtri dell'informativa, e i due modi in cui toglievano troppo.

⚠️ Questo file nasce **dopo** il difetto, ⛔ non prima: il 18 agosto il filtro
toglieva **306** recapiti e **122** li toglieva per la ragione sbagliata (il 40%).
Nessun errore, nessun rosso: i recapiti semplicemente non c'erano.

🔑 Il presidio che conta ⛔ non è «il filtro funziona», è **contare per categoria
che cosa toglie**: un filtro che toglie sembra sempre che stia lavorando.
"""
import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from recapiti_filtri import _e_nominativa, _origine_non_propria, studi_per_dominio


class LaCasellaGratuitaNonEUnAgenzia(unittest.TestCase):
    """🔴 Il difetto che ha tolto 102 recapiti di studi veri."""

    def test_gmail_condiviso_da_ottantatre_studi_resta(self):
        righe = [(f"Studio {i}", f"studio{i}@gmail.com") for i in range(83)]
        mappa = studi_per_dominio(righe)
        self.assertEqual(len(mappa["gmail.com"]), 83)
        for _, e in righe:
            self.assertFalse(_origine_non_propria(e, mappa), e)

    def test_ogni_provider_gratuito_dell_elenco(self):
        for dom in ("libero.it", "hotmail.it", "alice.it", "tiscali.it", "virgilio.it"):
            mappa = studi_per_dominio([(f"Studio {i}", f"s{i}@{dom}") for i in range(5)])
            self.assertFalse(_origine_non_propria(f"s0@{dom}", mappa), dom)


class SiContanoINomiNonLeRighe(unittest.TestCase):
    """🔴 Il difetto che ha tolto altri 20 recapiti: righe doppie in archivio."""

    def test_due_righe_dello_STESSO_studio_non_fanno_un_portale(self):
        mappa = studi_per_dominio([("Centro Alfa", "info@alfa.it"), ("Centro Alfa", "info@alfa.it")])
        self.assertFalse(_origine_non_propria("info@alfa.it", mappa))

    def test_due_studi_DIVERSI_sullo_stesso_dominio_restano_sospetti(self):
        mappa = studi_per_dominio([("Centro Alfa", "info@web.it"), ("Centro Beta", "info@web.it")])
        self.assertTrue(_origine_non_propria("info@web.it", mappa))


class CioCheDeveRestareTolto(unittest.TestCase):
    """⛔ Le correzioni ⛔ non devono spegnere il filtro: questi restano fuori."""

    def test_agenzia_con_sette_studi(self):
        mappa = studi_per_dominio([(f"Studio {i}", "info@agenziaweb.com") for i in range(7)])
        self.assertTrue(_origine_non_propria("info@agenziaweb.com", mappa))

    def test_segnaposto_e_portali_anche_se_unici(self):
        for e in ("info@mysite.com", "info@website.com", "x@paginegialle.it", "y@miodottore.it"):
            self.assertTrue(_origine_non_propria(e, studi_per_dominio([("S", e)])), e)

    def test_indirizzo_nominativo(self):
        for e in ("mario.rossi@studio.it", "dr.bianchi@clinica.it"):
            self.assertTrue(_e_nominativa(e), e)

    def test_il_ruolo_col_suffisso_NON_e_nominativo(self):
        # ⚠️ La prima versione larga ne contava 95 prendendo dentro questi.
        for e in ("info.shop@x.it", "info.albamedica@x.it", "segreteria.milano@x.it"):
            self.assertFalse(_e_nominativa(e), e)


if __name__ == "__main__":
    unittest.main(verbosity=2)
