# Atlas anatómico 3D

El visor 3D sirve para mostrar al paciente dónde se interviene y para explicar un
riesgo que depende de una relación anatómica en lugar de hacerlo con palabras.

⚠️ **Esta opción solo aparece en consultas de medicina estética.** Está vinculada al vertical:
si no ves `Anatomía 3D` en la navegación, tu consulta no tiene ese vertical activo.

⚠️ **No es el mapa donde se registra una sesión.** Esta página es un atlas: se visualiza y se gira,
pero no registra nada. Las áreas tratadas se marcan dentro de la sesión, en el retrato o en el modelo 3D del cuerpo:
consulta la guía [Las áreas tratadas: en la foto y en el modelo 3D](/manuale/body-map). Ambas utilizan
el mismo modelo anatómico y sirven para dos propósitos distintos.

## Cómo se usa

El modelo se abre con el cuerpo completo. Desde el panel lateral se activan los **sistemas**
anatómicos. Son nueve:

- `Esqueleto` y `Articulaciones`,
- `Sistema muscular` e `Inserciones musculares`,
- `Sistema cardiovascular`,
- `Sistema linfático`,
- `Sistema nervioso y sentidos`,
- `Vísceras`,
- `Regiones y piel`, es decir, las regiones topográficas de la superficie corporal.

- **Varios sistemas a la vez.** Se pueden mantener activados simultáneamente, por ejemplo,
  esqueleto y musculatura, cuando es necesario mostrar una relación entre planos.
- **El detalle.** Cuando está activado **exactamente un** sistema, el panel muestra además
  el desglose de las subestructuras: se aísla el distrito individual en lugar de navegar
  por todo el aparato. No todos los sistemas lo tienen: el esqueleto se divide en doce partes,
  las vísceras y la musculatura en seis, el linfático en ninguna.

El modelo se gira arrastrando, se acerca con la rueda del ratón o con dos dedos.

## Para qué sirve en la práctica

- **Antes del consentimiento informado**, para mostrar al paciente la zona de la que se está hablando.
  Una imagen compartida reduce los malentendidos que luego reaparecen en los litigios.
- **Durante la explicación de un riesgo**, cuando el riesgo depende de una relación anatómica:
  un vaso, un nervio, un plano de despegamiento.

## Límites declarados

- **No es un modelo del paciente individual**: es un atlas de referencia. No tiene en cuenta
  las variantes individuales y no debe usarse como base para una medición.
- **Es un solo cuerpo.** El atlas no tiene una variante femenina: el modelo femenino existe,
  pero está en el mapa de las áreas tratadas, no aquí.
- **No se integra automáticamente en la historia clínica.** Lo que se documenta es la ubicación
  escrita en la ficha del tratamiento y, si es necesario, el mapa de los puntos: el visor acompaña
  la explicación, no la sustituye.
- **El modelo 3D pesa.** Se carga la primera vez que se abre la página, y en conexiones lentas
  tarda unos segundos: es una carga bajo demanda, para no ralentizar las demás páginas.

## La fuente del modelo

Las geometrías provienen de **Z-Anatomy / BodyParts3D** (The Database Center for Life Science),
distribuidas bajo licencia CC BY-SA: la atribución aparece debajo del visor, tanto aquí como en el mapa
de las áreas tratadas. Los nombres de las estructuras son los de la *Terminología Anatómica* (TA2),
en inglés, porque son la clave del modelo; las etiquetas en italiano de las regiones cutáneas utilizadas
en los tratamientos las hemos escrito nosotros, una por una.

## Véase también

- [Las áreas tratadas: en la foto y en el modelo 3D](/manuale/body-map)
- [Registrar un tratamiento](/manuale/trattamenti)
