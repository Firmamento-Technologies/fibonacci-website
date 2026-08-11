/**
 * Prepara i due ritratti di riferimento della mappa del viso.
 *
 * ⚠️ PERCHÉ UNO SCRIPT E NON UN COPIA-INCOLLA UNA VOLTA SOLA.
 * Gli originali stanno nell'EMR (`apps/web/public/img/woman-clean.png` e
 * `man-clean.png`) e pesano **1,9 e 2,2 MB**. Messi così sul primo schermo
 * sarebbero l'elemento più pesante del sito — esattamente l'errore già misurato
 * il 2026-08-09 sulle schermate (PNG da 2880 px serviti per 544, 351 KB in
 * `fetchpriority=high` per dipingere una miniatura illeggibile).
 * Qui si riducono alle tre larghezze che il componente serve davvero, in AVIF e
 * WebP, con il PNG come ripiego.
 *
 * ✂️ SI RITAGLIA, e il ritaglio è dichiarato in UN posto solo.
 * Gli originali sono **2816×1536**, cioè lastre orizzontali con il viso stretto
 * nella banda centrale e due terzi di bianco ai lati. Servite intere, a 544 px
 * di larghezza il viso ne occuperebbe ~174: dieci pallini da 30 px lì dentro si
 * sovrappongono, e la cosa che dovrebbe essere leggibile diventa illeggibile —
 * lo stesso difetto per cui la schermata dell'hero è stata sostituita.
 *
 * ⚠️ Un ritaglio SPOSTA ogni coordinata, e lo farebbe **in silenzio**: nessun
 * test diventerebbe rosso, i pallini finirebbero semplicemente fuori posto.
 * Per questo `RITAGLIO` vive in `src/lib/aree-viso.ts` accanto alle tabelle, le
 * coordinate lì restano **identiche a quelle dell'EMR** (così il confronto di
 * parità è un'uguaglianza secca) e la trasformazione si applica al disegno.
 * ⛔ Se cambi i numeri qui sotto, cambiali anche là: il collaudo verifica che i
 * due valori coincidano, e diventa rosso se scostano.
 *
 * USO:  node scripts/volti.mjs
 * Prerequisito: il sottomodulo `EMR/` presente. Se non c'è, lo dice e non fa
 * nulla — le immagini già generate restano in `public/img/`.
 */
import sharp from 'sharp'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const RADICE = join(QUI, '..')
const USCITA = join(RADICE, 'public/img')
const SORGENTE = join(RADICE, '../EMR/apps/web/public/img')

/** Le stesse larghezze dichiarate in `ProvaMappaViso.tsx`. */
const LARGHEZZE = [480, 720, 960]

/** ✂️ La finestra tenuta, in frazioni della larghezza originale.
 *  ⛔ DEVE coincidere con `RITAGLIO` in `src/lib/aree-viso.ts` — il collaudo lo
 *  verifica. L'altezza si tiene intera: le y non vanno toccate. */
const RITAGLIO = { x0: 0.28, larghezza: 0.44 }

const RITRATTI = [
  { da: 'woman-clean.png', a: 'volto-donna' },
  { da: 'man-clean.png', a: 'volto-uomo' },
]

if (!existsSync(SORGENTE)) {
  console.log(`Sorgente assente (${SORGENTE}): il sottomodulo EMR non è in questo clone.`)
  console.log('Niente da fare — le immagini già in public/img restano quelle.')
  process.exit(0)
}

mkdirSync(USCITA, { recursive: true })

for (const r of RITRATTI) {
  const origine = join(SORGENTE, r.da)
  if (!existsSync(origine)) {
    console.error(`✗ manca ${origine}`)
    process.exitCode = 1
    continue
  }

  const meta = await sharp(origine).metadata()
  const righe = []

  const finestra = {
    left: Math.round(RITAGLIO.x0 * meta.width),
    top: 0,
    width: Math.round(RITAGLIO.larghezza * meta.width),
    height: meta.height,
  }
  const ritagliata = await sharp(origine).extract(finestra).toBuffer()

  for (const w of LARGHEZZE) {
    const base = sharp(ritagliata).resize({ width: w, withoutEnlargement: true })
    const webp = await base.clone().webp({ quality: 82 }).toBuffer()
    const avif = await base.clone().avif({ quality: 55 }).toBuffer()
    writeFileSync(join(USCITA, `${r.a}-${w}.webp`), webp)
    writeFileSync(join(USCITA, `${r.a}-${w}.avif`), avif)
    righe.push(`${w}px → webp ${Math.round(webp.length / 1024)} KB · avif ${Math.round(avif.length / 1024)} KB`)
  }

  // Ripiego per i browser senza AVIF né WebP: il PNG, ma alla larghezza massima
  // che serve — non ai 2000+ px dell'originale.
  // Ripiego per i browser senza AVIF né WebP: **JPEG, non PNG**.
  // ⚠️ Misurato: in PNG questi due ritagli pesano 1379 e 1550 KB — il PNG è
  // senza perdita e su una fotografia non ha niente da guadagnare. In JPEG
  // stanno sotto i 100 KB a parità di occhio. (Le schermate restano PNG: lì
  // ci sono testo e linee nette, dove il JPEG sporca.)
  const jpg = await sharp(ritagliata)
    .resize({ width: LARGHEZZE.at(-1), withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  writeFileSync(join(USCITA, `${r.a}.jpg`), jpg)
  const dim = await sharp(jpg).metadata()

  console.log(`${r.a}  (origine ${meta.width}×${meta.height} → ritagliata ${finestra.width}×${finestra.height} → ${dim.width}×${dim.height})`)
  for (const riga of righe) console.log(`   ${riga}`)
  console.log(`   ripiego jpg ${Math.round(jpg.length / 1024)} KB`)
}
