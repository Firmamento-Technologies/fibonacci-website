"""Settore CARDIOLOGIA — la mappatura di studi e liberi professionisti.

Scritto il 2026-08-19 col linguaggio del paziente che cerca («cardiologo»,
«ecg», «holter», «visita cardiologica»), non col gergo clinico.
"""

CARTELLA_SCHEDE = "cliniche-cardiologia"
FILE_STATO = "stato-scoperta-cardiologia.json"

MODELLI = [
    "cardiologo {c}",
    "studio cardiologia {c}",
    "visita cardiologica {c}",
    "cardiologo {c} privato",
    "ambulatorio cardiologia {c}",
    "centro cardiologico {c}",
    "elettrocardiogramma {c}",
    "ecocardiogramma {c}",
]

MODELLI_TRATTAMENTO = [
    "holter cardiaco {c}",
    "holter pressorio {c}",
    "prova da sforzo {c}",
    "ecocolordoppler cardiaco {c}",
    "visita cardiologica con ecg {c}",
    "ecodoppler carotidi {c}",
]

MODELLI_COMUNE = [
    "cardiologo {c}",
    "visita cardiologica {c}",
    "elettrocardiogramma {c}",
    "holter {c}",
]

MODELLI_PROFONDI = [
    "cardiologo aritmie {c}", "fibrillazione atriale specialista {c}",
    "extrasistoli visita {c}", "palpitazioni cardiologo {c}",
    "ipertensione specialista {c}", "pressione alta cardiologo {c}",
    "holter pressorio 24 ore {c}", "scompenso cardiaco specialista {c}",
    "soffio al cuore visita {c}", "controllo pacemaker {c}",
    "cardiologo dello sport {c}", "certificato agonistico cardiologo {c}",
    "idoneità sportiva visita {c}", "test da sforzo cardiologico {c}",
    "colesterolo cardiologo {c}", "prevenzione cardiovascolare {c}",
    "dolore al petto visita cardiologica {c}", "cardiologo anziani {c}",
    "ecocardiogramma transtoracico {c}", "cardiopalmo specialista {c}",
    "tachicardia visita {c}", "bradicardia specialista {c}",
    "valvola aortica visita {c}", "prolasso mitralico controllo {c}",
    "cardiomiopatia specialista {c}", "visita cardiologica sportiva {c}",
    "cardiologo domicilio {c}", "telemedicina cardiologia {c}",
    "cardiologo prenotazione {c}", "cardiologo recensioni {c}",
]

MODELLI_PROFESSIONISTI = [
    "cardiologo {c} studio privato",
    "dott cardiologo {c} riceve",
    "dott.ssa cardiologia {c} studio",
    "specialista in cardiologia {c} curriculum",
    '"cardiologo" {c} "iscritto all\'albo"',
    '"cardiologia" {c} "ordine dei medici"',
    "cardiologo {c} sito ufficiale",
    "medico cardiologo {c} riceve su appuntamento",
    "specialista cardiologia {c} visita privata",
    "cardiologo aritmologo {c} studio",
]

PRESTAZIONI = {
    "Visita cardiologica": r"visit[ae]\s+cardiolog",
    "Elettrocardiogramma (ECG)": r"elettrocardiogramma|\becg\b|\bekg\b",
    "Ecocardiogramma": r"ecocardiogramma|ecocardiografia|eco\s*cuore",
    "Holter cardiaco": r"holter\s+(?:cardiaco|ecg|delle?\s+24)",
    "Holter pressorio (MAPA)": r"holter\s+pression|monitoraggio\s+pression|mapa\b",
    "Prova da sforzo": r"prova\s+da\s+sforzo|test\s+da\s+sforzo|ergometri",
    "Ecocolordoppler": r"ecocolordoppler|eco\s*doppler|ecodoppler",
    "Controllo pacemaker/dispositivi": r"pacemaker|defibrillator|loop\s+recorder",
    "Visita per idoneità sportiva": r"idoneit[àa]\s+sportiv|certificat[oi]\s+agonistic|medicina\s+dello\s+sport",
    "Aritmie (gestione)": r"aritmi|fibrillazione\s+atriale|extrasistol|cardiopalmo|palpitazion",
    "Ipertensione (gestione)": r"ipertension|pressione\s+(?:alta|arteriosa)",
    "Scompenso (gestione)": r"scompenso\s+cardiaco|insufficienza\s+cardiaca",
}
