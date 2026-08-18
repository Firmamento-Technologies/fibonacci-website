#!/usr/bin/env python3
"""Il riconoscimento della PERSONA in `classifica()`: le forme vere dei nomi.

🔴 Le stringhe qui sotto sono **copiate da schede vere rimaste in coda**, ⛔ non
inventate. Il 2026-08-18 il classificatore lasciava in «incerto»
`Dott.ssa Roberta Di Maggio` su `dottoressadimaggio.it`: il nome era nella
scheda, il cognome era nel dominio, e ⛔ nessuna delle due cose veniva letta.

⚠️ **La soglia dei 6 caratteri del cognome ⛔ NON si tocca**: è misurata
(2026-08-16), e sotto i 6 il rischio che una parola comune coincida col dominio
diventa reale. C'e' un test che lo presidia.
"""
import importlib.util
import unittest
from pathlib import Path

QUI = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("racc", QUI / "raccolta-cliniche.py")
racc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(racc)


class IlTitoloScrittoPerEsteso(unittest.TestCase):
    """🔴 «Dottoressa» e «Dottor» ⛔ non venivano riconosciuti."""

    def test_forme_abbreviate_che_gia_funzionavano(self):
        for t, att in (("Dott. Luca Marini", ("Luca", "Marini")),
                       ("Dr. Andrea Platamone", ("Andrea", "Platamone")),
                       ("Dott.ssa Marcella Siino", ("Marcella", "Siino")),
                       ("Prof. Mario Rossi", ("Mario", "Rossi"))):
            self.assertEqual(racc.RE_PERSONA.findall(t)[:1], [att], t)

    def test_forme_per_esteso(self):
        for t, att in (("Dottoressa Elena Fasola", ("Elena", "Fasola")),
                       ("Dottor Antonio Ravazzolo", ("Antonio", "Ravazzolo"))):
            self.assertEqual(racc.RE_PERSONA.findall(t)[:1], [att], t)

    def test_NON_scatta_su_parole_che_iniziano_per_dott(self):
        for t in ("dottori specializzati a Milano", "un uomo dotto Mario Rossi"):
            self.assertEqual(racc.RE_PERSONA.findall(t), [], t)


class IlCognomeInDueParole(unittest.TestCase):
    """🔴 «Di», «De», «La» hanno DUE lettere: il gruppo ne voleva almeno tre."""

    def test_le_particelle_entrano_nel_cognome(self):
        for t, att in (("Dott.ssa Roberta Di Maggio", ("Roberta", "Di Maggio")),
                       ("Prof. Anna De Luca", ("Anna", "De Luca")),
                       ("Dott. Marco Della Rocca", ("Marco", "Della Rocca")),
                       ("Dott.ssa Stefania La Morgia", ("Stefania", "La Morgia"))):
            self.assertEqual(racc.RE_PERSONA.findall(t)[:1], [att], t)

    def test_il_cognome_in_due_parole_combacia_col_dominio_INCOLLATO(self):
        # ⚠️ È il punto: `dottoressadimaggio.it` scrive «dimaggio» tutto attaccato.
        # Senza togliere lo spazio in `piatto()`, la coppia si trovava e ⛔ non
        # serviva a niente.
        t, _ = racc.classifica("dottoressadimaggio.it", "Dott.ssa Roberta Di Maggio",
                               "Dott.ssa Roberta Di Maggio, medicina estetica", "")
        self.assertEqual(t, "persona")


class LaSogliaCheNonSiTocca(unittest.TestCase):
    def test_un_cognome_di_5_lettere_NON_basta(self):
        # `siino` (5) su `dermatologocataniasiino.it` resta fuori DI PROPOSITO:
        # sotto i 6 una parola comune può coincidere col dominio per caso.
        t, _ = racc.classifica("dermatologocataniasiino.it", "Dott.ssa Marcella Siino",
                               "Dott.ssa Marcella Siino dermatologa", "")
        self.assertNotEqual(t, "persona")

    def test_un_cognome_di_6_lettere_basta(self):
        t, _ = racc.classifica("studiomarini.it", "Dott. Luca Marini",
                               "Dott. Luca Marini medicina estetica", "")
        self.assertEqual(t, "persona")


class PiattoNormalizza(unittest.TestCase):
    def test_toglie_apostrofo_trattino_e_SPAZIO(self):
        # L'apostrofo era già gestito (`D'Ettorre` → `dettorre`); lo spazio no.
        t, _ = racc.classifica("studiodettorre.it", "Dott. Marco D'Ettorre",
                               "Dott. Marco D'Ettorre chirurgo plastico", "")
        self.assertEqual(t, "persona")


if __name__ == "__main__":
    unittest.main(verbosity=2)
