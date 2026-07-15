#!/usr/bin/env node
// Post-build (E2.2): normalizza i file OG image dell'export statico.
//
// Next `output: 'export'` emette le route metadata-image (app/opengraph-image.tsx,
// app/specialita/[id]/opengraph-image.tsx) come file SENZA estensione
// (out/opengraph-image, ...). Su GitHub Pages un file senza estensione è servito
// come `application/octet-stream`: gli scraper social (Facebook/LinkedIn/X)
// richiedono `image/*` e scartano l'anteprima.
//
// Fix: rinomina i file a `.png` e riscrive i riferimenti `og:image`/`twitter:image`
// nell'HTML (`opengraph-image?hash` → `opengraph-image.png?hash`). Idempotente.
//
// Eseguito automaticamente come `postbuild` (package.json). Verifica: `curl -I`
// su out/opengraph-image.png deve dare `Content-Type: image/png`.

import { readdirSync, statSync, renameSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'
const IMAGE_BASENAMES = ['opengraph-image', 'twitter-image']

let renamed = 0
let htmlPatched = 0

function walk(dir, onFile) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, onFile)
    else onFile(full, entry)
  }
}

// 1. Rinomina i file immagine senza estensione → .png
walk(OUT, (full, name) => {
  if (IMAGE_BASENAMES.includes(name)) {
    renameSync(full, `${full}.png`)
    renamed++
  }
})

// 2. Riscrive i riferimenti nell'HTML: `opengraph-image` / `twitter-image`
//    seguito da ? " & → aggiunge `.png` (mantiene l'eventuale cache-buster).
const re = new RegExp(`(${IMAGE_BASENAMES.join('|')})(?=[?"&])`, 'g')
walk(OUT, (full, name) => {
  if (!name.endsWith('.html')) return
  const src = readFileSync(full, 'utf8')
  const out = src.replace(re, '$1.png')
  if (out !== src) {
    writeFileSync(full, out)
    htmlPatched++
  }
})

console.log(
  `[fix-og-image-mime] rinominati ${renamed} file immagine, patchati ${htmlPatched} HTML`,
)
if (renamed === 0) {
  console.log('[fix-og-image-mime] nessun file da rinominare (già normalizzato o build assente)')
}
