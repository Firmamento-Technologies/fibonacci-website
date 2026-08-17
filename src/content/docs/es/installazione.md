# Primer acceso y configuración inicial

Esta guía describe las operaciones necesarias para comenzar a utilizar Fibonacci desde el primer acceso hasta la configuración completa de la consulta. Está dirigida al médico titular o al referente administrativo de la consulta que recibe en primer lugar el correo de invitación.

Al finalizar el procedimiento, la consulta dispondrá de una cuenta administrativa protegida por autenticación de doble factor, de un perfil de consulta completo y de los primeros operadores invitados. El tiempo medio requerido es de unos quince minutos.

## Requisitos previos

- Correo de invitación recibido en la dirección comunicada durante la fase de onboarding comercial.
- Navegador compatible actualizado: Chrome, Edge, Safari o Firefox en versión reciente.
- Smartphone con una aplicación **authenticator** instalada: `Google Authenticator`, `Authy`, `1Password` o `Microsoft Authenticator`.
- Archivo del logo de la consulta en formato PNG, tamaño recomendado 512 x 512 píxeles, fondo transparente.
- Datos fiscales de la consulta: razón social, número de IVA, dirección de la sede, datos de contacto públicos.

## Paso 1, acceso mediante enlace de invitación

El correo de invitación llega desde una dirección de sistema, con asunto `Invito a Fibonacci`. Contiene un enlace único válido durante cuarenta y ocho horas.

Abre el enlace en una nueva pestaña del navegador. Si el enlace ha caducado, solicita una nueva invitación a través de {EMAIL_SUPPORTO}.

La primera pantalla solicita confirmar la dirección de correo electrónico y establecer una contraseña personal. La contraseña debe cumplir los siguientes requisitos mínimos:

- al menos doce caracteres,
- al menos una letra mayúscula y una minúscula,
- al menos un número,
- al menos un carácter especial entre `! @ # $ % & * ?`.

Las contraseñas se comparan con listas públicas de credenciales comprometidas. Una contraseña débil o reutilizada será rechazada con un mensaje explícito.

## Paso 2, activación MFA TOTP

MFA, es decir, **Multi-Factor Authentication**, es la autenticación de doble factor: además de la contraseña, se solicita un código temporal generado por la app authenticator en el smartphone. La activación es obligatoria para todas las cuentas que acceden a datos sanitarios.

El asistente muestra un código QR. Abre la app authenticator en el smartphone, selecciona `Añadir cuenta` o equivalente, escanea el código QR. La app añade una nueva entrada denominada `Fibonacci - email@ejemplo.it` y comienza a mostrar un código numérico de seis dígitos renovado cada treinta segundos.

Introduce el código actual en el campo de verificación y confirma. La validación es inmediata: si el código es correcto, la app recibe confirmación de activación MFA.

## Paso 3, códigos de recuperación

Inmediatamente después de activar la MFA, Fibonacci genera diez **códigos de recuperación** de un solo uso. Cada código puede utilizarse una sola vez en lugar del código TOTP en caso de pérdida del smartphone.

Imprime la página o descarga el archivo PDF mostrado. Guarda los códigos en un lugar físico seguro, separado del smartphone. No los guardes en el mismo dispositivo que genera los códigos TOTP.

Cuando se utiliza un código de recuperación, este queda consumido. Cuando quedan menos de tres códigos sin usar, la aplicación muestra un aviso para generar nuevos.

## Paso 4, perfil de la consulta

Tras el primer acceso completo, la aplicación abre la pantalla `Ajustes > Organización`. Los campos obligatorios son:

- **Razón social**, denominación legal de la consulta o nombre y apellidos del profesional.
- **Número de IVA** italiano, once dígitos, validado automáticamente en el formato.
- **Código fiscal** de la consulta o del titular.
- **Dirección de la sede**: calle, número, código postal, ciudad, provincia.
- **Datos de contacto públicos**: teléfono de la consulta, correo electrónico público, sitio web opcional.

Los campos opcionales incluyen el número de inscripción en el Ordine dei Medici, la especialización principal y el horario de apertura.

El logo de la consulta se carga con el botón `Carica logo`. El sistema acepta PNG y JPEG de hasta dos megabytes y redimensiona automáticamente la imagen a 512 x 512 píxeles manteniendo las proporciones. El logo aparece en los recibos, en los consentimientos y en los mensajes al paciente.

## Paso 5, invitación de los operadores

Desde el panel `Ajustes > Usuarios`, el botón `Invitar usuario` abre una ventana emergente con los siguientes campos:

- nombre y apellidos del operador,
- correo electrónico corporativo,
- rol,
- especialidad opcional.

Los roles disponibles son:

- **Administración**, acceso completo a todas las áreas, incluidas las configuraciones y el registro de accesos.
- **Médico**, acceso clínico a los pacientes asignados o a toda la consulta según la configuración, acceso completo a historias clínicas, visitas, dictado y consentimientos.
- **Recepción con IA**, acceso a la agenda y a la ficha del paciente, acceso de solo lectura a la parte clínica, sin acceso al registro de accesos.

Cada operador invitado recibe su propio correo de invitación con el mismo procedimiento descrito en los pasos del uno al tres. En el primer acceso, el operador configura su propia contraseña personal y su propio MFA.

El número máximo de operadores depende del plan contratado. El panel muestra el consumo actual y el límite del plan.

## Sugerencias

- Crea desde el principio una cuenta administrativa dedicada, separada de la cuenta médica clínica, para las operaciones de gestión exclusiva.
- Imprime los códigos de recuperación en dos copias y guarda una fuera de la consulta.
- Configura el logo antes de empezar a generar consentimientos: los PDF ya generados no se actualizan retroactivamente.
- Verifica los datos fiscales con el gestor antes de guardarlos: aparecen en recibos y facturas.

## Solución de problemas

**El código TOTP no es válido.** Verifica que la hora del smartphone esté sincronizada automáticamente con la red. Una desviación temporal superior a treinta segundos invalida los códigos TOTP. En iOS, `Ajustes > General > Fecha y hora > Automática`. En Android, `Ajustes > Sistema > Fecha y hora > Automática`.

**El enlace de invitación ha caducado.** Los enlaces son válidos durante cuarenta y ocho horas. Solicita una nueva invitación a través de {EMAIL_SUPPORTO}, indicando el correo electrónico destinatario.

**Códigos de recuperación perdidos y smartphone no disponible.** Ponte en contacto con el soporte. El procedimiento incluye la verificación de la identidad del titular de la consulta mediante documento de identidad y el posterior restablecimiento de la MFA. El restablecimiento puede tardar hasta veinticuatro horas laborables.

**Error durante la carga del logo.** Verifica que el archivo esté en formato PNG o JPEG y no supere los dos megabytes. A veces se rechazan archivos con perfil de color CMYK o transparencias complejas: guarda el archivo en PNG sRGB y vuelve a cargarlo.

## Véase también

- [Creación y gestión de ficha del paciente](/manuale/anagrafica-paziente)
- [Agenda y gestión de citas](/manuale/agenda-appuntamenti)
- [Registro de accesos y trazabilidad](/manuale/audit-log)

Última revisión: {ULTIMA_REVISIONE}
