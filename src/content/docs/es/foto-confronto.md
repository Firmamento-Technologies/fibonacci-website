# Fotos clínicas y comparación antes/después

Esta guía describe cómo adquirir, conservar y comparar las fotografías clínicas en Fibonacci. Va dirigida a los médicos y al personal que documenta los tratamientos.

Las fotografías son la documentación que sostiene o no un resultado cuando este es cuestionado, y son datos relativos a la salud según el art. 9 del GDPR: por eso el procedimiento descrito aquí no es igual al de un archivo de imágenes cualquiera.

## Requisitos previos

- Cuenta con rol `médico` o `admin studio`.
- Ficha del paciente ya creada.
- Consentimiento informado para el tratamiento fotográfico recogido y archivado. El consentimiento para el tratamiento no cubre la fotografía: son dos finalidades distintas, y la segunda debe documentarse por separado.

## Cómo se conservan las fotografías

Cada imagen se cifra **antes de salir del navegador**, con una clave generada para esa fotografía en concreto. Esa clave, a su vez, se protege con una clave de proyecto que reside en el servidor y nunca entra en el código que se ejecuta en el navegador.

Tres consecuencias prácticas que vale la pena conocer antes de trabajar:

- Quien obtuviera una copia de la base de datos o del disco no vería las fotografías: vería bloques cifrados.
- La apertura de una fotografía es un acceso y queda registrado en el `Registro de accesos`, con quién y cuándo. No es una limitación: es lo que permite demostrar, años después, quién vio qué.
- Las fotografías no aparecen en las vistas previas de impresión de los documentos clínicos. Deben entregarse por separado y de forma consciente.

## Paso 1, adquirir una fotografía

Desde la ficha del paciente, la sección `Foto` muestra las adquisiciones existentes agrupadas por fecha. El botón `Añadir foto` abre la ventana de carga, que acepta imágenes desde la cámara del dispositivo o desde archivos.

Antes de guardar, el sistema realiza dos operaciones automáticas:

- **eliminación de los metadatos EXIF**, incluida la ubicación geográfica. Una fotografía tomada con el teléfono en la consulta lleva consigo las coordenadas: entregarla a un tercero significaría entregar también la dirección de quien la tomó,
- **detección de rostros**, con la posibilidad de difuminarlos. El difuminado es una elección del médico y no es automático, porque en medicina estética el rostro suele ser el objeto mismo de la documentación.

Al guardar, se indica el área tratada y, si es pertinente, el tratamiento al que se refiere la fotografía. Esta asociación es lo que hace posible la comparación del paso 3.

### La vista y la serie estándar

Cada toma puede declarar la `Vista`: `Frontal`, `Lateral derecha`, `Lateral izquierda`, `Oblicua 45° derecha`, `Oblicua 45° izquierda`, `Dinámica (mímica)`. Es el protocolo fotográfico clínico: la misma serie de encuadres, repetida igual en cada visita, es lo que hace comparables dos fechas.

Tres reglas, todas intencionadas:

- **la vista es opcional.** Las fotografías cargadas antes de esta función no la tienen, y «no indicada» sigue siendo distinto de «frontal»: el sistema nunca rellena el campo por sí solo;
- **la lista de verificación informa y no bloquea.** La pestaña `Foto` muestra la serie de la visita más reciente e indica qué vistas faltan; las tomas fuera de serie siguen siendo lícitas;
- **al tomar una foto con la cámara con una vista seleccionada, la toma anterior de la misma vista aparece en transparencia en el visor** (*«Toma anterior en transparencia: superpón para repetir el encuadre»*). Superponer el rostro al fantasma es la forma práctica de repetir encuadre y distancia, y la cámara también ayuda con el óvalo de pose y el recordatorio *«Ojos en la línea · luz frontal uniforme · fondo neutro»*.

### Para qué podrá servir esa foto

Al cargar, se declara la finalidad: `C1: Clínico:` (necesario para el tratamiento), `C2: Didáctico:` y `C3: Promocional:`. Las primeras permanecen siempre en la historia clínica; las otras dos dependen de un consentimiento separado, revocable en cualquier momento, y para la promoción rige la L. 145/2018. Fuera de la atención médica, la anonimización es obligatoria.

## Paso 2, organizar por sesión

Las fotografías asociadas a un tratamiento aparecen en la fila de la sesión correspondiente. Las fotografías no asociadas permanecen en la lista general, ordenadas por fecha.

Consejo operativo: adquirir siempre al menos una toma antes del tratamiento, con el mismo encuadre y la misma iluminación que se usará después. Una comparación entre dos fotografías tomadas en condiciones distintas no documenta el resultado: documenta la diferencia de luz.

## Paso 3, comparación antes/después

En la sección `Foto`, al seleccionar dos imágenes de la misma área se abre la vista de comparación lado a lado. La vista muestra las dos fechas, el área y el posible tratamiento interpuesto.

La comparación tiene una **barra central arrastrable** (*«Pre a la izquierda, Post a la derecha»*) y un `Detectar el rostro y alinear automáticamente las fotos`, que superpone las dos tomas usando los puntos del rostro cuando los encuadres no coinciden; `Eliminar alineación` vuelve a las imágenes tal como se tomaron.

⚠️ **El alineamiento es una ayuda para la lectura, no una corrección de la fotografía**: las imágenes originales no se modifican. Y alinear dos tomas tomadas desde ángulos distintos las hace superponibles, no comparables: la serie por vista sigue siendo el método correcto.

La comparación es una vista, no un documento: no modifica las imágenes ni crea nuevas. Si es necesario entregar la comparación al paciente, se exportan las dos fotografías originales.

Desde la comparación también se registra el **PGAIS**, el juicio del médico sobre el resultado: consulta [Análisis del rostro](/manuale/analisi-del-volto).

## Paso 4, entregar las fotografías al paciente

El paciente tiene derecho a recibir sus datos, incluidas las fotografías, en un formato legible. La exportación de las imágenes las descifra en el momento de la entrega: salen en claro en el paquete, mientras que la clave de proyecto nunca se entrega.

La razón es precisa: esa clave no solo abre las fotografías que se están entregando, sino todas las copias cifradas existentes, incluidas las de las copias de seguridad, y no es revocable. Entregarla significaría dar acceso a material que no se está entregando.

## Errores frecuentes

- **Fotografías sin consentimiento específico.** El consentimiento para el tratamiento no es el consentimiento para la fotografía. Si falta el segundo, no debería adquirirse la imagen.
- **Comparaciones entre encuadres distintos.** Son la causa más común de reclamaciones sobre el resultado: la diferencia percibida puede deberse al ángulo, no al efecto.
- **Envío de fotografías por mensajería ordinaria.** Son datos del art. 9: el canal debe elegirse en consecuencia, y un chat no cifrado no es ese canal.

## Preguntas frecuentes

**¿Puedo eliminar una fotografía?** Sí. La eliminación borra la imagen, pero queda registro en el `Registro de accesos` de que una fotografía existió y fue eliminada, con quién y cuándo. Es una protección, no un residuo.

**¿Las fotografías aparecen en el informe?** No, no automáticamente. El expediente de la sesión indica que existen y no las incorpora, porque su apertura es un acceso en sí mismo que debe quedar registrado.

**¿Cuánto ocupan?** Unos 18 GB por consulta al año con un uso intensivo. Es la razón por la que el archivo de imágenes está previsto en un espacio dedicado y no en el mismo disco que la base de datos.
