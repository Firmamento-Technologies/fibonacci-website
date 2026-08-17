# Agenda y gestión de citas

> ⚠️ **Verificado frente a la aplicación el 2026-08-10.** Los elementos listados aquí son los que existen realmente. Si encuentras uno descrito y no lo ves en pantalla, es un defecto de la guía: comunícalo.

Esta guía describe cómo utilizar la agenda integrada de Fibonacci para planificar visitas, gestionar un calendario compartido multioperador, enviar recordatorios SMS automáticos a los pacientes, exportar y sincronizar las citas con calendarios externos. Está dirigida a médicos y al personal de recepción.

La agenda está diseñada para consultas de pequeño y mediano tamaño, de uno a veinte operadores. La vista predeterminada es semanal para favorecer la planificación operativa diaria, pero están disponibles vistas diaria y mensual para diferentes necesidades.

## Requisitos previos

- Cuenta con rol `médico`, `recepción` o `admin studio`.
- Ficha del paciente existente para la creación de la cita; alternativamente, el paciente puede crearse sobre la marcha desde la modal de cita.
- Para los recordatorios SMS automáticos: plan suscrito que incluya el módulo `Comunicaciones`, o activación opcional por consumo. El proveedor es Brevo o MessageBird según la configuración del tenant.
- Número de móvil del paciente en formato `+39 333 1234567` para el correcto envío de los recordatorios.

## Paso 1, acceso a la agenda

Desde la barra de navegación principal, el icono de calendario abre la sección `Citas`. La pantalla muestra:

- arriba a la izquierda el selector de vista: `Diaria`, `Semana`, `Mes`,
- arriba a la derecha el selector de operador con filtro `Todos`, `Solo yo`, `Multioperador`,
- en el centro la cuadrícula horaria con las citas dispuestas como bloques de colores,
- en la barra lateral derecha el panel de detalles de la cita seleccionada.

La vista semanal es la predeterminada y muestra cinco o siete días según las preferencias: `Ajustes > Citas > Días visibles`.

## Paso 2, creación de una nueva cita

Clic izquierdo en un hueco horario libre abre la modal `Nueva cita`. Los campos son:

- **Paciente**, cuadro combinado con autocompletar sobre la ficha existente. El botón `+` adyacente abre la creación rápida de paciente.
- **Operador**, selección entre los operadores activos de la consulta. Predeterminado: usuario actual si tiene rol médico, de lo contrario el primer operador disponible.
- **Motivo** o **Tipo de visita**, selección desde catálogo configurable por la consulta: las opciones disponibles son las que encuentras en el menú, no una lista fija.
- **Duración**, valor en minutos con predeterminado treinta, opciones rápidas quince, treinta, cuarenta y cinco, sesenta, noventa.
- **Estado**, modificable posteriormente desde la ficha de la cita.
- **Notas**, campo libre para anotaciones del operador no visibles para el paciente.
- **Notas para el paciente**, campo libre incluido en los recordatorios automáticos.

El botón `Guardar` registra la cita. El hueco horario aparece inmediatamente en la cuadrícula con el color asociado al operador o al tipo de visita según la preferencia configurada.

## Paso 3, gestión de conflictos de calendario

El sistema verifica en tiempo real la presencia de solapamientos con citas existentes para el mismo operador. En caso de conflicto, la modal muestra un aviso amarillo con el detalle de la cita en conflicto y tres opciones:

- `Modificar horario`, vuelve a la cumplimentación,
- `Asignar a otro operador`, cambia de operador manteniendo el horario,
- `Guardar de todos modos`, registra el solapamiento y lo marca con icono de aviso en la cuadrícula.

El solapamiento `Guardar de todos modos` es útil en casos específicos, por ejemplo, doble cita para acompañante y paciente, pero en general se desaconseja.

## Paso 4, gestión de los estados de la cita

Cada cita tiene un estado actual, representado gráficamente por color e icono:

- **Programada**, estado inicial, azul claro.
- **Confirmada**, el paciente ha confirmado tras el recordatorio, azul intenso.
- **Check-in**, paciente llegado a la consulta, verde claro.
- **En curso**, visita iniciada, verde intenso.
- **Completada**, visita finalizada, gris.
- **No-show**, paciente no presentado, naranja.
- **Anulada**, cita anulada antes del inicio, rojo claro.

El cambio de estado se realiza haciendo clic en la cita y seleccionando el nuevo estado desde la barra lateral derecha. El sistema registra la marca de tiempo de cada cambio en el audit log.

El estado `Check-in` puede activarse automáticamente desde un posible quiosco de recepción en la consulta (módulo opcional). El estado `En curso` puede activarse automáticamente al abrir la ficha de visita del paciente.

## Paso 5, recordatorios SMS automáticos

Los recordatorios SMS se envían automáticamente al número de móvil del paciente registrado en la ficha. El mensaje estándar sigue el formato:

`Estimado/a [nombre], le recordamos su cita el [fecha hora] en [nombre consulta]. Para confirmar responda 1, para anular 2. [enlace]`

La configuración de los recordatorios está en `Ajustes > Comunicaciones > Recordatorios`:

- **T-24h**, recordatorio veinticuatro horas antes de la cita, predeterminado activo.
- **T-2h**, recordatorio dos horas antes, predeterminado inactivo, activable.
- **T-7d**, recordatorio siete días antes para citas a largo plazo, predeterminado inactivo.

El proveedor SMS en uso es visible en los ajustes: Brevo para los planes estándar, MessageBird para los planes internacionales. El coste por SMS depende del plan suscrito.

Los recordatorios requieren:

- número de móvil en formato internacional `+39` para los números italianos,
- casilla `Consentimiento comunicaciones` activa en la ficha del paciente,
- saldo SMS suficiente en el plan.

La respuesta del paciente a los recordatorios (`1` para confirmar, `2` para anular) actualiza automáticamente el estado de la cita y notifica al operador.

## Paso 6, vista multioperador

Para consultas con varios médicos u operadores simultáneos, la vista multioperador muestra:

- columna vertical para cada operador seleccionado,
- encabezado con nombre y especialidad,
- codificación de color distinta para cada operador,
- fila de horas común.

El selector en la parte superior derecha permite elegir qué operadores visualizar. La preferencia se guarda por usuario.

El filtro `Solo yo` reduce la vista al calendario personal, útil para la planificación individual del médico. El filtro `Multioperador` agrega los operadores configurados en el grupo de trabajo principal.

## Paso 7, arrastrar y soltar y modificaciones rápidas

La agenda admite interacciones directas para modificaciones rápidas:

- **Arrastrar** una cita a otro hueco horario, cambia la fecha u hora manteniendo la duración y los detalles,
- **Arrastrar** el borde inferior de una cita, modifica la duración,
- **Doble clic** en una cita, abre el panel detallado con todos los campos,
- **Clic derecho** en una cita, abre el menú rápido con `Modificar`, `Anular`, `Duplicar`, `Mover`, `Marcar check-in`,
- **Clic derecho** en un hueco libre, abre el menú rápido para crear la cita en ese hueco.

Las modificaciones por arrastrar y soltar generan automáticamente, si la cita ya estaba confirmada, una notificación al paciente con el nuevo horario.

## Paso 8, exportación y sincronización iCal

El botón `Exportar` abre dos opciones:

- **Exportar PDF semanal**, genera un PDF con la cuadrícula semanal imprimible, útil para archivado en papel o entrega al titular.
- **Exportar iCal**, descarga un archivo `.ics` con todas las citas del rango seleccionado.

La sincronización automática con calendarios externos está disponible en `Ajustes > Integraciones > Calendarios`. El sistema admite:

- Google Calendar mediante OAuth,
- Microsoft Outlook mediante OAuth,
- cualquier calendario que admita URL iCal en solo lectura.

La sincronización es bidireccional para Google y Microsoft (crear un evento en el calendario externo crea la cita en Fibonacci y viceversa) y unidireccional para otros calendarios (solo lectura desde Fibonacci).

Por privacidad, las citas sincronizadas externamente muestran solo título genérico (`Visita médica`) y hora, sin datos del paciente.

## Sugerencias

- Configura los tipos de visita recurrentes de la consulta en `Ajustes > Citas > Tipos de visita` con duración y color predeterminados: la creación de nuevas citas será más rápida.
- Para consultas con horarios recurrentes, bloquea los huecos de pausa para comer y reuniones mediante `Bloquear hueco` repetido: no se podrán crear citas en esos huecos.
- Establece los recordatorios T-24h como predeterminados y activa el T-2h solo para citas complejas o primera visita: reduce la sobrecarga de notificaciones.
- Para citas de telemedicina, el sistema genera automáticamente el enlace de videollamada en la confirmación y en el recordatorio si el módulo de telemedicina está activo.
- Doble clic en un día de la vista mensual abre la vista diaria detallada de esa fecha.

## Solución de problemas

**Recordatorios SMS no recibidos por el paciente.** Verifica en este orden: número de móvil en formato internacional `+39 333 1234567`; casilla `Consentimiento comunicaciones` activa en la ficha del paciente; saldo SMS suficiente en el panel `ajustes de comunicaciones`; historial de envío de la cita individual en el panel `Comunicaciones > Historial` que muestra posibles errores del proveedor.

**Cita solapada creada por error.** Abre la cita y usa `Modificar horario` para moverla, o `Asignar a otro operador` para redistribuir la carga. En cualquier caso, el sistema notifica a los pacientes ya avisados con el nuevo horario o cambio de operador.

**Sincronización con Google Calendar interrumpida.** A menudo causada por caducidad del token OAuth tras períodos prolongados de inutilización. Abre `Ajustes > Integraciones > Google Calendar` y repite la autorización. Las citas ya sincronizadas permanecen intactas.

**Arrastrar y soltar no funciona en tablet o pantalla táctil.** En algunos dispositivos móviles, el modo arrastrar requiere una pulsación prolongada (long press) antes de empezar a mover. Alternativamente, usa el panel lateral `Modificar` para cambiar fecha y hora con teclado virtual.

**Estado `No-show` no actualizado automáticamente.** El estado permanece como inicial o `Confirmada` si no se marca manualmente. Configura en `Ajustes > Citas > Auto no-show` el tiempo de espera tras el cual una cita no iniciada se marca automáticamente como `No-show`: predeterminado desactivado, valor recomendado sesenta minutos.

## Véase también

- [Creación y gestión de ficha de paciente](/manuale/anagrafica-paziente)
- [Primer acceso y configuración inicial](/manuale/installazione)
- [Audit log y trazabilidad de accesos](/manuale/audit-log)

Última revisión: {ULTIMA_REVISIONE}
