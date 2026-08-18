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

# 🔴 Caselle di posta GRATUITE. Stanno qui perché il segno «lo stesso dominio
# compare per più studi» ⛔ NON vale per loro: `gmail.com` compare per **83**
# studi diversi ⛔ non perché sia un'agenzia, ma perché 83 studi usano Gmail, e
# `mariorossi@gmail.com` è **il recapito dello studio**, esattamente come lo è
# `info@mariorossi.it`.
# ⚠️ Misurato il 2026-08-18, dopo che il filtro aveva tolto **102** recapiti
# legittimi per questa ragione: 83 gmail, 6 libero, 6 hotmail, 3 alice,
# 2 tiscali, 2 virgilio. ⇒ togliere il recapito di uno studio perché usa Gmail
# è ⛔ il contrario di quello che il filtro doveva fare.
_POSTA_GRATUITA = {
    "gmail.com", "googlemail.com", "libero.it", "hotmail.com", "hotmail.it",
    "outlook.com", "outlook.it", "live.it", "live.com", "yahoo.it", "yahoo.com",
    "alice.it", "virgilio.it", "tiscali.it", "tin.it", "icloud.com", "me.com",
    "fastwebnet.it", "aruba.it", "pec.it", "email.it", "inwind.it", "teletu.it",
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


def _origine_non_propria(email, studi_per_dominio):
    """Vero se l'indirizzo ⛔ non viene dal sito dello studio.

    `studi_per_dominio` è `dominio → insieme dei NOMI di studio distinti`.

    Due segni, e il secondo si **deduce dai dati**: un dominio che compare per
    **più studi diversi** ⛔ non è il sito di uno studio, è un portale, un gruppo
    o l'agenzia che ha fatto i siti. Dedurlo invece di elencarlo a mano fa sì
    che un portale nuovo venga preso **il giorno stesso**.

    🔴 **Due correzioni misurate il 2026-08-18**, dopo aver contato che cosa il
    filtro toglieva davvero (**306** righe, ⛔ non le poche attese):

    1. **le caselle gratuite sono escluse dal secondo segno** (`_POSTA_GRATUITA`):
       condividere `gmail.com` ⛔ non dice niente su chi possiede l'indirizzo, e
       il filtro stava buttando **102** recapiti di studi veri;
    2. **si contano i NOMI distinti, ⛔ non le righe**: prima bastavano due righe
       *dello stesso studio* (duplicati in archivio) perché il suo dominio
       sembrasse condiviso, e se ne perdevano altri **20**.

    ⚠️ La lezione generale, che vale oltre questo file: un filtro che toglie va
    **contato per categoria** prima di crederlo giusto. Qui sembrava sano e
    toglieva **122 righe su 306 per la ragione sbagliata**, cioè il **40%**.
    """
    email = (email or "").strip().lower()
    if "@" not in email:
        return True
    dom = email.split("@", 1)[1]
    if any(p in dom for p in _NON_PROPRI):
        return True
    if dom in _POSTA_GRATUITA:
        return False
    return len(studi_per_dominio.get(dom, ())) > 1


def studi_per_dominio(righe):
    """`dominio → insieme dei nomi di studio distinti`, da `(nome, email)`.

    ⚠️ Sta **qui** e ⛔ non nei tre chiamanti: erano tre `Counter` copiati, e la
    correzione del 18 agosto avrebbe dovuto essere fatta in tre posti, cioè
    dimenticata in due. È lo stesso motivo per cui i filtri stanno in questo file.
    """
    mappa = {}
    for nome, email in righe:
        e = (email or "").strip().lower()
        if "@" not in e:
            continue
        mappa.setdefault(e.split("@", 1)[1], set()).add((nome or "").strip().lower())
    return mappa
