/** Spezza un elenco in gruppi di `quanti`.
 *
 * ⚠️ Serve al telefono, e solo lì. Una sezione con sei voci corte impilate fa
 * 1.149px su 721 utili: troppo per una schermata. Marcare **ogni voce** come
 * passo sarebbe stato più semplice, ma sei schermate con una riga al centro
 * ciascuna allungano la pagina senza dare niente in cambio — il passo deve
 * essere «quanto si legge in una schermata», non «un elemento».
 *
 * Su desktop i gruppi sono `<div>` trasparenti: l'elenco resta quello di
 * prima, perché `.passo` non ha regole sopra i 768px.
 */
export function raggruppa<T>(elenco: readonly T[], quanti: number): T[][] {
  const gruppi: T[][] = []
  for (let i = 0; i < elenco.length; i += quanti) gruppi.push(elenco.slice(i, i + quanti))
  return gruppi
}
