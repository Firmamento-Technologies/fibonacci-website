# Parámetros cutáneos

Esta guía describe la medición de los **parámetros cutáneos estéticos**: once magnitudes que Fibonacci calcula sobre una región de piel que elijas en una fotografía ya existente en la historia clínica, su guardado y la comparación en el tiempo. Son medidas **de la fotografía**, no de la piel: describen la imagen de una zona y sirven para documentar con números lo que hoy se documenta solo con dos fotos una al lado de la otra.

⚠️ **La página solo aparece si la función ha sido activada en tu consulta.** Si en la barra de la historia clínica no ves `Parametri cutanei`, no es un defecto: la función está detrás de un interruptor, apagado por defecto.

## Qué no hace, antes de qué hace

Está escrito también al inicio de la página, con la misma evidencia que los números, y no es una fórmula de cortesía:

> Esta herramienta calcula magnitudes fotográficas sobre la región que delimites. No detecta, no señala y no cuenta lesiones, nevus o manchas sospechosas, no atribuye los valores a una causa y no es una herramienta de cribado: no sustituye el examen de la piel.

En concreto: ningún valor se compara con un umbral, no existen juicios de gravedad o de grado, ningún número está coloreado de verde o de rojo, y la página nunca dice «mejorado» o «empeorado». Los números se muestran desnudos, con su unidad; el juicio queda en tus manos. Si al observar la región notas algo, lo ha notado tu ojo: el programa no mira, mide donde le indicas que mida.

## Requisitos previos

- Cuenta con rol `medico` o `admin studio`.
- Al menos una fotografía en la historia clínica (ver la guía «Foto clínicas y comparación antes/después»). Vale cualquier vista, no es necesario el frontal.

## Dónde se encuentra

El botón `Parametri cutanei` está en la barra superior de la historia clínica del `Paciente`, junto a `Analisi del volto`, y es visible desde cualquier pestaña. Desde la página del análisis facial y la de los parámetros se pasa de una a otra con un enlace en la parte superior derecha.

## Cómo se usa

1. **Elige la fotografía.** Debajo de `Fotografía` está la tira de las tomas en la historia clínica, de la más reciente. La primera ya está seleccionada.
2. **Traza la región.** Debajo de `Regione da misurare` arrastra el dedo o el ratón sobre la fotografía: lo que queda fuera se oscurece, así se ve de un vistazo qué entra en el cálculo y qué no. Puedes redibujarla cuantas veces quieras, el último rectángulo prevalece. Debajo de la fotografía encuentras la medida en píxeles de la región que has trazado.
3. **Lee los valores.** Aparecen junto a la fotografía en cuanto sueltas el arrastre.

⛔ **No hay una región predefinida, y no es un olvido.** Un programa que elige por sí mismo dónde mirar empieza a seleccionar hallazgos, que es otra cosa distinta a lo que hace esta herramienta. La zona la eliges tú, siempre.

Al cambiar de fotografía la región se reinicia: era un rectángulo sobre otra piel, y mantenerla daría números plausibles sobre una zona que nadie ha elegido.

El cálculo se realiza **en el navegador**: la fotografía no abandona el sistema y ningún servicio externo la recibe.

## Los once parámetros

| parámetro | qué indica |
|---|---|
| Área con pigmentación más oscura que el fondo local | qué parte de la región es más oscura que la media local que la rodea, en porcentaje |
| Aperturas circulares detectadas | cuántas pequeñas aperturas redondas se cuentan, dentro del intervalo de diámetro declarado |
| Diámetro medio de las aperturas detectadas | cuánto miden de media, en porcentaje del lado corto de la región |
| Área ocupada por las líneas detectadas | qué parte de la región está cubierta por las líneas que encuentran los filtros de contraste |
| Longitud total de las líneas detectadas | su longitud sumada, en múltiplos del lado corto de la región |
| Color medio, claridad L\* | la claridad media, de 0 (negro) a 100 (blanco) |
| Color medio, eje a\* | el eje rojo/verde del color medio |
| Color medio, eje b\* | el eje amarillo/azul del color medio |
| Ángulo tipológico individual (ITA) | el ángulo colorimétrico calculado a partir de L\* y b\*, en grados |
| Deshomogeneidad del color | cuánto se alejan en promedio los píxeles de la región del color medio |
| Área con componente roja más alta que la mediana de la región | qué parte de la región supera en una cantidad declarada la mediana del rojo de la propia región |

Las etiquetas indican **qué se ha medido en la imagen**, nunca a qué podría deberse: esa interpretación la haces tú frente al paciente, y es el motivo por el que el programa no la escribe por ti.

### El ITA no es el fototipo, y Fibonacci no lo convierte en fototipo

Es la pregunta que surge enseguida, porque en la bibliografía existe una tabla de conversión entre ángulo tipológico individual y fototipo de Fitzpatrick, y es de seis filas. Fibonacci **no la aplica**, y muestra solo el ángulo. Tres razones, en orden de importancia:

1. **Un fototipo es un grado, y esta página no asigna grados.** Aquí vale la misma regla que para el resto: la herramienta mide, la clasificación la hace el médico.
2. **La conversión, medida, no funciona bien precisamente con Fitzpatrick.** Un estudio de 2025 que calcula el ITA de forma automática y lo mapea en dos escalas encuentra buena concordancia con la escala de Monk y una concordancia **menos constante** con los tipos de Fitzpatrick. No sorprende: Fitzpatrick surge de la **reacción al sol**, no del color, y de hecho es una evaluación, no una medida de color.
3. **Clasificar a una persona por el color de la piel a partir de una fotografía es categorización biométrica sobre una característica protegida**, y como tal no es una elección técnica sino una decisión con consecuencias normativas propias.

El fototipo en Fibonacci sigue donde siempre ha estado: el campo `Fototipo (Fitzpatrick)` en la anamnesis estética, que el sistema ya describe como «Es una evaluación del médico, no una respuesta del paciente». El ángulo medido aquí puede ayudarte a completarlo, no lo completa por ti.

El botón `Come è misurato`, debajo de los valores, abre los parámetros exactos del método: área de trabajo, región mínima, radio del fondo local, intervalo de diámetro de las aperturas, orientaciones y umbral de los filtros de líneas, desviación de la componente roja. Son los parámetros de la herramienta, como el diafragma de una cámara fotográfica: ninguno de ellos separa un valor «normal» de uno «anómalo».

## Qué tamaño debe tener la región

Debe tener al menos **120 píxeles de lado** y **40 mil píxeles cuadrados** de área. Si es más pequeña, la página lo indica y no muestra números.

La razón es medida, no prudencial: en una región pequeña las aperturas a contar son pocas, y un conteo sobre pocos elementos varía. Al volver a fotografiar la misma piel sin cambiar nada, el conteo se movió un **33% en veintiún mil píxeles cuadrados** y un **9,8% en setenta y ocho mil**: es decir, en una región pequeña el número cambia en un tercio sin que en la piel haya ocurrido nada. Un número así no es una medida, es ruido con apariencia de medida, y entonces es mejor no mostrar ningún número.

Por la misma razón, debajo de los valores la página indica cuántas aperturas ha contado en esa región y cuál es la precisión del conteo. Es la tolerancia del instrumento, como la de un calibre: **no** es un juicio sobre la piel. Si necesitas un conteo más estable, amplía la región.

## Guardar en la historia clínica

Los valores se recalculan a partir de la fotografía cada vez que abres la página. En la historia clínica se guardan **solo si los guardas**: debajo de los valores elige la `Zona misurata` de la lista (el mismo vocabulario de áreas que usas para los tratamientos y las fotos) y pulsa `Salva in cartella`.

La zona es obligatoria: sin ella, en la comparación en el tiempo una mejilla y una frente acabarían en la misma fila.

Guardar de nuevo la **misma región de la misma fotografía** actualiza la medición en lugar de duplicarla, y el botón lo indica: se convierte en `Aggiorna in cartella`. Dos zonas distintas en la misma fotografía conviven sin sobrescribirse.

Lo que se guarda en la historia clínica lleva consigo su origen: la fotografía de procedencia, el rectángulo exacto (así la misma medición se puede repetir idéntica), el método con el que se obtuvo y quién decidió guardarla. La fecha de la medición es la del **disparo**, no la del guardado: la piel medida es la de entonces.

## En el tiempo

Al final de la página, `Nel tempo, per zona` alinea las mediciones guardadas, **separadas por zona**, con el valor más reciente y la diferencia respecto al primero.

Encima de las series siempre aparece la misma frase, y es lo más importante de la página:

> Al volver a fotografiar la misma piel sin cambiar nada, en pruebas estos números variaron entre el 1% y el 6% (hasta el 10% el conteo de aperturas, en una región pequeña). Una diferencia menor no es una diferencia.

Incluso los gráficos están calibrados según ese número: una diferencia menor que la precisión del instrumento se ve **plana**, no en ascenso. Sin este ajuste, una línea entre solo dos mediciones dibujaría siempre una diagonal a toda altura, incluso para una diferencia de cero, y el dibujo diría algo que el número no dice.

## Los límites, detallados

- **Miden la fotografía, no la piel.** Varían con la luz, con la distancia de toma, con el objetivo y con la compresión del archivo. Para que dos mediciones sean comparables se necesitan dos tomas comparables: misma posición, misma luz, misma distancia. Aquí vale exactamente lo mismo que para la comparación antes/después.
- **La prueba de repetibilidad se hizo sobre fotografías de estudio**, bien iluminadas y enfocadas. No tiene en cuenta la luz de tu consulta, el maquillaje residual o la hora del día. Los números anteriores son, por tanto, un **mínimo**: en tu posición la desviación será mayor, no menor.
- **Ningún modelo entrenado.** Los valores provienen de cálculos descriptibles uno a uno (medias locales, componentes conectadas, filtros orientados, conversión de espacio de color), no de un sistema entrenado con casos clínicos. Es una elección, no un límite técnico: un sistema entrenado respondería a la pregunta «a qué se parece», que es otra pregunta.
- **No es una herramienta de cribado.** Medir algo en una región no significa que el resto haya sido examinado.

## Guías relacionadas

- «Foto clínicas y comparación antes/después», para el protocolo de toma: es lo que hace comparables las mediciones.
- «Analisi del volto», para las mediciones de forma y proporción en el frontal.
