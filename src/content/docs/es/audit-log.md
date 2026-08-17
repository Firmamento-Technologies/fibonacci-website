# Registro de accesos: quién hizo qué, y cuándo

Cada operación sobre los datos de los pacientes deja un rastro: quién la realizó, cuándo, en
qué ficha. El **`Registro de accesos`** es donde se leen esos rastros.

Sirve para tres cosas concretas: responder a un paciente que pregunta quién ha visto su
historia clínica, reconstruir qué ocurrió cuando algo no cuadra, y demostrar en una inspección
que la consulta lleva un registro de lo que hace.

## Quién puede abrirlo

Solo quien tiene el rol de administrador de la consulta. Si la opción **`Registro de accesos`** no
aparece en la navegación, tu usuario no tiene ese permiso: lo concede el administrador
desde los `Ajustes`.

## Qué se ve

Una tabla, con la fila más reciente arriba. Para cada una:

- **cuándo** ocurrió;
- **quién** lo hizo: el nombre del profesional, o *Sistema* para las operaciones
  automáticas;
- **qué** se hizo: creación, lectura, actualización, eliminación;
- **sobre qué**: la ficha o el documento afectado;
- **cómo terminó**: éxito, aviso, error.

## Los filtros

Encima de la tabla se acota la búsqueda.

- **Actividad clínica** o **actividad de sistema**. La primera es lo que hacen las
  personas en las historias clínicas; la segunda es lo que hace el programa por sí solo:
  importaciones, procesos automáticos. Separarlas es útil, porque las segundas son muchas y
  taparían a las primeras.
- **La acción**: solo las lecturas, solo las modificaciones, solo las eliminaciones.
- **El resultado**: solo los avisos, solo los errores.

## Responder a quien pregunta quién ha visto su historia clínica

Es el caso más frecuente, y es un derecho del paciente: la ley da **quince días**
para responder.

1. Filtra por ese paciente.
2. Elige el intervalo de fechas.
3. Pulsa **`Exportar`**.

Se obtiene un archivo CSV (se abre con cualquier hoja de cálculo) con exactamente las
filas que ves en pantalla. Es el formato en el que se entrega la respuesta.

## La integridad: por qué el registro no se corrige

El registro está diseñado para que una fila, una vez escrita, **no se pueda
modificar ni eliminar**, y para que cualquier manipulación sea detectable: cada fila está
vinculada a la anterior, por lo que alterar una haría evidente la modificación en todas
las siguientes.

⚠️ **Esta verificación no tiene un botón en la interfaz.** Es un control que se ejecuta
en el servidor, y el resultado se solicita al soporte. Si resultara alterado no sería un
incidente ordinario: es un incidente de seguridad, y debe comunicarse de inmediato.

## Durante cuánto tiempo se conservan los rastros

Tanto como la documentación clínica a la que se refieren. Permanecen **incluso después**
de que un paciente haya sido eliminado: sin su nombre, pero con el rastro de que la
operación ocurrió. Es intencional: un registro que desaparece junto con los datos ya no
demostraría nada.

## Qué NO hay en esta página

Dicho para que no busques lo que no existe:

- **ninguna exportación en PDF firmado**: la exportación es en CSV;
- **ningún botón de verificación de integridad** (ver arriba: se hace en el servidor);
- **ninguna línea de tiempo gráfica** de las operaciones sobre un paciente;
- **ningún filtro guardable en favoritos**, ni búsqueda por dirección de red.
