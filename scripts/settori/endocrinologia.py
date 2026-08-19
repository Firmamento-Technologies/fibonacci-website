"""Settore ENDOCRINOLOGIA — la mappatura di studi e liberi professionisti.

Scritto il 2026-08-19 col linguaggio che usa CHI CERCA (il paziente), non il
gergo del brain: «diabetologo», «ecografia tiroide», «MOC», ⛔ non «terapia
incretinica». Le prestazioni sono ciò che un sito di studio DICHIARA.
"""

CARTELLA_SCHEDE = "cliniche-endocrinologia"
FILE_STATO = "stato-scoperta-endocrinologia.json"

MODELLI = [
    "endocrinologo {c}",
    "studio endocrinologia {c}",
    "visita endocrinologica {c}",
    "diabetologo {c}",
    "centro diabetologico {c}",
    "ambulatorio endocrinologia {c}",
    "endocrinologo {c} tiroide",
    "endocrinologo {c} privato",
]

MODELLI_TRATTAMENTO = [
    "ecografia tiroide {c}",
    "agoaspirato tiroideo {c}",
    "visita diabetologica {c}",
    "densitometria ossea {c}",
    "MOC {c}",
    "visita per osteoporosi {c}",
]

MODELLI_COMUNE = [
    "endocrinologo {c}",
    "diabetologo {c}",
    "ecografia tiroide {c}",
    "visita endocrinologica {c}",
]

MODELLI_PROFONDI = [
    "nodulo tiroideo visita {c}", "ipotiroidismo specialista {c}",
    "tiroidite di hashimoto {c} specialista", "morbo di basedow {c}",
    "endocrinologo tiroide e gravidanza {c}", "diabete tipo 2 specialista {c}",
    "microinfusore diabete {c}", "holter glicemico {c}",
    "sensore glicemia applicazione {c}", "obesità visita medica {c}",
    "medico per dimagrire {c} specialista", "sindrome metabolica visita {c}",
    "colesterolo alto specialista {c}", "endocrinologo ovaio policistico {c}",
    "irsutismo endocrinologo {c}", "endocrinologo per menopausa {c}",
    "testosterone basso specialista {c}", "andrologo endocrinologo {c}",
    "iperprolattinemia specialista {c}", "adenoma ipofisario visita {c}",
    "cortisolo alto specialista {c}", "surrene visita specialistica {c}",
    "osteoporosi terapia {c} specialista", "paratiroidi specialista {c}",
    "vitamina d carenza specialista {c}", "endocrinologo pediatrico {c}",
    "endocrinologia e nutrizione {c}", "visita endocrinologica privata {c}",
    "endocrinologo prenotazione {c}", "endocrinologo recensioni {c}",
]

MODELLI_PROFESSIONISTI = [
    "endocrinologo {c} studio privato",
    "dott endocrinologo {c} riceve",
    "dott.ssa endocrinologia {c} studio",
    "specialista in endocrinologia {c} curriculum",
    '"endocrinologo" {c} "iscritto all\'albo"',
    '"endocrinologia" {c} "ordine dei medici"',
    "diabetologo {c} studio privato",
    "specialista endocrinologia {c} visita privata",
    "endocrinologo {c} sito ufficiale",
    "medico endocrinologo {c} riceve su appuntamento",
]

PRESTAZIONI = {
    "Visita endocrinologica": r"visit[ae]\s+endocrinolog",
    "Ecografia tiroidea": r"ecografia\s+(?:della\s+)?tiroid|eco\s*tiroid",
    "Agoaspirato tiroideo": r"agoaspirat|citologico\s+tiroid",
    "Visita diabetologica": r"visit[ae]\s+diabetolog|diabetolog",
    "Monitoraggio glicemico (CGM/holter)": r"holter\s+glicemic|monitoraggio\s+(?:continuo\s+)?(?:della\s+)?glicemia|sensore\s+glicemic",
    "Densitometria ossea (MOC)": r"\bmoc\b|densitometria|mineralometria",
    "Ecografia": r"\becografi",
    "Visita per obesità/nutrizione": r"obesit|dietolog|nutrizionist|dimagriment",
    "Visita andrologica/ormonale": r"androlog|ipogonadismo|testosterone",
    "PCOS/irsutismo": r"ovaio\s+policistic|pcos|irsutism",
    "Osteoporosi": r"osteoporos",
    "Tiroide (gestione)": r"\btiroid|ipotiroidism|ipertiroidism|hashimoto|basedow|gozzo|nodul[oi]\s+tiroid",
}
