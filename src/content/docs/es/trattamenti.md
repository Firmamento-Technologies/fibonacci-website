# Registrar un tratamiento

Esta guía describe cómo registrar una sesión de medicina estética: producto, lote, áreas, cantidad y qué hace el sistema después. Está dirigida a los médicos.

El registro de la sesión es el acto clínico que, meses o años después, demuestra qué se hizo y con qué productos. Es el documento que respalda en caso de reclamación, y también el que nadie tiene ganas de completar al final de un día agotador: la pantalla está diseñada para pedir lo mínimo indispensable y completar automáticamente el resto.

## Requisitos previos

- Cuenta con rol `médico`.
- Ficha del `Paciente` existente.
- Consentimiento informado del tratamiento **firmado**. Si falta el consentimiento, la sesión se registra igualmente (no se oculta lo que se ha hecho), pero queda señalada como carente de consentimiento.

## Paso 1, abrir la sesión

Desde la ficha del paciente, la sección `Tratamientos` y el botón `Añadir`. Se elige el producto, y el sistema reconoce automáticamente la categoría y la familia química: ácido hialurónico, hidroxiapatita, ácido poli-L-láctico, toxina botulínica.

El reconocimiento sirve para dos cosas: colorear el mapa de áreas por categoría y, cuando existe una duración escrita en un consentimiento, proponer el recordatorio del paso 5.

## Paso 2, lote, cantidad, caducidad

El número de lote debe introducirse **tal como aparece impreso en el envase**. Es la clave con la que, el día de una retirada del fabricante, se responde a la pregunta «qué pacientes han recibido este lote». La guía dedicada es `Trazabilidad del lote`.

En estos campos el sistema **registra y no calcula**: la dilución declarada se escribe tal cual. Si un valor parece incoherente, aparece un aviso, pero no se bloquea el guardado. Un software que se niega a registrar lo que se ha hecho produce historias clínicas que no se corresponden con la realidad, y eso es un daño peor que el error que pretendía evitar.

## Paso 3, las áreas tratadas

En la opción `Body-map y áreas tratadas` se indican los puntos con círculos numerados, asociando a cada uno la cantidad. Se elige entre el retrato frontal (`Foto`) y el modelo tridimensional (`Anatomía 3D`), que es el cuerpo entero con el rostro incluido: en la foto basta un clic, en el modelo se necesita doble clic. Las coordenadas del retrato son distintas para hombre y mujer, porque las proporciones del rostro difieren y un círculo en el punto equivocado es documentación incorrecta.

En cada punto se puede registrar también **cómo** se realizó la inyección: instrumento, calibre, plano y técnica, en cuatro menús desplegables opcionales. El detalle, junto con las dos formas de llevar a la mapa las áreas descritas con palabras, está en [Las áreas tratadas: en la foto y en el modelo 3D](/manuale/body-map).

⛔ **No existe un botón que copie las áreas de la sesión anterior.** Hasta el 17 de agosto de 2026 esta guía describía uno, y nunca ha existido: para un retoque, las áreas se vuelven a seleccionar, o se escribe la sesión con palabras y se pulsa `Auto-extraer áreas del texto`.

## Paso 4, si es un dispositivo de energía

Cuando el producto seleccionado es reconocido como **láser** (u otro dispositivo de energía), aparece el recuadro `Parámetros de emisión`: longitud de onda, fluencia, spot, frecuencia, duración del pulso con su unidad, número de pasadas, densidad, `Enfriamiento` y `Endpoint clínico observado`.

Dos cosas que debes saber:

- **Son campos libres, sin valores propuestos.** Los números se leen en la pantalla de la máquina. Un menú de «valores típicos» sería una propuesta clínica disfrazada de comodidad, y un valor predeterminado es una propuesta aunque se pueda cambiar.
- **El endpoint no es un detalle sin importancia**: es lo que titula la fluencia de la sesión siguiente. Registrarlo es la diferencia entre continuar un ciclo y empezarlo desde cero.

Para los inyectables, el mismo papel lo tienen `Dilución preparada`, `Caducidad del lote` y `UDI del dispositivo (opcional)`.

## Paso 5, uso off-label

Si el producto se usa fuera de las indicaciones autorizadas, la casilla `off-label` debe marcarse. No es un formalismo: el uso off-label es lícito pero requiere una información específica al paciente, y haberlo registrado es lo que permite demostrarla.

## Paso 6, el recordatorio

Al guardar, si la familia química del producto tiene una duración esperada escrita en un consentimiento, el sistema propone un `Recordatorio` interno en la fecha adecuada.

Dos precisiones que valen más que la función:

- **El recordatorio es para el médico, no para el paciente.** No se envía ningún mensaje automático. Es una elección obligada: la L. 145/2018 prohíbe a los colegiados las comunicaciones con elementos atractivos, y un envío automático expondría **al médico** a la sanción, no a nosotros.
- **Si la duración no se conoce, no se propone nada.** Esto aplica a la hidroxiapatita y a los bioestimuladores a base de ácido hialurónico bio-remodelante: los plazos que circulan provienen de material divulgativo, no de fuentes primarias. Un recordatorio inventado no es un recordatorio más, es un consejo clínico erróneo que parece venir del sistema.

## Qué se puede hacer desde una sesión ya registrada

Cada fila de la sección `Tratamientos` ofrece, además de la modificación y la eliminación, tres acciones que se reconocen por el icono:

- **Descargar el expediente de la sesión (PDF)**: un documento con lo que de esa sesión está registrado en la historia clínica (producto, lote, caducidad, cantidad, dilución, áreas, técnica, consentimientos, fotos y accesos). Declara por sí mismo las secciones vacías en lugar de omitirlas: un expediente que calla sobre una sección es indistinguible de uno en el que esa sección no existía.
- **Registrar una complicación en esta sesión**: ver [Resultados y complicaciones](/manuale/esiti-e-complicanze).
- **Exportar en formato CDA**: el documento clínico en el formato de intercambio.

⚠️ Una sesión marcada como introducida por error no acepta más complicaciones ni modificaciones: sigue visible, porque borrar no es corregir.

## Errores frecuentes

- **Lote dejado en blanco.** Es el caso en el que la trazabilidad es más necesaria, y no existe.
- **Tratamiento registrado al día siguiente.** La fecha de la sesión es modificable, pero debe corregirse: las fechas incorrectas solo se notan cuando alguien las lee en una reclamación.
- **Áreas indicadas con palabras en lugar de en el mapa.** «Pómulos» es ambiguo; dos círculos con la cantidad no.

## Preguntas frecuentes

**¿Puedo modificar una sesión guardada?** Sí, y la modificación queda en el historial con quién y cuándo. No se sobrescribe nada en silencio.

**¿El tratamiento aparece en el expediente?** Sí: producto, lote, caducidad, cantidad, dilución, consentimientos, fotos y accesos, en un único documento.
