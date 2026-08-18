#!/usr/bin/env python3
"""Chi entra nell'elenco, e chi l'ha deciso.

🔴 Questo file nasce da un difetto che e' rimasto invisibile per settimane: la
regola di inclusione era scritta in **due posti** che ⛔ non dicevano la stessa
cosa. `analizza()` escludeva tutto cio' che ⛔ non fosse `impresa`;
`riclassifica()` escludeva solo `incerto` e `non_medico`.
📏 Il risultato misurato: **1.079 schede `persona` ESCLUSE** e 685 dentro, e il
loro motivo diceva «⛔ persona: studio di un professionista: dott. …» — **fuori
dall'elenco dei medici per il fatto di essere medici**. Piu' 150
`non_pertinente` dentro.
"""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("racc", QUI / "raccolta-cliniche.py")
racc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(racc)


class UnaSolaRegolaDiInclusione(unittest.TestCase):
    def test_dentro_impresa_e_persona(self):
        for t in ("impresa", "persona"):
            self.assertEqual(racc.stato_elenco(t, "r"), (False, ""), t)

    def test_fuori_tutto_il_resto(self):
        for t in ("incerto", "non_medico", "non_pertinente"):
            escluso, motivo = racc.stato_elenco(t, "una ragione")
            self.assertTrue(escluso, t)
            self.assertIn(t, motivo, "il motivo deve dire QUALE tipo, non solo che e' escluso")

    def test_una_persona_NON_puo_essere_esclusa(self):
        # 🔴 E' il difetto, in una riga: la regola vecchia di `analizza()` era
        # `tipo != "impresa"`, e mandava fuori 1.079 medici.
        self.assertFalse(racc.stato_elenco("persona", "studio di un professionista")[0])


class LaRevisioneUmanaVince(unittest.TestCase):
    def test_le_decisioni_si_leggono_solo_se_dicono_medico(self):
        d = Path(tempfile.mkdtemp())
        (d / "_coda-decisioni.json").write_text(json.dumps({
            "si.it": {"come": "medico", "nota": "cinque prove"},
            "no.it": {"come": "non-medico", "nota": "e' un centro estetico"},
            "boh.it": {"come": "scarta", "nota": "portale"},
        }), encoding="utf-8")
        vecchia = racc.USCITA
        try:
            racc.USCITA = str(d)
            dec = racc.carica_decisioni()
        finally:
            racc.USCITA = vecchia
        self.assertEqual(set(dec), {"si.it"},
                         "⛔ una decisione «non-medico» o «scarta» NON deve promuovere")

    def test_senza_il_file_non_ci_sono_decisioni_e_NON_si_rompe(self):
        vecchia = racc.USCITA
        try:
            racc.USCITA = tempfile.mkdtemp()
            self.assertEqual(racc.carica_decisioni(), {})
        finally:
            racc.USCITA = vecchia

    def test_un_file_illeggibile_NON_fa_saltare_la_raccolta(self):
        d = Path(tempfile.mkdtemp())
        (d / "_coda-decisioni.json").write_text("{ rotto", encoding="utf-8")
        vecchia = racc.USCITA
        try:
            racc.USCITA = str(d)
            self.assertEqual(racc.carica_decisioni(), {})
        finally:
            racc.USCITA = vecchia


if __name__ == "__main__":
    unittest.main(verbosity=2)
