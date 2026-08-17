# Análisis del rostro

Esta guía describe el análisis morfológico del rostro: las medidas que Fibonacci obtiene a partir de una fotografía frontal, la comparación con los cánones neoclásicos, la vista tridimensional, la serie fotográfica por vista, el guardado en la cartilla clínica y el registro del juicio clínico (PGAIS) sobre la comparación antes/después. El análisis produce medidas (ángulos, relaciones, desviaciones) y las ordena en el tiempo; el juicio sigue siendo del médico.

## Requisitos previos

- Cuenta con rol `médico` o `admin studio`.
- Al menos una fotografía frontal del rostro ya en la cartilla clínica (ver la guía «`Fotos clínicas y comparación antes/después`»).

## Dónde se encuentra

El botón `Analisi del volto` está en la barra superior de la cartilla del paciente, junto a `Dati e persone` y al menú `Esporta`, y es visible desde cualquier pestaña.

## Qué mide, y sobre qué foto

La detección ocurre **en el navegador**: la fotografía no abandona el sistema y ningún servicio externo la recibe. En una toma frontal, el análisis obtiene:

- la **línea media del rostro** y el **paralelismo de los planos** interpupilar, de los cantos externos y de las comisuras labiales, como desviación en grados respecto a la perpendicular a la línea media;
- los **tercios** (relación tercio medio / tercio inferior). El tercio superior no es calculable: requiere la línea de implantación del cabello, que el modelo no identifica, y la página lo declara en lugar de estimarlo;
- **qué lado es más ancho** en pómulos, cantos externos y comisuras. Indica qué lado, no «cuánto es asimétrico el rostro»: es la fuente del modelo la que excluye ese segundo uso;
- la **calidad de la toma** (rotaciones de la cabeza), que marca las tomas no frontales en lugar de ocultar sus números.

Las medidas son adimensionales (ángulos, relaciones, porcentajes) porque a partir de una fotografía sin referencia métrica no se pueden obtener milímetros de manera honesta.

## La comparación con el canon neoclásico

Cada ítem muestra el valor medido, el valor del canon de referencia y la desviación entre ambos. La comparación con el canon y la comparación antes/después permanecen separadas: fusionarlos daría un número que no responde ni a «cuánto se desvía del referente» ni a «qué ha hecho el tratamiento».

## La vista 3D

El interruptor `Foto | 3D` muestra la malla del rostro reconstruida a partir de los puntos de referencia, navegable (*«Arrastra para girar, rueda para acercar»*), en superficie, retícula o **`Rilievo`**, que colorea la superficie según la profundidad en lugar de imitar la piel: es la forma en que las asimetrías de volumen se ven a simple vista. También son visibles los puntos de referencia, los 468.

**No es un escaneo**: la profundidad se estima a partir de una sola fotografía y es relativa: sirve para girar alrededor de la forma, no para medir protuberancias o volúmenes. Para volúmenes y mapas de superficie se necesita hardware de estereofotogrametría, que esta página no pretende sustituir.

## Los ángulos de perfil, colocados manualmente

En las vistas laterales, el modelo no proporciona los puntos necesarios, por lo que los coloca el médico: la sección `Angoli di profilo (punti posati a mano)` solicita **seis puntos** y, cuando están todos, mide los ángulos (*«Sei punti posati: angoli misurati»*). `Ricomincia` los reinicia.

Es el único punto de la página en el que la medida depende de dónde hagas clic: dos series de clics diferentes dan dos resultados distintos, y la repetibilidad es tuya.

## Las medidas en milímetros

`Calibra con un marcador` transforma las relaciones en milímetros: se declara la `Dimensione reale (mm)` de un objeto presente en la toma y se hace clic en sus dos extremos. A partir de ahí, la página muestra las `Misure assolute (calibrate)`; `Rifai i clic` y `Ricalibra` repiten la operación.

⚠️ **La calibración solo vale en pantalla**: los milímetros no se guardan en la cartilla clínica, porque dependen de un marcador y de dos clics en ese momento. Lo que se guarda siguen siendo las relaciones y los ángulos, que no necesitan escala.

## El espejo en vivo

`Specchio dal vivo` enciende la cámara y muestra al paciente su propio rostro en tiempo real, con la indicación de `Inquadra il viso`. **No mide ni registra nada**, y la cámara *«está apagada. Solo se enciende cuando lo solicitas»*: sirve durante la consulta, para hablar de una zona mirándola juntos.

## La serie fotográfica por vista

El protocolo fotográfico clínico es una serie de tomas en vistas definidas (frontal, laterales, oblicuas a 45°, más las dinámicas para la mímica) repetida igual en cada visita. Por eso, al cargar, cada foto puede indicar la **vista**; la pestaña `Foto` muestra la serie de la visita más reciente y señala qué vistas faltan.

Tres reglas de la serie:

- la vista es **opcional**: las fotografías cargadas antes de esta función no la tienen, y «no indicada» sigue siendo diferente de «frontal». El sistema nunca rellena el campo por sí solo;
- la lista de verificación **informa y no bloquea**: las tomas fuera de serie son lícitas;
- al tomar una foto desde la cámara con una vista seleccionada, la **toma anterior de la misma vista aparece en transparencia** en el visor: superponer el rostro al fantasma es la forma práctica de repetir encuadre y distancia.

El análisis trabaja sobre las tomas frontales (y sobre aquellas sin vista indicada); si otras tomas quedan excluidas, la página indica cuántas.

## Guardar las medidas en la cartilla clínica y leerlas en el tiempo

Las medidas se recalculan a partir de la fotografía cada vez que se abre; **solo se guardan en la cartilla clínica si el médico las guarda**, con el botón `Salva in cartella` debajo de los números. Es un gesto explícito a propósito: un número producido por un modelo entra en la documentación clínica solo por decisión del médico, y el registro declara por sí mismo quién midió (el modelo, en el navegador), a partir de qué fotografía y quién decidió guardar.

Tres reglas del guardado:

- la fecha clínica de la medida es la **de la toma**, no del día en que se guarda;
- volver a guardar la misma fotografía **actualiza** el registro existente, no crea uno segundo;
- una toma marcada como «por repetir» (cabeza girada) **no se puede guardar**: sus números no son comparables y en una serie histórica causarían daño.

A partir del segundo guardado, la página muestra la sección **Nel tempo**: una pequeña serie para cada medida, en las fechas reales de las tomas, con el valor más reciente y la diferencia respecto al primero. Es la comparación del rostro consigo mismo (lo que esta página pone en el centro) extendida más allá del par de fotografías.

## Registrar el PGAIS a partir de la comparación

Al elegir dos fotografías (la primera elección es la toma en estudio, la segunda la comparación), la sección «Che cosa è cambiato» muestra las diferencias y el botón `Registra PGAIS`. El PGAIS es el juicio del médico sobre el resultado, dado **comparando las fotografías pre y post**: registrarlo desde aquí significa registrar también qué dos tomas se estaban viendo, sin copiar fechas.

La respuesta es una etiqueta («Molto migliorato», «Migliorato», …), nunca un número: la numeración del GAIS se usa en la literatura en direcciones opuestas, y un número guardado sin la dirección no sería interpretable con el tiempo.

## Errores frecuentes

- **Comparar tomas de vistas diferentes.** Un frontal y un 45° del mismo día solo se parecen en el nombre: la comparación es válida entre vistas homólogas.
- **Fotografiar el «después» demasiado pronto.** Con edema no reabsorbido, la comparación documenta la hinchazón, no el resultado.
- **Leer el canon como un boletín de notas.** Es una referencia geométrica histórica: la desviación es una diferencia entre dos números, no una indicación de tratamiento.

## Preguntas frecuentes

**¿Las medidas se guardan en la cartilla clínica?** Solo si el médico las guarda, con el botón dedicado: se recalculan a partir de la fotografía cada vez que se abre, y la copia en la cartilla clínica declara quién midió y a partir de qué toma. Ver «Salvare le misure in cartella».

**¿El análisis envía la foto a un servicio externo?** No. El modelo de puntos de referencia se ejecuta en el navegador; la fotografía permanece cifrada en el sistema y solo se descifra para quien tiene derecho a verla, como cualquier otra foto clínica.

**¿Por qué no hay una puntuación global de armonía?** Decisión de producto: la página proporciona todas las medidas; la síntesis y el juicio quedan en manos del médico.
