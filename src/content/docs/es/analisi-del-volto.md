# Análisis del rostro

Esta guía describe la página **«Análisis del rostro»**: la **comparación directa entre dos fotografías**, antes y después, la **vista tridimensional** del rostro, el **espejo en vivo** y el registro del **juicio clínico (PGAIS)** sobre la comparación.

La página **no mide**. No calcula ángulos, proporciones, diferencias ni puntuaciones, no los guarda en la historia clínica ni los compara con ninguna referencia: muestra las fotografías y la forma del rostro, y el juicio sigue siendo del médico.

## Requisitos previos

- Cuenta con rol `medico` o `admin studio`.
- Al menos una fotografía frontal del rostro ya en la historia clínica (ver la guía «Fotos clínicas y comparación antes/después»).

## Dónde se encuentra

El botón `Análisis del rostro` está en la barra superior de la historia clínica del paciente, junto a `Datos y personas` y al menú `Exporta`, y es visible desde cualquier pestaña.

## La comparación antes/después

El primer clic selecciona la toma en examen, el segundo sobre otra fotografía añade la comparación: las dos pestañas se colocan una al lado de la otra y se visualizan juntas. Es el gesto central de la página.

Sobre cada fotografía, la página indica cuándo la **toma no es comparable**: una pose diferente (mentón elevado, cabeza girada) cambia lo que se ve, y dos poses distintas no se pueden comparar. El aviso no bloquea nada: informa antes de que alguien saque una conclusión.

## La vista 3D

El interruptor `Foto | 3D` muestra la forma del rostro reconstruida a partir de los puntos de referencia, navegable (*«Arrastra para girar, rueda para acercar»*), en superficie, retícula o **`Relieve`**, que colorea la superficie según la profundidad en lugar de imitar la piel: es la forma en que las asimetrías de volumen se ven a simple vista. También son visibles los puntos de referencia, los 468.

**No es un escaneo**: la profundidad se estima a partir de una sola fotografía y es relativa. Sirve para girar alrededor de la forma y mostrarla al paciente, **no** para medir protuberancias o volúmenes. Para volúmenes y mapas de superficie se necesita hardware de estereofotogrametría, que esta página no pretende sustituir.

## La retícula sobre la fotografía

El botón `Malla` superpone a la fotografía la retícula de los puntos de referencia: muestra **cómo el software ve la forma del rostro**. No es una medida ni un juicio; permanece activado entre una foto y otra porque quien lo usa, lo usa siempre.

## El espejo en vivo

`Espejo en vivo` enciende la cámara y muestra al paciente su propio rostro en tiempo real, con la indicación de `Encuadra el rostro`. **No mide ni registra nada**, y la cámara *«está apagada. Se enciende solo cuando lo solicitas»*: sirve durante la conversación, para hablar de una zona mirándola juntos.

## La serie fotográfica por vista

El protocolo fotográfico clínico es una serie de tomas en vistas definidas (frontal, laterales, oblicuas a 45°, más las dinámicas para la mímica) repetida de la misma manera en cada visita. Por eso, al cargar, cada foto puede indicar la **vista**; la pestaña `Foto` muestra la serie de la visita más reciente y señala qué vistas faltan.

Tres reglas de la serie:

- la vista es **opcional**: las fotografías cargadas antes de esta función no la tienen, y «no indicada» sigue siendo diferente de «frontal». El sistema nunca completa el campo por sí solo;
- la lista de verificación **informa y no bloquea**: tomas fuera de serie son lícitas;
- al tomar una foto con una vista seleccionada, la **toma anterior de la misma vista aparece en transparencia** en el visor: superponer el rostro al fantasma es la forma práctica de repetir encuadre y distancia.

La página trabaja con las tomas frontales (y con aquellas sin vista indicada); si otras tomas quedan excluidas, indica cuántas.

## Registrar el PGAIS desde la comparación

Seleccionadas dos fotografías, aparece el botón `Registra PGAIS`. El PGAIS es el juicio del médico sobre el resultado, dado **comparando las fotografías pre y post**: registrarlo desde aquí significa registrar también qué dos tomas se estaban viendo, sin volver a copiar fechas.

La respuesta es una etiqueta («Mucho mejor», «Mejor», …), nunca un número: la numeración del GAIS se usa en la literatura en direcciones opuestas, y un número guardado sin la dirección no sería interpretable con el tiempo.

## Errores frecuentes

- **Comparar tomas de vistas diferentes.** Un frontal y un 45° del mismo día solo se parecen en el nombre: la comparación es válida entre vistas homólogas.
- **Fotografiar el «después» demasiado pronto.** Con el edema no reabsorbido, la comparación documenta la hinchazón, no el resultado.
- **Interpretar el 3D como una medida.** Es una representación de la forma obtenida a partir de una fotografía: sirve para mirar y mostrar, no para cuantificar.

## Preguntas frecuentes

**¿La página guarda algo en la historia clínica?** Solo el PGAIS, que es el juicio del médico, junto con las dos tomas a las que se refiere. La forma 3D y la retícula se recalculan a partir de la fotografía cada vez que se abre y no se conservan.

**¿El análisis envía la foto a un servicio externo?** No. El modelo de puntos de referencia se ejecuta en el navegador; la fotografía permanece cifrada en el sistema y solo se descifra para quien tiene derecho a verla, como cualquier otra foto clínica.

**¿Por qué no hay medidas del rostro?** Decisión de producto. Un número clínico solo tiene sentido con su precisión declarada y con alguien que responda por esa precisión: hasta que no exista, la página muestra las fotografías y la forma, y deja al médico la medida y el juicio.
