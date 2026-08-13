import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { SchedaMedico } from '@/components/pazienti/SchedaMedico'
import { mediciPubblicati, medicoPerSlug, percorsoMedico } from '@/lib/medici-pubblici'
import { SITE_URL } from '@/lib/site-config'

/* La scheda pubblica di un medico — TD-95, primo pezzo.
 *
 * ⚠️ **Next 16**: `params` è una `Promise` e va atteso. Non è la firma che si
 * ricorda dalle versioni precedenti, ed è scritto nelle guide locali
 * (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/
 * generate-static-params.md`) — che `AGENTS.md` chiede di leggere prima di
 * scrivere, proprio per questo.
 *
 * ⛔ Il sito è `output: 'export'`: queste pagine si generano **in
 * costruzione**, e il contenuto sta nell'HTML servito. Caricarlo dal browser
 * azzererebbe l'unica ragione per cui la pagina esiste. */

export const dynamicParams = false

export function generateStaticParams() {
  return mediciPubblicati().map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const m = medicoPerSlug(slug)
  if (!m) return {}

  const titolo = `${m.medico.nome} — ${m.studio.nome}, ${m.studio.comune}`

  return {
    title: titolo,
    /* ⛔ Nessun superlativo e nessuna promessa di risultato nemmeno qui: la
     * descrizione è la prima cosa che un Ordine leggerebbe, ed è comunicazione
     * sanitaria a tutti gli effetti (L. 145/2018 art. 1 c. 525). */
    description: `${m.medico.titolo} a ${m.studio.comune}. Iscrizione all’Ordine dei Medici di ${m.medico.ordineProvinciale} n. ${m.medico.numeroIscrizione}. Indirizzo, prestazioni e orari liberi.`,
    alternates: { canonical: percorsoMedico(m.slug) },
    /* 🔴 Le pagine di esempio NON si indicizzano e NON entrano nel sitemap.
     * Un profilo inventato che si posiziona come se fosse un medico vero
     * sarebbe un danno, non un segnaposto. */
    robots: m.esempio ? { index: false, follow: false } : undefined,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = medicoPerSlug(slug)
  if (!m) notFound()

  /* Dati strutturati: `Physician` (sottotipo di `MedicalBusiness`, a sua volta
   * di `LocalBusiness`). Obbligatori secondo Google: `name` e `address`.
   * ⛔ Nessun `aggregateRating`: non ospitiamo recensioni, e dichiarare un
   * voto che non esiste è una violazione delle regole sui risultati arricchiti,
   * non un'ottimizzazione.
   * ⛔ Niente `openingHours` finti: si dichiara solo ciò che è in pagina. */
  const datiStrutturati = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: m.medico.nome,
    /* ⛔ **Nessuna `medicalSpecialty`, ed è deliberato (TD-108).**
     *
     * Qui c'era `https://schema.org/PlasticSurgery`, **scritto fisso, uguale per
     * chiunque**. ⚠️ La medicina estetica **non è** chirurgia plastica: sono
     * percorsi formativi diversi, e la maggior parte di chi fa tossina e filler
     * non è chirurgo plastico. ⇒ dichiaravamo su una pagina indicizzata una
     * **qualifica che quel medico non ha**, per giunta in dati strutturati, cioè
     * nel formato che i motori trattano come un'asserzione del titolare del sito.
     *
     * ⚖️ È la categoria che questo prodotto presidia ovunque — la disciplina
     * ricade **sul medico** (L. 145/2018 art. 1 c. 525, FNOMCeO artt. 55-57) —
     * e su una pagina che esiste **per essere verificabile** una specialità
     * inventata è il difetto peggiore possibile.
     *
     * 🔎 Verificato alla fonte (schema.org/MedicalSpecialty, 2026-08-12):
     * è un'**enumerazione chiusa di 43 valori** e **non ne esiste uno per la
     * medicina estetica**. Non c'è quindi un valore giusto da mettere: `Dermatology`
     * sarebbe un'altra specialità altrui, `PlasticSurgery` è quella di prima.
     * ⇒ **tacere è l'unica cosa certamente vera.**
     *
     * ✅ Quello che il medico fa **è già dichiarato**, e con un dato che
     * possediamo davvero: `availableService` qui sotto, dalle sue prestazioni.
     * Il titolo (`m.medico.titolo`) resta testo libero e ⛔ non si traduce in un
     * valore dell'enumerazione tirando a indovinare.
     *
     * 🔜 Si potrà dichiarare quando la specialità sarà **un dato del medico**,
     * scelto da lui: oggi `SchedaMedicoPubblica` non ce l'ha. */
    url: `${SITE_URL}${percorsoMedico(m.slug)}`,
    telephone: m.studio.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: m.studio.indirizzo,
      addressLocality: m.studio.comune,
      addressCountry: 'IT',
    },
    parentOrganization: { '@type': 'MedicalBusiness', name: m.studio.nome },
    availableService: m.prestazioni.map((p) => ({ '@type': 'MedicalProcedure', name: p })),
    /* 🗺️ **`geo` solo se le coordinate sono del CIVICO** — TD-114.
     *
     * ⚠️ Il campo esiste da oggi (`studio.coordinate`, aggiunto per la mappa in
     * pagina), ⛔ ma `esatta: false` significa che il punto è il **comune**: e
     * un centroide pubblicato come `geo` non è un'approssimazione, è
     * **un'affermazione falsa** — dice a Google che lo studio sta in quel punto,
     * e Google la usa per «vicino a me» e per il riquadro locale. In pagina
     * l'approssimazione si può dichiarare a parole; in un dato strutturato ⛔ no.
     * È la stessa regola di [[piano-ui-canale-paziente]] §7 sui centroidi di
     * provincia, applicata al posto dove fa più danno. */
    ...(m.studio.coordinate?.esatta
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: m.studio.coordinate.lat,
            longitude: m.studio.coordinate.lon,
          },
        }
      : {}),
    /* La foto, **se il medico l'ha data**: Google la usa nel riquadro del
       profilo, e ⛔ non se ne inventa una di repertorio (stessa regola del
       `Ritratto`). */
    ...(m.foto ? { image: `${SITE_URL}${m.foto.src}` } : {}),
  }

  return (
    <GuscioPaziente
      avviso={
        m.esempio ? (
          <>
            <strong>Pagina di esempio.</strong> Questo studio non esiste: serve a costruire e
            collaudare la scheda prima che ci sia un medico vero.
          </>
        ) : undefined
      }
    >
      {/* ⚠️ I dati strutturati escono **solo** se la pagina non è un esempio:
          altrimenti dichiareremmo a un motore che esiste un medico che non
          esiste, che è peggio del `noindex` che stiamo già mettendo. */}
      {!m.esempio && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datiStrutturati) }}
        />
      )}
      <SchedaMedico m={m} />
    </GuscioPaziente>
  )
}
