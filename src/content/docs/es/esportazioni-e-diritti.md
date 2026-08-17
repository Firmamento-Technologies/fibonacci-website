# Exportaciones y derechos del paciente

Esta guía describe cómo entregar a un paciente sus datos y cómo responder a las solicitudes derivadas del GDPR. Está dirigida a los médicos y a quienes administran la consulta.

El responsable del tratamiento es **la consulta**: las solicitudes de los pacientes llegan al médico, no a nosotros. Esta guía explica qué herramientas pone el sistema a disposición para responder.

## Las solicitudes que pueden llegar

| Solicitud | Referencia | Qué se necesita |
|---|---|---|
| «Quiero una copia de mis datos» | art. 15 (acceso) | exportación de la ficha |
| «Quiero mis datos en un formato que pueda llevar a otro sitio» | art. 20 (portabilidad) | exportación estructurada |
| «Corrijan este dato» | art. 16 (rectificación) | modificación en la historia clínica, con histórico |
| «Eliminen mis datos» | art. 17 (supresión) | ⚠️ ver más abajo: no es automática |
| «Revoco el consentimiento» | L. 219/2017 art. 1 c. 5 | ⛔ **no es esta guía** → [Consentimientos informados](/manuale/consensi-informati) |

⚠️ **«Revocación» significa dos cosas distintas, y confundirlas lleva a cometer errores.**
Revocar el **consentimiento a una prestación** (el documento que el paciente firmó antes del
tratamiento) se hace desde la guía [Consentimientos informados](/manuale/consensi-informati), y la
consecuencia es clínica: interrupción del tratamiento. **No es** una solicitud de eliminación de
datos, y de hecho el PDF revocado **permanece archivado**: sirve para demostrar que el consentimiento
existía cuando se realizó la prestación. Las solicitudes de la tabla anterior se refieren, en cambio,
a los datos, y para la documentación clínica rigen los límites del art. 17 explicados más abajo.

## Paso 1, exportar la ficha de un paciente

Desde la ficha del paciente, el botón de exportación genera un documento con datos personales, anamnesis, tratamientos, prescripciones, pruebas, consentimientos e historial de accesos.

Las **fotografías** no están incluidas en ese documento: están cifradas y su apertura es un acceso registrado por separado. Se exportan de forma independiente y se **descifran en el momento de la entrega**, de modo que el paciente reciba imágenes que pueda abrir: un archivo cifrado que no se puede leer no satisface el derecho a la portabilidad.

## Paso 2, la solicitud de eliminación

⚠️ **La eliminación no es automática, ni debe serlo.** El derecho al olvido del art. 17 tiene excepciones, y una de ellas se aplica exactamente a este caso: el apartado 3 letra b) excluye la eliminación cuando el tratamiento es necesario para cumplir una obligación legal, y la letra c) cuando es necesario para fines de medicina preventiva, diagnóstico y tratamiento.

En la práctica: la documentación clínica debe conservarse durante el tiempo en que el médico pueda ser llamado a responder por su actuación. Eliminarla a petición significaría privarse de la prueba con la que defenderse, y no es una obligación que imponga el GDPR.

⇒ La respuesta correcta a una solicitud de eliminación es motivada, no es una negativa ni una ejecución automática. Si la solicitud se refiere a datos no clínicos (un contacto, una nota organizativa), esos sí se eliminan.

## Paso 3, si la consulta cierra o cambia de software

La migración tiene un procedimiento propio: se exporta todo, se verifica haber recibido el paquete y **solo después** se procede a la eliminación. El orden no es negociable: invertirlo significa destruir la única copia legible.

El paquete contiene los datos estructurados y las fotografías en claro. ⛔ No incluye la clave de cifrado, y no por nuestra confidencialidad: esa clave abre **todas** las copias cifradas existentes, incluidas las de las copias de seguridad que no se están entregando, y no es revocable.

Tras la entrega confirmada, se destruye la clave de ese proyecto. Esto permite declarar con veracidad que las copias de seguridad residuales, aunque sigan existiendo durante un tiempo, ya no son legibles para nadie.

## Errores frecuentes

- **Entregar fotografías por mensajería ordinaria.** Son datos del art. 9.
- **Ejecutar una eliminación porque se ha solicitado.** Hay que evaluarla, y la evaluación debe quedar registrada.
- **Eliminar antes de recibir confirmación de la entrega.** Es el error irreversible.

## Preguntas frecuentes

**¿Puede el paciente solicitar los registros de sus accesos?** Sí, y están disponibles: cada apertura de su historia clínica queda registrada con quién y cuándo.

**¿Cuánto tiempo tengo para responder?** Un mes desde la solicitud, prorrogable por dos meses en casos complejos, informando al interesado.

**¿Quién responde, yo o Fibonacci?** La consulta: es el responsable. Nosotros somos encargados del tratamiento y proporcionamos las herramientas para responder.
