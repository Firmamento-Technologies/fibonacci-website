import type { Metadata } from 'next'
import { Header } from '@/components/chrome/Header'
import { Tappe } from '@/components/chrome/Tappe'
import { Footer } from '@/components/chrome/Footer'
import { Hero } from '@/components/home/Hero'
import { DocumentoCheSiCompone } from '@/components/home/DocumentoCheSiCompone'
import { Problema, Procedure, tappeCapacita, FotoCliniche, Prove, Obiezioni } from '@/components/home/sezioni'
import { Sigillo, Chiusura } from '@/components/home/Sigillo'
import { ListinoSintesi } from '@/components/Listino'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* La home ha due soli obiettivi (CXL): dire il valore nel modo più chiaro
 * possibile e portare al passo dopo. Ogni sezione ha un mestiere; se non lo
 * svolge si taglia, non si accorcia.
 *
 *   Hero            cos'è, per chi, e la prima schermata vera
 *   Documento       il principio organizzatore: la prova che si costruisce
 *   Problema        perché serve, detto come lo vive il medico
 *   Procedure       le tre famiglie di trattamento, in fotografia
 *   Capacità        le quattro cose che fa, con schermate vere
 *   Foto cliniche   il tema che gli studi risolvono peggio di tutti
 *   Sigillo         il culmine: la catena e il verificatore pubblico
 *   Prove           come si controlla tutto senza fidarsi di noi
 *   Prezzi          tre piani, IVA dichiarata
 *   Obiezioni       le domande che farebbe un compratore prudente
 *   Chiusura        quattro campi
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenuto" className="flex-1">
        {/* ⚠️ Undici sezioni = **17,2 schermate** misurate a 1440×900: la home
            era di gran lunga la pagina più lunga del sito, e chi arrivava dalla
            ricerca doveva scorrere per un minuto prima di sapere se il prodotto
            lo riguardava. Dentro `Tappe` ciascuna diventa una schermata con la
            V in fondo: le stesse undici sezioni, nello stesso ordine, senza una
            parola tolta. Vedi `Tappe.tsx`. */}
        <Tappe href="/">
          <Hero />
          <DocumentoCheSiCompone />
          <Problema />
          <Procedure />
          {/* Cinque tappe, non una: vedi `tappeCapacita` in `sezioni.tsx`. */}
          {tappeCapacita()}
          <FotoCliniche />
          <Sigillo />
          <Prove />
          <ListinoSintesi />
          <Obiezioni />
          <Chiusura />
        </Tappe>
      </main>
      <Footer />
    </>
  )
}
