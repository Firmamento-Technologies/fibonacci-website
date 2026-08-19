#!/usr/bin/env python3
"""Il presidio dei settori della raccolta.

Tre cose, in ordine di quanto costerebbero se si rompessero:

1. **L'estetica di ieri è bit-identica**: `--settore` non deve aver cambiato
   la raccolta viva. Si congelano voci campione dei sei blocchi estratti
   VERBATIM il 2026-08-19 e i due percorsi storici. Se qualcuno «migliora» un
   modello estetico dentro `settori/estetica.py`, questo test lo dice.
2. **Ogni settore è completo e sano**: le 5 famiglie di modelli + PRESTAZIONI
   (regex compilabili) + percorsi PROPRI (⛔ mai quelli di un altro settore:
   due raccolte che condividono lo stato si corrompono a vicenda).
3. **Un settore sconosciuto rifiuta** invece di ripiegare in silenzio
   sull'estetica: il ripiego silenzioso raccoglierebbe filler sotto
   l'etichetta cardiologia.
"""
import importlib.util
import re
import subprocess
import sys
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))

from settori import estetica, endocrinologia, cardiologia  # noqa: E402

TUTTI = {"estetica": estetica, "endocrinologia": endocrinologia,
         "cardiologia": cardiologia}
FAMIGLIE = ("MODELLI", "MODELLI_TRATTAMENTO", "MODELLI_COMUNE",
            "MODELLI_PROFONDI", "MODELLI_PROFESSIONISTI")


def _carica_racc(argv_extra=()):
    import sys as _s
    vecchio = _s.argv
    _s.argv = ["raccolta-cliniche.py", *argv_extra]
    try:
        spec = importlib.util.spec_from_file_location(
            "racc_test", QUI / "raccolta-cliniche.py")
        m = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(m)
        return m
    finally:
        _s.argv = vecchio


class EsteticaBitIdentica(unittest.TestCase):
    """Il settore storico deve essere quello di ieri, virgola per virgola."""

    def test_percorsi_storici(self):
        r = _carica_racc()
        self.assertEqual(r.SETTORE, "estetica")
        self.assertTrue(r.USCITA.endswith("src/dati/cliniche"),
                        "il default DEVE scrivere dove ha sempre scritto")
        self.assertTrue(r.STATO_P6.endswith("stato-scoperta.json"))

    def test_voci_campione_congelate(self):
        # Una voce per famiglia, presa dal file di ieri: se cambia, qualcuno
        # ha toccato la raccolta VIVA credendo di toccare una copia.
        self.assertEqual(estetica.MODELLI[0], "studio medicina estetica {c}")
        self.assertIn("botulino {c} medico", estetica.MODELLI_TRATTAMENTO)
        self.assertEqual(estetica.MODELLI_COMUNE[0], "medicina estetica {c}")
        self.assertIn("ultherapy {c}", estetica.MODELLI_PROFONDI)
        self.assertIn('"medico estetico" {c} "iscritto all\'albo"',
                      estetica.MODELLI_PROFESSIONISTI)
        self.assertEqual(estetica.PRESTAZIONI["Filler"],
                         r"\bfiller\b|acido\s+ialuronico")
        self.assertEqual(len(estetica.PRESTAZIONI), 10)

    def test_il_default_usa_davvero_il_modulo_estetica(self):
        r = _carica_racc()
        self.assertIs(r.MODELLI, estetica.MODELLI)
        self.assertIs(r.PRESTAZIONI, estetica.PRESTAZIONI)


class OgniSettoreECompleto(unittest.TestCase):

    def test_famiglie_presenti_e_non_vuote(self):
        for slug, mod in TUTTI.items():
            for fam in FAMIGLIE:
                voci = getattr(mod, fam, None)
                self.assertIsInstance(voci, list, f"{slug}.{fam}")
                self.assertGreater(len(voci), 0, f"{slug}.{fam} vuota")
                for v in voci:
                    self.assertIn("{c}", v,
                                  f"{slug}.{fam}: {v!r} senza il segnaposto città")

    def test_prestazioni_regex_compilabili(self):
        for slug, mod in TUTTI.items():
            self.assertGreaterEqual(len(mod.PRESTAZIONI), 8, slug)
            for nome, rx in mod.PRESTAZIONI.items():
                re.compile(rx)  # esplode se non compila

    def test_percorsi_propri_mai_condivisi(self):
        # 🔴 Il difetto che questo previene: due scoperte che scrivono lo
        # stesso stato si corrompono a vicenda (json.dump non atomica).
        cartelle = [m.CARTELLA_SCHEDE for m in TUTTI.values()]
        stati = [m.FILE_STATO for m in TUTTI.values()]
        self.assertEqual(len(set(cartelle)), len(cartelle), cartelle)
        self.assertEqual(len(set(stati)), len(stati), stati)
        for slug, mod in TUTTI.items():
            if slug != "estetica":
                self.assertIn(slug, mod.CARTELLA_SCHEDE)
                self.assertIn(slug, mod.FILE_STATO)

    def test_settori_nuovi_caricano_dal_motore(self):
        r = _carica_racc(("--settore=cardiologia",))
        self.assertEqual(r.SETTORE, "cardiologia")
        self.assertTrue(r.USCITA.endswith("cliniche-cardiologia"))
        self.assertIn("Elettrocardiogramma (ECG)", r.PRESTAZIONI)


class SettoreSconosciutoRifiuta(unittest.TestCase):

    def test_rifiuto_esplicito_non_ripiego(self):
        # ⛔ Il ripiego silenzioso su estetica raccoglierebbe filler sotto
        # l'etichetta di un altro settore. Meglio morire spiegando.
        esito = subprocess.run(
            [sys.executable, str(QUI / "raccolta-cliniche.py"),
             "--settore=inesistente"],
            capture_output=True, text=True, timeout=60,
            env={"PYTHONDONTWRITEBYTECODE": "1", "PATH": "/usr/bin:/bin"})
        self.assertEqual(esito.returncode, 2)
        self.assertIn("settore sconosciuto", esito.stdout + esito.stderr)
        self.assertIn("estetica", esito.stdout + esito.stderr,
                      "il rifiuto deve elencare i settori noti")


if __name__ == "__main__":
    unittest.main(verbosity=2)
