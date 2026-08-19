// L'avviso di giurisdizione c'è dove serve, e ⛔ non c'è dove sarebbe rumore.
//
// ── PERCHE' ESISTE ──────────────────────────────────────────────────────────
// Il modo in cui questa cosa si rompe è **silenzioso in tutti e due i versi**:
//
//  · un capitolo nuovo che nomina l'AIFA esce tradotto **senza** avviso, e un
//    medico tedesco legge un obbligo italiano come se fosse suo;
//  · l'avviso finisce anche nell'italiano, e allora un medico italiano si vede
//    dire «questo capitolo parla dell'Italia»: rumore che insegna a saltare i
//    riquadri, e quando un riquadro conta davvero non lo legge più.
//
// ⚠️ Nessuno dei due dà errore: il manuale si genera lo stesso.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { citaNormeItaliane, conNotaDiGiurisdizione, SEGNI_ITALIANI } from './giurisdizione'

const DOCS = join(process.cwd(), 'src', 'content', 'docs')
const LINGUE = ['en', 'es', 'fr', 'de'] as const

function capitoli(sotto: string): { slug: string; testo: string }[] {
  const dir = join(DOCS, sotto)
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, ''), testo: readFileSync(join(dir, f), 'utf8') }))
}

describe("l'avviso di giurisdizione", () => {
  it.each(LINGUE)('lo riceve ogni capitolo tradotto che cita norme italiane (%s)', (lingua) => {
    const senzaAvviso = capitoli(lingua)
      .filter((c) => citaNormeItaliane(c.testo))
      .filter((c) => !conNotaDiGiurisdizione(c.testo, lingua).startsWith('> **'))
      .map((c) => c.slug)
    expect(senzaAvviso).toEqual([])
  })

  it('⛔ e l’italiano non lo riceve mai', () => {
    // Là quelle norme sono **le sue**.
    for (const c of capitoli('.')) {
      expect(conNotaDiGiurisdizione(c.testo, 'it')).toBe(c.testo)
    }
  })

  it('un capitolo che non cita niente di italiano resta intatto', () => {
    const neutro = '# Come si carica una foto\n\nSi trascina il file nel riquadro.\n'
    expect(conNotaDiGiurisdizione(neutro, 'de')).toBe(neutro)
  })

  it('⚠️ e i capitoli che lo prendono sono davvero quelli, non tutti', () => {
    // Se l'elenco dei segni diventasse troppo largo, l'avviso finirebbe su
    // ogni pagina e tornerebbe a essere rumore. Misurato: sono una minoranza.
    const tutti = capitoli('en')
    const conAvviso = tutti.filter((c) => citaNormeItaliane(c.testo))
    expect(conAvviso.length).toBeGreaterThan(0)
    expect(conAvviso.length).toBeLessThan(tutti.length / 2)
  })

  it('l’avviso nomina le norme di cui parla, in ogni lingua', () => {
    // ⛔ Un avviso generico («alcune regole potrebbero non applicarsi») non
    //    serve a niente: chi lo legge non sa quali. Deve dire i nomi.
    const conNorme = `# X\n\nL. 219/2017 e AIFA.\n`
    for (const lingua of LINGUE) {
      const reso = conNotaDiGiurisdizione(conNorme, lingua)
      expect(reso).toContain('219/2017')
      expect(reso).toContain('AIFA')
    }
  })

  it('⛔ e non pretende di sapere che cosa preveda la legge del lettore', () => {
    // È il vincolo che questo modulo si è dato: nominare l'equivalente locale
    // sbagliato sarebbe peggio che non nominarlo, perché chi lo legge lo cita.
    const reso = conNotaDiGiurisdizione('# X\n\nL. 219/2017.\n', 'de')
    for (const inventato of ['BGB', 'Bundesärztekammer', 'Patientenrechtegesetz']) {
      expect(reso).not.toContain(inventato)
    }
  })

  it('i segni cercati comprendono le istituzioni citate davvero dal manuale', () => {
    for (const atteso of ['AIFA', 'PEC', '219/2017', 'Ordine dei Medici']) {
      expect(SEGNI_ITALIANI).toContain(atteso)
    }
  })
})
