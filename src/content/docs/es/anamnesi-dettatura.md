# Dictar por voz: la dictación

> ⚠️ **Reescrito el 2026-08-17 revisando la pantalla.** La versión anterior
> describía un panel que nunca existió: un botón `Extraer campos`, una
> puntuación de fiabilidad para cada campo con los colores verde, amarillo y rojo,
> tres botones `Aceptar` / `Modificar` / `Descartar` por fila, una sección
> `Ajustes > Dictado` con el umbral de silencio y la conservación de las
> transcripciones. Nada de eso está en el producto. Lo siguiente, sí.

La dictación transcribe lo que dices y, donde el formulario lo prevé, propone los
campos ya completados. **Nunca escribe sola en la historia clínica**: entre la voz y el
dato guardado siempre hay una revisión y un botón que pulsas tú.

## Dónde se dicta

El botón aparece en tres lugares, con una etiqueta diferente en cada uno porque
«qué se dicta» cambia según el sitio:

- **`Dictar la anamnesis`**, en la pestaña `Anamnesis` de la historia clínica;
- **`Dictar la sesión`**, en el módulo del tratamiento, junto a las notas;
- en la **evaluación clínica**, cuando la consulta tiene ese módulo activo.

En reposo es una sola línea: un botón y una frase. El recuadro aparece cuando
hay algo dentro.

## Requisitos previos

- Cuenta con rol `médico` y acceso clínico al paciente.
- Micrófono funcional y permiso concedido al navegador. La calidad de la
  transcripción depende más del ruido ambiental que del micrófono.
- Conexión: la transcripción se realiza en un servicio, no en el navegador.

## Paso 1, dictar

Pulsa el botón. Aparece un punto rojo y el texto `Estoy escuchando`, y
debajo, en `Transcripción`, el texto aparece mientras hablas: *«Habla: el texto
aparece aquí mientras hablas»*.

Dos botones: **`Finalizar`** cierra la dictación y pasa a la revisión,
**`Cancelar`** la descarta.

## Paso 2, revisar

Al final, el texto transcrito aparece en un área **editable**, bajo un
aviso que vale la pena leer una vez:

> Revisa antes de usarlo. La transcripción automática se equivoca sobre todo en
> medicamentos, dosis y términos técnicos: corrige aquí abajo.

Si el módulo prevé la extracción de campos, junto al aviso aparece la
**fiabilidad de la extracción** en porcentaje. Es un número único para toda
la extracción, no uno por campo, y es un indicador técnico: dice cuánto el
modelo ha encontrado claro el texto, no cuán correcto es lo que has dicho.

## Paso 3, qué hacer con ello

Tres botones, y hacen cosas diferentes:

- **`Descartar`**: elimina la transcripción.
- **`Usar texto`**: toma el texto tal cual y lo coloca en el campo de
  destino (por ejemplo, al final de las notas de la sesión). Solo aparece donde
  ese texto tiene un destino: en otros casos sería un botón que borra y
  basta, y se ha eliminado.
- **el botón de aplicación** (`Proponer para la historia clínica` en la anamnesis,
  `Rellenar campos` en el tratamiento): toma los **campos** reconocidos y los lleva
  al módulo, donde permanecen editables. Solo aparece si la extracción ha
  producido algo.

⚠️ **Incluso después de aplicar los campos, el guardado es un gesto aparte.**
Aplicar rellena el módulo; en la historia clínica va lo que guardes tú.

## Qué completa la dictación y qué no

Este es el punto en el que las expectativas se rompen con más frecuencia, así que vale la
medida en lugar de la promesa.

**En el tratamiento** se proponen producto, cantidad, lote, uso off-label y
su justificación. **No** se completan los parámetros del dispositivo
(longitud de onda, fluencia, spot, frecuencia, duración del pulso, pasadas,
enfriamiento, endpoint), ni la dilución, el UDI o la caducidad del lote:
deben escribirse a mano.

**Las zonas dictadas no se convierten en puntos en el mapa.** Terminan al final de las
notas en la forma `[áreas dictadas: …]`, junto al eventual `[categoría sugerida: …]`,
porque marcar una zona requiere su código exacto. Para llevarlas al mapa está el botón `Auto-extraer áreas del texto`: consulta
[Las áreas tratadas](/manuale/body-map).

⚠️ **La dictación es en italiano.** Incluso con la interfaz en inglés, el
reconocimiento y la extracción funcionan en italiano.

## Responsabilidad clínica

El principio no es derogable: **el sistema no escribe nada en la historia clínica sin
una acción explícita del médico.** Todo texto transcrito y cada campo propuesto
requieren una revisión y un gesto afirmativo. La responsabilidad de la
correcta cumplimentación sigue siendo de quien firma la historia clínica.

## Privacidad del flujo de audio

El audio se envía al servicio de transcripción (Mistral, Unión Europea) y
**no se conserva** ni por nosotros ni por ellos más allá del tiempo de procesamiento;
los contenidos enviados mediante API no se utilizan para entrenar modelos.

Si para una visita no quieres usar la dictación, se completa a mano: no queda
ningún rastro de audio en ningún sitio.

## Sugerencias

- **Habla a velocidad natural**, sin marcar: el modelo está ajustado al habla
  espontánea en italiano, y ralentizar empeora el resultado.
- **Nada de comandos de voz** como «punto» o «salto de línea»: la puntuación la añade automáticamente.
- **Los medicamentos completos**, principio activo y dosis: «pantoprazol cuarenta
  miligramos un comprimido por la mañana».
- **Una voz a la vez.** Si el paciente habla al mismo tiempo que tú, la transcripción empeora.
- **Relee siempre los números.** Las dosis y los lotes son exactamente lo que más falla
  en la transcripción, y también lo que más importa.

## Solución de problemas

**No se detecta el micrófono.** Comprueba el permiso en el navegador (en
Chrome, el candado a la izquierda de la dirección, opción `Micrófono`) y los
ajustes del sistema operativo: un micrófono desactivado a nivel de sistema no
es accesible desde el navegador.

**Aparece un error en rojo bajo el botón.** El mensaje indica la causa: casi
siempre es el permiso denegado o el servicio de transcripción no accesible.

**La transcripción llega pero no se proponen campos.** El botón de aplicación solo aparece si la extracción ha reconocido algo. Puedes
usar `Usar texto` y corregir a mano.

**He dictado las áreas y el mapa está vacío.** Es el comportamiento previsto: consulta más arriba, «Qué completa la dictación y qué no».

## Véase también

- [Creación y gestión de la ficha del paciente](/manuale/anagrafica-paziente)
- [Las áreas tratadas: en la foto y en el modelo 3D](/manuale/body-map)
- [Registrar un tratamiento](/manuale/trattamenti)
- [Registro de auditoría y trazabilidad de accesos](/manuale/audit-log)

Última revisión: {ULTIMA_REVISIONE}
