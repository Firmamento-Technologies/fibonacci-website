import type { Metadata } from 'next'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { Hero } from '@/components/home/Hero'
import { DocumentoCheSiCompone } from '@/components/home/DocumentoCheSiCompone'
import { Problema, Procedure, Capacita, FotoCliniche, Prove, Obiezioni } from '@/components/home/sezioni'
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
 *   Prezzi          due piani, IVA dichiarata
 *   Obiezioni       le domande che farebbe un compratore prudente
 *   Chiusura        quattro campi
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenuto" className="flex-1">
        <Hero />
        <DocumentoCheSiCompone />
        <Problema />
        <Procedure />
        <Capacita />
        <FotoCliniche />
        <Sigillo />
        <Prove />
        <ListinoSintesi />
        <Obiezioni />
        <Chiusura />
      </main>
      <Footer />
    </>
  )
}
