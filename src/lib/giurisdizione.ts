/**
 * L'adattamento per giurisdizione del manuale tradotto.
 *
 * ── IL PROBLEMA, MISURATO ───────────────────────────────────────────────────
 * Il manuale esiste in cinque lingue, ⛔ ma tradurlo non basta: parla di
 * **AIFA**, **PEC**, **L. 219/2017** e **Ordine dei Medici**, cioè di obblighi e
 * istituzioni italiane. Misurato il 2026-08-17 sui corpus in esercizio: il
 * tedesco cita `219/2017` **sette volte**, esattamente come l'italiano.
 *
 * 🔴 Un manuale in tedesco che descrive obblighi italiani è **peggio** di uno in
 * italiano, e la ragione è precisa: l'italiano si riconosce a colpo d'occhio
 * come «scritto per un altro paese», il tedesco no. Sembra applicabile.
 *
 * ── QUELLO CHE QUESTO MODULO NON FA, PER DICHIARAZIONE ──────────────────────
 * ⛔ **Non traduce l'obbligo italiano nel suo equivalente locale.** Scrivere che
 * al posto della L. 219/2017 vale il §630d BGB, o nominare la Bundesärztekammer
 * al posto dell'Ordine dei Medici, vorrebbe dire dare una consulenza legale su
 * un ordinamento che ⛔ nessuno qui ha verificato. Un riferimento normativo
 * sbagliato è peggio di uno assente, perché **viaggia**: chi lo legge lo cita.
 *
 * ⇒ si fa l'unica cosa onesta: **si dichiara che quel pezzo è italiano**, si
 *   dice che cosa il software fa di conseguenza, e si manda il lettore dal
 *   proprio legale per l'equivalente locale.
 *
 * ── PERCHE' L'ELENCO DEI CAPITOLI E' DERIVATO E NON SCRITTO ─────────────────
 * ⚠️ Un elenco scritto a mano di «capitoli che citano norme italiane» invecchia
 * al primo capitolo nuovo, e invecchia **in silenzio**: il capitolo esce
 * tradotto, senza avviso, e nessuno se ne accorge. Qui si cerca nel testo, così
 * un capitolo nuovo che nomina l'AIFA prende l'avviso il giorno stesso.
 */

/** I segni che un testo parla di un obbligo o di un'istituzione italiana. */
export const SEGNI_ITALIANI: readonly string[] = [
  'AIFA',
  'PEC',
  '219/2017',
  'Ordine dei Medici',
  'Cassazione',
  'Agenzia delle Entrate',
  'Sistema Tessera Sanitaria',
  'codice fiscale',
  'Codice Fiscale',
  'Garante',
  'AGENAS',
]

/** Vero se il capitolo poggia su regole italiane. */
export function citaNormeItaliane(markdown: string): boolean {
  return SEGNI_ITALIANI.some((s) => markdown.includes(s))
}

export type LinguaNota = 'en' | 'es' | 'fr' | 'de'

/**
 * L'avviso, nella lingua del capitolo.
 *
 * ⚠️ Dice tre cose e nessuna di più: (1) questo pezzo descrive l'Italia,
 * (2) che cosa fa il software, (3) chi devi sentire tu. ⛔ Nessuna
 * affermazione su che cosa preveda la legge del lettore.
 */
const NOTE: Record<LinguaNota, string> = {
  en: [
    '> **Which country this chapter describes.** The rules named here (Law 219/2017 on informed consent, the AIFA medicines catalogue, registration with the Italian medical board, PEC certified email) are **Italian**, and Fibonacci is built on them: that is the structure of the forms and of the documents it produces.',
    '>',
    '> ⛔ This is **not** a statement about what your own country requires. If you practise outside Italy, the structure still helps, but the applicable rule is yours: have it checked by a lawyer in your jurisdiction before you use these documents with real patients.',
  ].join('\n'),
  es: [
    '> **De qué país habla este capítulo.** Las normas citadas aquí (la ley italiana 219/2017 sobre el consentimiento informado, el catálogo de medicamentos AIFA, la colegiación en el Colegio de Médicos italiano, el correo certificado PEC) son **italianas**, y Fibonacci está construido sobre ellas: esa es la estructura de sus formularios y de los documentos que genera.',
    '>',
    '> ⛔ Esto **no** dice nada sobre lo que exige tu país. Si ejerces fuera de Italia, la estructura sigue siendo útil, pero la norma aplicable es la tuya: que la revise un abogado de tu jurisdicción antes de usar estos documentos con pacientes reales.',
  ].join('\n'),
  fr: [
    '> **De quel pays parle ce chapitre.** Les règles citées ici (la loi italienne 219/2017 sur le consentement éclairé, le catalogue de médicaments AIFA, l’inscription à l’Ordre des médecins italien, la messagerie certifiée PEC) sont **italiennes**, et Fibonacci est construit dessus : c’est la structure de ses formulaires et des documents qu’il produit.',
    '>',
    '> ⛔ Cela ne dit **rien** de ce qu’exige ton pays. Si tu exerces hors d’Italie, la structure reste utile, mais la règle applicable est la tienne : fais-la vérifier par un juriste de ta juridiction avant d’utiliser ces documents avec de vrais patients.',
  ].join('\n'),
  de: [
    '> **Von welchem Land dieses Kapitel spricht.** Die hier genannten Regeln (das italienische Gesetz 219/2017 zur Einwilligung nach Aufklärung, der Arzneimittelkatalog der AIFA, die Eintragung bei der italienischen Ärztekammer, die zertifizierte E-Mail PEC) sind **italienisch**, und Fibonacci ist darauf gebaut: Sie bestimmen den Aufbau der Formulare und der erzeugten Dokumente.',
    '>',
    '> ⛔ Das ist **keine** Aussage darüber, was in deinem Land gilt. Wenn du außerhalb Italiens tätig bist, hilft die Struktur weiterhin, doch maßgeblich ist dein eigenes Recht: Lass es von einer Juristin oder einem Juristen deiner Rechtsordnung prüfen, bevor du diese Dokumente bei echten Patientinnen und Patienten einsetzt.',
  ].join('\n'),
}

/**
 * Il capitolo con l'avviso di giurisdizione, se serve.
 *
 * 🔑 L'avviso va **in testa**, prima del testo: in fondo lo leggerebbe solo chi
 * arriva in fondo, cioè non chi sfoglia. Ed è la stessa ragione per cui il
 * riquadro «misura la fotografia, non esamina la cute» sta in cima e non in
 * coda alla schermata dei parametri cutanei.
 *
 * ⚠️ L'italiano ⛔ non lo riceve mai: là quelle norme sono **le sue**, e un
 * avviso che dice «questo capitolo parla dell'Italia» a un medico italiano è
 * rumore che insegna a saltare i riquadri.
 */
export function conNotaDiGiurisdizione(markdown: string, lingua: string): string {
  if (lingua === 'it' || !(lingua in NOTE)) return markdown
  if (!citaNormeItaliane(markdown)) return markdown
  return `${NOTE[lingua as LinguaNota]}\n\n${markdown}`
}
