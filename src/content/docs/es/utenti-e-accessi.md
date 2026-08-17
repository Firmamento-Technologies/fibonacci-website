# Usuarios de la consulta y revocación de accesos

Esta guía describe cómo invitar a un colaborador, qué puede hacer y, sobre todo, **cómo revocarle el acceso cuando se va**. Está dirigida a quien administra la consulta.

La última operación es la que siempre se pospone y la que más importa: un colaborador que se va y conserva las credenciales sigue pudiendo abrir historias clínicas, y ningún registro lo señala como anomalía porque formalmente sigue autorizado.

## Requisitos previos

- Cuenta con rol `admin studio`.
- Para la invitación: configuración del correo en el servidor. Sin ella, la cuenta del invitado se crea, pero **no recibe el mensaje con el enlace para establecer la contraseña**, y la solicitud aparece como exitosa de todos modos. Si un invitado dice que no ha recibido nada, es lo primero que hay que verificar.

## Paso 1, invitar a un colaborador

En `Ajustes`, la sección `Miembros de la consulta` lista quién tiene acceso. El botón `Invitar usuario` solicita nombre, apellidos, dirección de correo electrónico, rol y política de acceso.

Cada invitado recibe la **autenticación de doble factor obligatoria**: en el primer acceso se le pide configurarla. No es desactivable, y la razón es que estas cuentas acceden a datos relacionados con la salud.

La política de acceso decide qué ve: la política para médico limita la visibilidad a sus propios pacientes; las políticas de consulta amplían la visibilidad a todos los pacientes de la consulta. La elección debe hacerse de manera consciente, porque es la diferencia entre un colega que ve a sus pacientes y uno que los ve a todos.

## Paso 2, revocar el acceso a quien se va

En la misma tabla, la columna `Acceso` muestra el botón `Revocar el acceso`.

Antes de confirmar, la ventana indica exactamente qué ocurre, y conviene leerlo:

- **el acceso cesa de inmediato**, incluidas las sesiones ya abiertas: quien estuviera trabajando en ese momento será desconectado en la siguiente operación,
- **los datos clínicos permanecen**. Visitas, consentimientos y firmas siguen atribuidos a ese médico. No es un detalle técnico: un informe no puede cambiar de autor porque quien lo escribió haya cambiado de consulta,
- **no es reversible desde la interfaz**: para readmitir a alguien hay que invitarlo de nuevo.

La operación queda registrada en el registro de accesos: quién la ejecutó, sobre quién y cuándo.

### Por qué no existe una «suspensión temporal»

Es la pregunta que se hace quien busca el botón y no lo encuentra. La respuesta es que en este sistema el campo que parecería útil, «usuario no activo», **no impide el acceso**: es descriptivo. Un botón «suspender» basado en ese campo le diría al administrador que ha revocado el acceso sin haberlo hecho, y es peor que la ausencia del botón.

Si la ausencia es temporal y se quiere cerrar la puerta de todos modos, la solución es revocar el acceso e invitar de nuevo al regreso.

## Paso 3, los casos en los que el botón no aparece

En lugar del botón aparece un guion, y al pasar el cursor se lee el motivo:

- **la propia cuenta**: nadie se revoca el acceso a sí mismo. Si fuera un error, no quedaría nadie para solucionarlo desde la interfaz,
- **el último administrador**: revocarlo dejaría a la consulta fuera de su propio proyecto,
- **las identidades de servicio** (integraciones y automatizaciones): se desactivan donde están configuradas, no desde la pantalla de colegas.

## Errores frecuentes

- **Posponer la revocación a «cuando haya tiempo»**. Es la única operación de esta guía que tiene una ventana de riesgo: el peligro existe entre la salida y la revocación.
- **Invitar con una política de consulta «por comodidad»**. Amplía la visibilidad a todos los pacientes, y no se puede deshacer por sí solo.
- **Dar por exitosa una invitación sin confirmación del invitado**. Si el correo no está configurado, la solicitud se completa y el mensaje no se envía.

## Preguntas frecuentes

**¿Qué pasa con las historias clínicas que tenía a cargo?** Permanecen donde están. Cambia quién puede abrirlas, no a quién están atribuidas.

**¿Puedo ver quién revocó el acceso a quién?** Sí, en el registro de accesos: la operación se registra como evento de seguridad, distinto a una eliminación clínica.

**¿Un colaborador revocado puede seguir usando una app abierta?** No. La sesión activa deja de funcionar en la siguiente operación: la revocación no espera a que caduque el token.
