# Creación y gestión de ficha del paciente

> ⚠️ **Verificado con la aplicación el 2026-08-10.** Los campos listados aquí son los que existen realmente. Si encuentras uno descrito y no lo ves en pantalla, es un defecto de la guía: repórtalo.

Esta guía describe cómo registrar un nuevo paciente en Fibonacci, cómo buscarlo, modificarlo, archivarlo y cómo exportar sus datos para satisfacer el derecho a la portabilidad previsto en el artículo 20 del GDPR. Está dirigida a médicos y personal de recepción.

La ficha del paciente es la base de cualquier otra funcionalidad clínica: visitas, mapa corporal, consentimientos, agenda y registro de auditoría se vinculan a la ficha anagráfica mediante un identificador único. La correcta cumplimentación inicial evita duplicados, reduce los errores clínicos y garantiza el cumplimiento de las normas sanitarias italianas.

## Requisitos previos

- Cuenta de Fibonacci con rol `médico`, `recepción` o `admin studio`.
- Documento de identidad o código fiscal del paciente para la verificación.
- Dirección de correo electrónico o número de teléfono móvil del paciente para los contactos automáticos y los recordatorios.

## Paso 1, apertura del formulario de nuevo paciente

Desde la barra de navegación principal, sección `Pacientes`, el botón `Nuevo paciente` en la parte superior derecha abre el formulario de registro. El mismo formulario se puede acceder mediante el atajo de teclado **N** disponible en cualquier pantalla.

El formulario está dividido en cuatro pestañas:

- `Anagrafica`, datos identificativos obligatorios.
- `Contatti`, datos de contacto para citas y notificaciones.
- `Clinico`, información sanitaria básica.
- `Foto`, imagen de reconocimiento.

Las pestañas deben cumplimentarse en orden; el botón `Guardar` solo se activa cuando todos los campos obligatorios de la pestaña anagráfica son válidos.

## Paso 2, cumplimentación de los campos obligatorios

Los campos obligatorios son:

- **Nombre** y **Apellidos**, en caracteres latinos sin abreviaturas.
- **Código fiscal** italiano o tipo y número de documento para pacientes extranjeros.
- **Fecha de nacimiento**, formato `dd/mm/aaaa`.
- **Sexo**, valores `M`, `F`, `Otro` o `No especificado`.
- **Contacto principal**, al menos uno entre correo electrónico y número de teléfono.

El código fiscal italiano se valida automáticamente. El sistema calcula el dígito de control, verifica la coherencia con la fecha de nacimiento, sexo y lugar de nacimiento, y señala incongruencias antes del guardado. Para los pacientes sin código fiscal italiano está disponible el campo `Tipo documento`: los valores son los que encuentras en el menú desplegable.

El número de teléfono italiano acepta tanto el formato local `333 1234567` como el formato internacional `+39 333 1234567`. El sistema normaliza siempre al formato internacional para los recordatorios SMS automáticos.

## Paso 3, campos opcionales

Los campos facultativos de la pestaña clínica incluyen:

- **Dirección de residencia** completa.
- **Médico de medicina general**.
- **Alergias conocidas**, campo libre o autocompletado desde terminología SNOMED CT.
- **Grupo sanguíneo**, valores `0`, `A`, `B`, `AB` con `Rh+` o `Rh-`.
- **Notas clínicas generales**, campo libre para información relevante no estructurada.

La cumplimentación de alergias conocidas y grupo sanguíneo es altamente recomendable para los pacientes sometidos a procedimientos invasivos: el sistema muestra un aviso en la parte superior de cada ficha de visita cuando estos campos están vacíos.

## Paso 4, foto de perfil del paciente

La pestaña `Foto` permite cargar una imagen de reconocimiento del paciente, útil para evitar homónimos y para la pre-visita rápida.

El botón `Cargar` acepta archivos JPEG y PNG de hasta cinco megabytes. El botón `Tomar foto` abre la cámara del dispositivo con consentimiento explícito del paciente.

La foto se cifra en reposo con algoritmo AES-256 y solo es accesible para los operadores autorizados a ver la ficha. La cifrado utiliza claves derivadas del tenant de la consulta, separadas de las claves de otras consultas en la misma plataforma.

## Paso 5, guardado y verificación anti-duplicados

Al hacer clic en `Guardar`, el sistema verifica la presencia de pacientes con código fiscal idéntico o con combinación de nombre, apellidos y fecha de nacimiento coincidente.

En caso de posible duplicado, el sistema muestra un panel con el paciente preexistente y tres opciones:

- `Abrir existente`, abandona la creación y abre la ficha ya existente.
- `Unir`, unifica los dos registros tras confirmación explícita del operador.
- `Guardar de todos modos`, crea el nuevo registro marcándolo como posible duplicado para revisar.

La unión queda registrada en el registro de auditoría como operación administrativa.

## Búsqueda del paciente

La barra de búsqueda global en la parte superior derecha realiza una búsqueda incremental por nombre, apellidos, código fiscal y número de teléfono. Los resultados aparecen tras tres caracteres.

Los filtros avanzados están disponibles desde la pantalla `Pacientes > Filtros`:

- rango de fecha de nacimiento,
- creado por operador específico,
- última visita dentro de un rango temporal,
- presencia de alergias conocidas,
- estado de archivado.

Los filtros se combinan y producen una lista ordenable, exportable en CSV.

## Archivado del paciente

Cuando un paciente ya no está en tratamiento, el botón `Archivar` en la ficha del paciente lo marca como archivado. La operación **no elimina los datos**: la historia clínica permanece accesible en solo lectura durante el período de conservación previsto por la normativa sanitaria.

El paciente archivado no aparece en la búsqueda estándar ni en las propuestas de nueva cita. Sin embargo, sigue en el sistema y se puede encontrar mediante la búsqueda.

El archivado es el método conforme al artículo 17 del GDPR (derecho al olvido) en el contexto sanitario, donde el derecho se equilibra con las obligaciones de conservación previstas por el Código de Deontología Médica y la normativa fiscal.

## Eliminación definitiva

La eliminación física de los datos solo está permitida en los casos previstos por la normativa, por ejemplo, para pacientes registrados por error o con consentimiento revocado antes del inicio de la prestación.

La eliminación definitiva no se inicia desde la interfaz: se solicita a asistencia, y es una operación deliberada: es irreversible sobre datos clínicos. Requiere la aprobación de un segundo operador con rol `admin studio`. La eliminación efectiva ocurre tras treinta días de período de reflexión, con aviso previo por correo electrónico al operador solicitante. Todas las fases del procedimiento quedan registradas en el registro de auditoría.

## Entregar al paciente sus datos

El artículo 20 del GDPR garantiza al paciente el derecho a recibir sus datos en un formato estructurado y de uso común.

Desde el botón `Exportar datos` en la ficha del paciente se genera un archivo ZIP que contiene:

- archivo `Patient.json` con la anagrafía completa, en un formato estándar que cualquier otra historia clínica puede leer,
- archivo `Observation.json` con observaciones y parámetros registrados,
- archivo `Condition.json` con anamnesis y patologías,
- archivo `MedicationStatement.json` con los medicamentos registrados,
- archivo `Procedure.json` con los procedimientos realizados,
- carpeta `consents/` con los PDF de los consentimientos firmados,
- carpeta `attachments/` con fotos y informes.

El archivo está firmado digitalmente para garantizar su integridad y está disponible para descarga durante siete días. El enlace de descarga se envía por correo electrónico al paciente con un segundo factor de acceso vía SMS.

## Sugerencias

- Atajo de teclado **N** en cualquier lugar para nuevo paciente, **F** para abrir la búsqueda rápida, **Esc** para cerrar las modales.
- Importación masiva desde CSV disponible en `Ajustes de la consulta`: la plantilla incluye una fila por paciente con encabezados estándar. La importación es en dos fases: vista previa con validación, luego confirmación.
- Para pacientes menores, el contacto del padre o tutor se registra en los contactos: los consentimientos y los recibos hacen referencia al tutor.
- Para pacientes extranjeros sin código fiscal italiano, se recomienda solicitar copia del documento y registrar su número en el campo `Tipo documento > Número`.

## Solución de problemas

**Código fiscal rechazado como no válido.** Verifica que los dieciséis caracteres coincidan con el documento oficial. Un error al teclear la letra de control final es el error más frecuente. Alternativamente, usa la función `Calcular código fiscal` desde la pestaña anagrafía.

**Correo electrónico ya utilizado por otro paciente.** La misma dirección de correo electrónico solo puede asociarse a un paciente por consulta. Para núcleos familiares que comparten un correo, registra la dirección solo en el referente y deja vacío el campo de correo en los demás miembros, usando el teléfono como contacto principal.

**Posible duplicado señalado pero el paciente es nuevo.** Verifica nombre, apellidos y fecha de nacimiento: pacientes con nombres comunes y fechas cercanas pueden activar el falso positivo. Usa `Guardar de todos modos`; el registro se marca para revisión posterior.

**Foto no se carga.** El límite es cinco megabytes y los formatos admitidos son JPEG y PNG. Los archivos HEIC de iPhone deben convertirse: la mayoría de los navegadores móviles lo hacen automáticamente al cargar, algunos modelos requieren desactivar la opción `Alta eficiencia` en los ajustes de la cámara.

## Véase también

- [Primer acceso y configuración inicial](/manuale/installazione)
- [Cumplimentar la anamnesis con dictado por IA](/manuale/anamnesi-dettatura)
- [Registro de auditoría y trazabilidad de accesos](/manuale/audit-log)

Última revisión: {ULTIMA_REVISIONE}
