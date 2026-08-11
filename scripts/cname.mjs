/* Scrive `out/CNAME` quando il sito gira su un dominio proprio.
 *
 * GitHub Pages decide il dominio da servire leggendo QUESTO file nell'artefatto
 * pubblicato: senza, il dominio personalizzato non viene servito anche se il DNS
 * punta correttamente. È il pezzo che si dimentica, perché il DNS "sembra" la
 * parte difficile e invece è quella visibile.
 *
 * ⛔ Se `NEXT_PUBLIC_DOMINIO_SITO` è vuoto il file NON viene scritto, e il sito resta su
 * github.io: la stessa cautela di `next.config.ts`, per lo stesso motivo. */
import { writeFileSync } from 'node:fs'

const dominio = (process.env.NEXT_PUBLIC_DOMINIO_SITO ?? '').trim()
if (!dominio) {
  console.log('[cname] NEXT_PUBLIC_DOMINIO_SITO non impostato: nessun CNAME, si resta su github.io')
  process.exit(0)
}
writeFileSync('out/CNAME', dominio + '\n', 'utf-8')
console.log(`[cname] out/CNAME = ${dominio}`)
