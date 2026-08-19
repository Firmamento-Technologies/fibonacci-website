"""Settore ESTETICA — il settore storico, estratto VERBATIM da
raccolta-cliniche.py il 2026-08-19 per dare al motore il suo `--settore`.

⚠️ Questi blocchi sono il COMPORTAMENTO ATTUALE della raccolta estetica:
⛔ non si ritoccano qui dentro senza sapere che si sta cambiando la raccolta
viva. `test_settori.py` congela alcune voci campione proprio per accorgersene.
"""

# Dove scrive: il settore storico tiene i percorsi STORICI, senza suffisso.
CARTELLA_SCHEDE = "cliniche"
FILE_STATO = "stato-scoperta.json"

MODELLI = [
    "studio medicina estetica {c}",
    "centro medicina estetica {c}",
    "ambulatorio medicina estetica {c}",
    "poliambulatorio medicina estetica {c}",
    "clinica medicina estetica {c}",
    "medicina estetica {c} filler acido ialuronico",
    "medicina estetica {c} tossina botulinica",
    "medicina estetica {c} biostimolazione viso",
]

MODELLI_TRATTAMENTO = [
    "botulino {c} medico",
    "filler labbra {c}",
    "laser viso {c} medico",
    "criolipolisi {c}",
    "biorivitalizzazione viso {c}",
    "chirurgo plastico {c}",
]

MODELLI_COMUNE = [
    "medicina estetica {c}",
    "medico estetico {c}",
    "centro medico estetico {c}",
    "filler {c}",
]

MODELLI_PROFONDI = [
    "rughe viso {c} medico estetico", "acido ialuronico viso {c}", "peeling viso {c} medico",
    "mesoterapia {c}", "fili di trazione viso {c}", "blefaroplastica {c}", "rinofiller {c}",
    "lipofilling viso {c}", "radiofrequenza viso {c}", "microneedling {c}", "PRP viso {c}",
    "trattamento occhiaie {c}", "zigomi filler {c}", "mento filler {c}", "cellulite {c} medico",
    "criolipolisi addome {c}", "epilazione laser {c} medico", "macchie viso laser {c}",
    "couperose {c} medico", "acne cicatrici {c} medico", "caduta capelli {c} medico",
    "iperidrosi ascellare {c}", "medicina estetica {c} prima visita", "ambulatorio estetico {c}",
    "poliambulatorio estetico {c}", "clinica estetica {c} prezzi", "medico estetico {c} centro",
    "medicina anti-aging {c}", "medicina rigenerativa viso {c}", "dermatologo estetico {c}",
    "specialista filler {c}", "botulino rughe fronte {c}", "skinbooster {c}", "profhilo {c}",
    "trattamento viso uomo {c}", "medicina estetica {c} nord", "medicina estetica {c} sud",
    "studio medicina estetica {c} centro", "centro laser {c} medico", "medicina estetica corpo {c}",
    "rimodellamento corpo {c}", "trattamento collo {c} medico", "décolleté trattamento {c}",
    "mani ringiovanimento {c}", "smagliature {c} medico", "medicina estetica {c} uomo",
    "labbra volume {c} medico", "sopracciglia lifting {c}", "doppio mento {c} trattamento",
    "medicina estetica {c} recensioni", "chirurgia estetica {c} clinica", "medico estetico {c} online",
    "prenota medicina estetica {c}", "consulenza medicina estetica {c}", "aesthetic clinic {c}",
    "medicina estetica {c} viso naturale", "biorivitalizzante {c}", "vitamine viso {c} medico",
    "ossigenoterapia viso {c}", "carbossiterapia {c}", "pressoterapia {c} medico",
    "onde d urto cellulite {c}", "laser co2 frazionato {c}", "hifu {c} lifting",
    "ultherapy {c}", "morpheus8 {c}", "emsculpt {c}",
]

MODELLI_PROFESSIONISTI = [
    "medico estetico {c} studio privato",
    "dottoressa medicina estetica {c} studio",
    "specialista medicina estetica {c} visita",
    "medico estetico {c} filler labbra",
    # ⚠️ Le virgolette **contano**: senza, il motore allarga a «medicina
    # estetica» generico e torna la stessa manciata di portali.
    '"medico estetico" {c} "iscritto all\'albo"',
    '"medicina estetica" {c} "ordine dei medici"',
    "dott medicina estetica {c} sito ufficiale",
    "dott.ssa medicina estetica {c} studio",
    "specialista in medicina estetica {c} curriculum",
    "chirurgo plastico {c} studio privato",
    "dermatologo {c} medicina estetica studio",
    "medico estetico {c} biografia formazione",
    "medico chirurgo estetico {c} riceve su appuntamento",
    "medicina estetica {c} dott visita privata",
]

PRESTAZIONI = {
    "Filler": r"\bfiller\b|acido\s+ialuronico",
    "Tossina botulinica": r"botulin|botox",
    "Biostimolazione": r"biostimolaz|biorivitalizzaz",
    "Peeling chimico": r"peeling",
    "Laser": r"\blaser\b",
    "Mesoterapia": r"mesoterap",
    "Radiofrequenza": r"radiofrequenz",
    "Fili di trazione": r"fili\s+di\s+trazione|fili\s+riassorbibili",
    "Trattamento cicatrici": r"cicatric",
    "Epilazione": r"epilazion",
}
