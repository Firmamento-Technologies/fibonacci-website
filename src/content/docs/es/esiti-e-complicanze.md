# Resultados, complicaciones y emergencias

Esta guía cubre las tres cosas que ocurren **después** de una sesión cuando algo no sale como se esperaba: el modo `Emergencia`, el registro de una complicación y la ficha de notificación al Ministerio.

⛔ **Ninguna de estas pantallas ofrece indicaciones clínicas.** No proponen fármacos, dosis ni vías de administración, no formulan una sospecha diagnóstica, no juzgan la gravedad ni comparan el tiempo con ningún umbral. Es una elección declarada en el uso previsto del producto, no una función faltante: en una emergencia, cualquier sugerencia convertiría este software en un dispositivo médico, y lo que realmente falta en ese momento no es un consejo, sino el informe que nadie escribe porque tiene las manos ocupadas.

## Antes: preparar la consulta

Dos campos en `Ajustes`, sección de la consulta, que deben completarse **antes** de que sean necesarios:

- **`Protocolo de complicaciones (para el modo Emergencia)`**: el protocolo de la consulta, un paso por línea. Es **tu** texto: se muestra tal como está escrito, no se completa ni corrige. Sin él, el modo Emergencia registra el tiempo y las notas, pero no muestra ningún contenido clínico.
- **`Fármaco de emergencia: caducidad`**: mes y año. El momento útil para darse cuenta de que ha caducado no es cuando se necesita. No se pregunta cuál es el fármaco: eso lo decide la consulta.

## El modo Emergencia

Se abre **desde la fila de la sesión**, en la pestaña `Tratamientos` del paciente: es el punto en el que la paciente ya está delante, y buscar una opción de menú en ese momento es tiempo perdido. No aparece sola ni es una alarma: se pulsa.

La pantalla ocupa toda la pantalla, sin navegación, y contiene tres cosas:

1. **`Tiempo transcurrido desde la apertura`**: un cronómetro que avanza. No cambia de color, no cuenta hacia atrás, no suena, no avisa.
2. **El protocolo de la consulta**, un paso por línea, para marcar mientras se ejecuta.
3. **`Qué registrar en la historia clínica`**: un campo libre para lo que quieras que quede registrado.

Si la caducidad del fármaco de emergencia registrada en los ajustes ha pasado, la página lo indica: `La caducidad registrada en los ajustes de la consulta ha pasado`.

⚠️ **La red puede fallar, el informe no.** El instante de inicio y los pasos marcados se guardan en el navegador **antes** de cualquier llamada al servidor: recargar la página o perder la conexión no reinicia el cronómetro ni pierde el informe. El guardado en la historia clínica se realiza al cerrar, y si falla, el informe sigue siendo descargable.

Al cerrar, se elige la `Gravedad`, y el informe registra **las horas en las que marcaste cada paso**, no horas reconstruidas después.

`Salir sin cerrar` deja la sesión abierta: el cronómetro continúa.

## Registrar una complicación

Desde la misma fila de la sesión, la acción `Registrar una complicación en esta sesión`. La complicación queda **vinculada a ese tratamiento**, con su producto y su lote: es el motivo por el que se registra desde ahí y no desde una lista aparte.

El formulario solicita:

- **la complicación**, de una lista cerrada de doce opciones: equimosis, edema, eritema persistente, nódulo, granuloma, infección, necrosis cutánea, oclusión vascular, ptosis palpebral, asimetría, reacción alérgica y `Otro (descrito en las notas)`;
- **`Cuándo la observaste`**. La fecha **no** se autocompleta con la de hoy: una complicación suele verse días después, y un campo ya completado es un campo que nadie corrige;
- **`Gravedad`**: leve, moderada o grave. La elige el médico: no existe ninguna advertencia que indique «esta complicación es grave»;
- **`Qué observaste`** y **`Qué hiciste`** (por ejemplo, hialuronidasa, compresas, antibiótico);
- **`Resultado (si ya se conoce)`**, que puede dejarse en `Aún no se conoce`.

Las complicaciones registradas aparecen **dentro de la ficha de la sesión**, destacadas: para saber cómo fue no hay que mirar en dos sitios.

⚠️ **Una sesión marcada como introducida por error no acepta complicaciones.**

## La ficha de notificación al Ministerio

Junto a cada complicación registrada aparece el enlace **`Ficha de notificación`**, que prepara el texto para copiar en el formulario ministerial.

Por qué existe y con qué términos:

- el **D.M. Salud 1 de julio de 2025**, en vigor desde el 18 de marzo de 2026, aplica el art. 10 del D.Lgs. 137/2022 y cubre expresamente también los dispositivos del anexo XVI del Reglamento UE 2017/745, es decir, los **rellenos dérmicos**;
- el incidente **grave, aunque solo sea sospechoso**, debe notificarse *«con prontitud y, en cualquier caso, no más tarde de diez días»* (art. 4 c. 1); el incidente no grave **puede** notificarse en un plazo de treinta días (art. 4 c. 3);
- la obligación es **del profesional sanitario**, y la omisión de la notificación se sanciona con una multa de 26.000 a 120.000 euros.

Al registrar una complicación, el sistema abre un **recordatorio** con la fecha límite calculada según esos plazos, que encontrarás en `Recordatorios`.

Tres cosas que esta función **no** hace, y conviene saberlo antes:

- ⛔ **No transmite nada.** El canal es el formulario en línea del Ministerio, con autenticación del médico (SPID, CIE o CNS). Aquí se prepara el contenido.
- ⛔ **No decide si el incidente es grave**: lee la gravedad que has registrado tú y, a partir de ella, calcula el plazo.
- ⛔ **No incluye los datos de la paciente**, y no es un olvido: el art. 2 c. 6 del decreto establece que la notificación *«no contendrá datos que permitan la identificación del sujeto afectado»*. Autocompletar desde la historia clínica, que sería lo más obvio, haría cometer la infracción precisamente con la herramienta que debería ayudar. El formulario recibe el evento y el producto, nunca el paciente.

⚠️ **El registro de una complicación no es una notificación de farmacovigilancia**, y el formulario lo indica: son dos canales distintos, con destinatarios diferentes.

## Errores frecuentes

- **Abrir la Emergencia y no cerrarla.** El informe se escribe en la historia clínica al cerrar: una sesión dejada abierta sigue siendo un cronómetro en marcha.
- **El protocolo nunca cargado.** Sin él, en emergencia la pantalla es un cronómetro y un campo de notas. Se completa una vez, en `Ajustes`.
- **Registrar la complicación en cualquier sesión.** Debe ir en la sesión que la causó: es ese vínculo el que lleva consigo el producto y el lote cuando son necesarios.

## Véase también

- [Registrar un tratamiento](/manuale/trattamenti)
- [Trazabilidad del lote](/manuale/tracciabilita-lotto)
- [Recordatorios y avisos](/manuale/promemoria-e-richiami)
