#!/usr/bin/env node
/**
 * Semina dati dimostrativi nello stack LOCALE, per le schermate del sito.
 *
 * Perché serve: le schermate devono mostrare il prodotto che fa il suo
 * mestiere. Una cartella vuota con scritto «Ancora nessun evento» racconta
 * che il software non serve a niente. Con dati veri racconta la giornata di
 * uno studio.
 *
 * ⚠️ Solo locale. Punta a http://localhost:8103 e si rifiuta di girare su
 * qualsiasi altro host: cinque spec e2e di questo progetto puntavano alla
 * produzione per default, e alcune CREAVANO dati. Non si ripete.
 *
 *   node website/scripts/semina-dati-vetrina.mjs
 */

import { readFile } from 'node:fs/promises'
import { createHash, randomBytes } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SEGRETI = join(__dirname, '..', '..', 'EMR', 'infra', '.secrets', 'dev.env')

const MEDPLUM = process.env.MEDPLUM_URL ?? 'http://localhost:8103'
if (!/^http:\/\/(localhost|127\.0\.0\.1):/.test(MEDPLUM)) {
  console.error(`Rifiuto di seminare su ${MEDPLUM}: questo script è solo per lo stack locale.`)
  process.exit(1)
}

const b64url = (b) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function token() {
  const testo = await readFile(SEGRETI, 'utf8')
  const g = (k) => {
    const r = testo.split('\n').find((x) => x.startsWith(`${k}=`))
    if (!r) throw new Error(`manca ${k}`)
    return r.slice(k.length + 1).trim().replace(/^["']|["']$/g, '')
  }
  const verifier = b64url(randomBytes(48))
  const challenge = b64url(createHash('sha256').update(verifier).digest())
  const login = await fetch(`${MEDPLUM}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: g('LOCAL_ADMIN_EMAIL'),
      password: g('LOCAL_ADMIN_PASSWORD'),
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
      scope: 'openid',
    }),
  }).then((r) => r.json())
  if (!login.code) throw new Error(`login fallito: ${JSON.stringify(login)}`)
  const tok = await fetch(`${MEDPLUM}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: login.code,
      code_verifier: verifier,
    }),
  }).then((r) => r.json())
  if (!tok.access_token) throw new Error(`token fallito: ${JSON.stringify(tok)}`)
  return tok.access_token
}

let ACCESS
const fhir = async (metodo, percorso, corpo) => {
  const r = await fetch(`${MEDPLUM}/fhir/R4${percorso}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${ACCESS}`,
      'Content-Type': 'application/fhir+json',
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  })
  const testo = await r.text()
  if (!r.ok) throw new Error(`${metodo} ${percorso} → ${r.status}: ${testo.slice(0, 400)}`)
  return testo ? JSON.parse(testo) : null
}

const cerca = async (tipo, query) => {
  const b = await fhir('GET', `/${tipo}?${query}`)
  return b.entry?.map((e) => e.resource) ?? []
}

/** Crea solo se non esiste già una risorsa con lo stesso identifier di semina. */
const MARCA = 'https://fibonacci.local/semina-vetrina'
async function creaUnaVolta(risorsa, chiave) {
  const esistenti = await cerca(risorsa.resourceType, `identifier=${encodeURIComponent(`${MARCA}|${chiave}`)}`)
  if (esistenti.length) return esistenti[0]
  const conMarca = {
    ...risorsa,
    identifier: [...(risorsa.identifier ?? []), { system: MARCA, value: chiave }],
  }
  return fhir('POST', `/${risorsa.resourceType}`, conMarca)
}

const giorno = (scostamento, ora = 9, minuti = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + scostamento)
  d.setHours(ora, minuti, 0, 0)
  return d.toISOString()
}

async function main() {
  ACCESS = await token()
  console.log('> autenticato')

  // Il medico a cui intestare visite e appuntamenti.
  const [medico] = await cerca('Practitioner', '_count=1')
  const medicoRef = medico ? { reference: `Practitioner/${medico.id}` } : undefined

  // ── La paziente vetrina ───────────────────────────────────────────────
  const [laura] = await cerca('Patient', 'identifier=BRTLRA92E20G273V')
  if (!laura) throw new Error('Paziente Bertini Laura non trovata: esegui prima il seed di EMR/scripts')
  const suRif = { reference: `Patient/${laura.id}`, display: 'Bertini Laura' }
  console.log(`> paziente vetrina: Bertini Laura (${laura.id})`)

  // Allergia: fa comparire il banner di sicurezza in cima alla cartella, che
  // è uno dei pezzi che vale la pena mostrare.
  await creaUnaVolta(
    {
      resourceType: 'AllergyIntolerance',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed' }] },
      type: 'allergy',
      category: ['medication'],
      criticality: 'high',
      code: { text: 'Lidocaina' },
      patient: suRif,
      recordedDate: giorno(-190),
      note: [{ text: 'Reazione orticarioide dopo anestesia locale dal dentista, riferita dalla paziente.' }],
    },
    'allergia-lidocaina',
  )

  await creaUnaVolta(
    {
      resourceType: 'Condition',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-category', code: 'problem-list-item' }] }],
      code: { text: 'Fototipo III secondo Fitzpatrick' },
      subject: suRif,
      recordedDate: giorno(-190),
    },
    'condizione-fototipo',
  )

  // ── Visite ────────────────────────────────────────────────────────────
  const visite = [
    { g: -188, tipo: 'Prima visita e inquadramento', motivo: 'Richiesta di correzione delle rughe glabellari.' },
    { g: -104, tipo: 'Controllo a distanza', motivo: 'Valutazione del risultato a otto settimane.' },
    { g: -33, tipo: 'Visita di seduta', motivo: 'Programmazione del ciclo di biorivitalizzazione.' },
  ]
  for (const [i, v] of visite.entries()) {
    await creaUnaVolta(
      {
        resourceType: 'Encounter',
        status: 'finished',
        class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB', display: 'ambulatory' },
        type: [{ text: v.tipo }],
        subject: suRif,
        participant: medicoRef ? [{ individual: medicoRef }] : undefined,
        period: { start: giorno(v.g, 10, 0), end: giorno(v.g, 10, 40) },
        reasonCode: [{ text: v.motivo }],
      },
      `visita-${i}`,
    )
  }

  // ── Trattamenti ───────────────────────────────────────────────────────
  const trattamenti = [
    {
      g: -188,
      nome: 'Tossina botulinica tipo A, 20 unità',
      aree: ['Glabella', 'Fronte'],
      nota: 'Diluizione 2,5 ml. Cinque punti glabellari, quattro frontali. Nessuna reazione immediata.',
    },
    {
      g: -104,
      nome: 'Acido ialuronico cross-linkato 1 ml',
      aree: ['Labbro superiore', 'Labbro inferiore'],
      nota: 'Tecnica a bolo su tubercoli. Edema atteso per 48 ore, illustrato alla paziente.',
    },
    {
      g: -33,
      nome: 'Biorivitalizzazione, prima seduta di tre',
      aree: ['Zigomi', 'Guance'],
      nota: 'Microponfi. Prossima seduta a tre settimane.',
    },
  ]
  for (const [i, t] of trattamenti.entries()) {
    await creaUnaVolta(
      {
        resourceType: 'Procedure',
        status: 'completed',
        code: { text: t.nome },
        subject: suRif,
        performedDateTime: giorno(t.g, 10, 15),
        performer: medicoRef ? [{ actor: medicoRef }] : undefined,
        bodySite: t.aree.map((a) => ({ text: a })),
        note: [{ text: t.nota }],
      },
      `trattamento-${i}`,
    )
  }

  // ── Consenso firmato ──────────────────────────────────────────────────
  await creaUnaVolta(
    {
      resourceType: 'Consent',
      status: 'active',
      scope: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'treatment' }] },
      category: [{ text: 'Consenso informato al trattamento' }],
      // FHIR impone ppc-1: o `policy` o `policyRule`. Senza, il server
      // risponde 400 e il consenso non nasce.
      policyRule: { text: 'Consenso informato ex L. 219/2017, art. 1' },
      patient: suRif,
      dateTime: giorno(-188, 9, 50),
      sourceAttachment: { title: 'Consenso informato — tossina botulinica tipo A' },
    },
    'consenso-tossina',
  )

  // ── Appuntamenti: oggi e nei prossimi giorni ─────────────────────────
  const pazienti = await cerca('Patient', '_count=8')
  const conNome = pazienti.filter((p) => p.name?.[0]?.family && p.birthDate)
  const agenda = [
    { g: 0, ora: 9, min: 0, durata: 30, che: 'Controllo post filler' },
    { g: 0, ora: 10, min: 0, durata: 45, che: 'Tossina botulinica, terzo superiore' },
    { g: 0, ora: 11, min: 30, durata: 30, che: 'Prima visita' },
    { g: 0, ora: 15, min: 0, durata: 60, che: 'Biorivitalizzazione, seconda seduta' },
    { g: 1, ora: 9, min: 30, durata: 30, che: 'Consulto e preventivo' },
    { g: 1, ora: 14, min: 0, durata: 45, che: 'Filler labbra' },
    { g: 2, ora: 10, min: 0, durata: 30, che: 'Controllo a otto settimane' },
    { g: 3, ora: 16, min: 0, durata: 45, che: 'Peeling medio' },
  ]
  for (const [i, a] of agenda.entries()) {
    const p = conNome[i % Math.max(conNome.length, 1)] ?? laura
    await creaUnaVolta(
      {
        resourceType: 'Appointment',
        status: 'booked',
        description: a.che,
        start: giorno(a.g, a.ora, a.min),
        end: giorno(a.g, a.ora, a.min + a.durata),
        participant: [
          { actor: { reference: `Patient/${p.id}`, display: `${p.name[0].family} ${p.name[0].given?.[0] ?? ''}`.trim() }, status: 'accepted' },
          ...(medicoRef ? [{ actor: medicoRef, status: 'accepted' }] : []),
        ],
      },
      `appuntamento-${i}`,
    )
  }

  console.log('> fatto: allergia, 3 visite, 3 trattamenti, 1 consenso, 8 appuntamenti')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
