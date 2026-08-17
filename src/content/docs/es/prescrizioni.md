# Prescripciones y terapias

Esta guía describe cómo completar una prescripción, cómo el sistema controla las alergias y qué hace cuando no se puede realizar el control. Está dirigida a los médicos.

## Requisitos previos

- Cuenta con rol `Médico / Profesional sanitario`, con los datos de inscripción en el `Ordine dei Medici` completados: aparecen en la receta impresa.
- Datos del `Paciente` con anamnesis, si se quiere que el control de alergias tenga algo con qué trabajar.

## Paso 1, elegir el medicamento

El campo del medicamento busca en el catálogo de la AIFA, que contiene tanto los nombres comerciales como los **principios activos**: al escribir `ialurónico` o `botulínica` aparecen los productos correspondientes, incluso cuando el nombre comercial es diferente.

⚠️ **Los fillers no están en el catálogo, y es correcto**: son dispositivos médicos marcados CE, no medicamentos, y no aparecen en un archivo de fármacos. Se registran como tratamiento (ver la guía `Registrar un tratamiento`), no como prescripción.

## Paso 2, el control de alergias

En el momento de la elección, el sistema compara el medicamento con las alergias registradas en la anamnesis y muestra una advertencia si encuentra una coincidencia.

🔑 **El control es fail-open, y hay que saberlo**: si la anamnesis está vacía, o si el medicamento no es reconocido, **no aparece ninguna advertencia**. La ausencia de una advertencia no significa «ninguna alergia»: significa «no se ha encontrado ninguna coincidencia». Es una distinción importante, y es el motivo por el que el control no sustituye a una anamnesis bien realizada.

## Paso 3, dosis, frecuencia, duración

Los campos siguen la estructura de la receta: dosis, frecuencia, periodicidad, duración en días, notas para el `Paciente`. Las notas se imprimen: son el lugar para las indicaciones de uso y las contraindicaciones que hay que recordar.

## Paso 4, impresión

La receta impresa incluye los datos de la consulta y del médico (denominación, sede, inscripción en el `Ordine dei Medici` con número), tomados de la configuración de la consulta. Si esos campos están vacíos, la receta los imprime como espacios para rellenar a mano: el sistema no inventa datos identificativos.

## Errores frecuentes

- **Confiar en la advertencia de alergias como si fuera una garantía.** Es una ayuda, no una medida de seguridad: sin anamnesis no tiene nada con qué comparar.
- **Registrar un filler como prescripción.** Es un dispositivo: va en la `seduta`, con lote y cantidad.
- **Datos del `Ordine dei Medici` no completados.** Aparecen vacíos en la receta y en los `Consentimientos`, y se notan solo cuando el documento ya está en manos del `Paciente`.

## Preguntas frecuentes

**¿Puedo prescribir medicamentos a cargo del Servicio Sanitario?** No: la receta generada aquí es una prescripción privada. Las funciones para el canal telemático existen en el producto, pero están desactivadas y requieren acreditaciones regionales.

**¿Las prescripciones se incluyen en el export del `Paciente`?** Sí, junto con el resto de la cartella clinica.
