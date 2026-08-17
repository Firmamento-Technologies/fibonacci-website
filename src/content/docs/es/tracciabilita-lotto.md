# Trazabilidad del lote

Esta guía describe cómo registrar el lote de los productos inyectados y cómo responder, en una búsqueda, a la pregunta que realmente importa: **qué pacientes han recibido un lote determinado**. Está dirigida a los médicos y a quienes gestionan el almacén de la consulta.

La pregunta no es teórica. Cuando un fabricante retira un lote o cuando se sospecha una reacción relacionada con un producto específico, la respuesta debe darse en minutos y por escrito.

## Requisitos previos

- Cuenta con rol `médico` o `admin studio`.
- Función `Búsqueda por lote` activa en tu consulta. Si la opción no aparece en el menú, la función no está habilitada: solicítala a asistencia.

## Paso 1, registrar el lote durante la sesión

Al registrar un tratamiento inyectable, además del producto y la cantidad, están disponibles los campos:

- **Número de lote**, tal como aparece impreso en el envase,
- **Fecha de caducidad**,
- **Dilución**, cuando sea pertinente.

El número de lote debe introducirse **tal como aparece impreso**, sin añadir espacios ni guiones por comodidad: es la clave con la que la búsqueda encontrará la sesión.

En estos campos, el sistema **registra**, no calcula: la dilución declarada se escribe tal cual, no se recalcula ni corrige. Y si un dato parece incoherente, el sistema avisa, pero no bloquea el guardado. Es una elección: un software que se niega a registrar lo que se ha hecho produce historias clínicas que no se corresponden con la realidad.

## Paso 2, buscar por lote

La opción `Búsqueda por lote` en el menú principal abre una búsqueda de campo único. Al introducir el número de lote, se obtiene la lista de sesiones en las que se ha utilizado ese lote, con:

- paciente,
- fecha de la sesión,
- cantidad administrada,
- fecha de caducidad registrada.

La búsqueda recorre todos los pacientes de la consulta en una sola consulta. No es necesario saber de antemano en qué pacientes buscar, que es precisamente el objetivo.

## Paso 3, qué hacer con la lista

La lista es el punto de partida de dos actividades diferentes, y conviene mantenerlas separadas:

- **Retirada del fabricante.** La lista identifica a los pacientes que deben ser contactados. El contacto es una comunicación clínica y debe realizarse desde la consulta, no de forma automatizada.
- **Notificación de un evento adverso.** Si se sospecha que el lote está relacionado con una reacción, la notificación debe registrarse en la ficha del paciente, en la sección de resultados y complicaciones, donde existe un campo para el producto y para el lote.

## Errores frecuentes

- **Lote introducido con formatos diferentes en sesiones distintas.** `A1234-B` y `A1234 B` son dos lotes para una búsqueda. Conviene acordar en la consulta una forma única de transcribirlo.
- **Lote dejado en blanco porque «total, siempre es el mismo».** Es el caso en el que la trazabilidad es más necesaria y no existe.
- **Caducidad no registrada.** Sin ella, no es posible distinguir una administración realizada dentro de la validez del producto de una realizada después: es un dato que protege al médico.

## Preguntas frecuentes

**¿Es obligatorio el lote?** El sistema no lo impone. Sin embargo, es el dato que permite responder a una retirada, y su ausencia solo se nota cuando es necesario.

**¿Puedo buscar por producto en lugar de por lote?** La búsqueda es por lote. El producto aparece en la lista de resultados y en la ficha de la sesión.

**¿Los datos del lote aparecen en el expediente de la sesión?** Sí: producto, lote, caducidad, cantidad y dilución aparecen en el expediente, junto con los consentimientos y los accesos.
