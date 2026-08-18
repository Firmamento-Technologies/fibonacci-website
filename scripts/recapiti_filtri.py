#!/usr/bin/env python3
"""I due filtri che l'informativa dell'art. 14 promette, in UN posto solo.

⚠️ Stanno qui e ⛔ non dentro `costruisci-db.py` perché li usano in due:
il **raccoglitore** (che non deve nemmeno scrivere quelle righe) e il
**classificatore** (che deve poter dire, su un file già scritto, quali righe
l'informativa vieta). Due copie divergerebbero, e a divergere sarebbe quella
che nessuno rilegge.
"""

from __future__ import annotations

import re

# 🔴 L'informativa pubblicata (`src/content/legal/elenco-medici.md`) dichiara due
# cose che il 18 agosto ⛔ NON erano vere nei dati:
#
#   §2 «⛔ Non sono trattati: indirizzi di posta elettronica **nominativi**
#       riferibili a una singola persona (del tipo nome.cognome@), che vengono
#       **scartati automaticamente**»           → ne restavano 16
#   §2 «L'origine dei dati è **una sola**: il sito internet dell'interessato.
#       ⛔ Nessun dato proviene da portali, elenchi commerciali, mappe…»
#                                               → 11 venivano da un elenco
#                                                 telefonico, altre da portali
#                                                 e da agenzie web
#
# ⚠️ Un'informativa che dichiara «⛔ non trattiamo X» mentre X è nell'archivio è
# **peggio di un'informativa assente**: è una dichiarazione inesatta resa
# all'interessato, e mina tutto il resto del documento.
#
# 🔑 Si è scelto di **far diventare vera la promessa**, ⛔ non di indebolirla: è
# anche la mitigazione più forte del bilanciamento del legittimo interesse
# (⛔ nessun recapito personale ⇒ impatto minimo), e toglierla costerebbe più di
# quanto costi eseguirla. ⇒ il filtro sta **qui**, dove il file nasce, ⛔ non in
# una pulizia a posteriori che il prossimo giro cancellerebbe.

# Le parti prima della @ che indicano un RUOLO, ⛔ non una persona.
_RUOLO = {
    "info", "segreteria", "amministrazione", "prenotazioni", "studio", "contatti",
    "reception", "contatto", "prenota", "direzione", "ufficio", "clinica", "centro",
    "staff", "mail", "posta", "commerciale", "marketing", "agenda", "servizioclienti",
    "gestione", "contattaci", "accettazione", "appuntamenti", "shop", "ordini",
    "assistenza", "supporto", "privacy", "pec", "fatture", "fatturazione", "sede",
}

# Domini che ⛔ non sono di nessuno studio: segnaposto dei modelli di sito ed
# elenchi/portali da cui la scheda può essere stata letta.
_NON_PROPRI = (
    "website.com", "mysite.com", "esempio.it", "example.com", "example.org",
    "wixsite.com", "telefono.click", "paginegialle.it", "misterimprese.it",
    "abcsalute.it", "dottori.it", "miodottore.it", "pagine",
)


def _e_nominativa(email):
    """Vero se l'indirizzo identifica una **persona**, ⛔ non un ruolo.

    ⚠️ Il test è **stretto di proposito**. Una prima versione larga contava 95
    indirizzi «nominativi» prendendo dentro `info.shop@` e `info.albamedica@`,
    che sono ruoli con un suffisso: accusare l'informativa di una falsità con un
    filtro largo è **lo stesso errore** che si sta correggendo, al contrario.
    """
    email = (email or "").strip().lower()
    if "@" not in email:
        return False
    pezzi = re.split(r"[._-]", email.split("@", 1)[0])
    if any(p in _RUOLO for p in pezzi):
        return False
    if re.match(r"^(dr|dott|dottor|prof|dssa)$", pezzi[0]):
        return True
    return len(pezzi) >= 2 and all(p.isalpha() and len(p) > 2 for p in pezzi[:2])


def _origine_non_propria(email, dominio_conta):
    """Vero se l'indirizzo ⛔ non viene dal sito dello studio.

    Due segni, e il secondo si **deduce dai dati**: un dominio che compare per
    **più studi diversi** ⛔ non è il sito di uno studio, è un portale, un gruppo
    o l'agenzia che ha fatto i siti. Dedurlo invece di elencarlo a mano fa sì
    che un portale nuovo venga preso **il giorno stesso**.
    """
    email = (email or "").strip().lower()
    if "@" not in email:
        return True
    dom = email.split("@", 1)[1]
    if any(p in dom for p in _NON_PROPRI):
        return True
    return dominio_conta.get(dom, 0) > 1



