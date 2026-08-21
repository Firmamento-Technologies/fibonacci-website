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
        self.assertEqual(dec["si.it"]["tipo"], "persona")

    def test_una_decisione_impresa_porta_a_impresa_NON_a_persona(self):
        # ⚠️ Uno studio che nomina PIU' medici ⛔ non e' un libero professionista:
        # e' un'impresa — che nell'elenco ci sta comunque, ⛔ ma con l'etichetta
        # giusta.
        d = Path(tempfile.mkdtemp())
        (d / "_coda-decisioni.json").write_text(json.dumps({
            "uno.it": {"come": "medico", "nota": "un solo medico"},
            "tanti.it": {"come": "impresa", "nota": "quattro medici"},
            "no.it": {"come": "non-medico", "nota": "centro estetico"},
        }), encoding="utf-8")
        vecchia = racc.USCITA
        try:
            racc.USCITA = str(d)
            dec = racc.carica_decisioni()
        finally:
            racc.USCITA = vecchia
        self.assertEqual(dec["uno.it"]["tipo"], "persona")
        self.assertEqual(dec["tanti.it"]["tipo"], "impresa")
        self.assertNotIn("no.it", dec)

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


class LaDecisioneSopravviveAUnaRaccoltaNUOVA(unittest.TestCase):
    """🔴 Il presidio che mancava, e la nota che l'ha reso necessario.

    `coda-revisione.py` ha portato scritto per giorni «⛔ NON sopravvive a una
    raccolta nuova sullo stesso dominio … → voce aperta», ⛔ **quando il
    cablaggio c'era gia'**. Una nota vecchia costa piu' di una mancante: fa
    ripartire da capo su un problema risolto — e' successo il 2026-08-22.
    ⇒ La frase diventa un test. Se un giorno `analizza()` smettesse di
    consultare le decisioni, qui diventa rosso invece di restare un commento.
    """

    def test_analizza_consulta_le_decisioni_PRIMA_di_classificare(self):
        sorgente = (Path(__file__).parent / "raccolta-cliniche.py").read_text(encoding="utf-8")
        righe = sorgente.split("\n")
        inizio = next(i for i, r in enumerate(righe) if r.startswith("def analizza("))
        fine = next(i for i in range(inizio + 1, len(righe)) if righe[i].startswith("def "))
        corpo = "\n".join(righe[inizio:fine])
        # ⚠️ Si guarda il CORPO di `analizza()`, ⛔ non tutto il file: `DECISE`
        #    compare anche in `riclassifica()`, e quella e' un'altra strada.
        self.assertIn("DECISE", corpo,
                      "analizza() ⛔ non consulta piu' le decisioni: una revisione "
                      "umana verrebbe cancellata alla prossima raccolta, senza errore")

    def test_la_decisione_vince_sul_classificatore_e_non_e_solo_letta(self):
        sorgente = (Path(__file__).parent / "raccolta-cliniche.py").read_text(encoding="utf-8")
        # ⛔ Leggerle e ⛔ non usarle sarebbe lo stesso difetto con un'altra faccia.
        self.assertIn('DECISE[host]["tipo"]', sorgente)
        self.assertIn("DECISE = carica_decisioni()", sorgente)


if __name__ == "__main__":
    unittest.main(verbosity=2)
