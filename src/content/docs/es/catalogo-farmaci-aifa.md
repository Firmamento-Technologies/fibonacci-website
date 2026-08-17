# Catálogo de medicamentos: cómo se actualiza

El catálogo de medicamentos de Fibonacci proviene de la **AIFA** y cuenta con aproximadamente 159.000 entradas.
No se compila manualmente: un proceso automático lo importa y lo mantiene alineado.

La página **`Catalogo farmaci (stato)`** en el área de administración muestra cómo ha ido
la última importación. Está reservada al rol de administrador.

## Qué muestra la página

- **Estado de la última ejecución**: finalizada, en curso o fallida.
- **Cuándo se realizó** y **cuánto duró**.
- **Cuántas entradas** se han leído, añadido o actualizado.
- **El error**, si lo hubo, con la causa.

Cuando una importación está **en curso**, la página se actualiza automáticamente cada treinta
segundos: no es necesario recargarla. Una importación completa dura unos cuarenta minutos,
por lo que verla «en curso» durante mucho tiempo es normal.

## «`Forza sync ora`» está deshabilitado, y es intencional

El botón existe, pero no es clicable. Una importación requiere muchos recursos y
dura decenas de minutos: iniciarla desde una interfaz web, quizá dos veces por error,
supondría ralentizar la `cartella clinica` durante el horario de consulta. La
sincronización está programada y se fuerza desde el servidor cuando realmente es necesario.

## Qué hacer si la importación falla

El catálogo **sigue siendo el de la última importación exitosa**: ningún medicamento
desaparece y la prescripción sigue funcionando. Un fallo no es una emergencia:
significa que el catálogo envejece, no que se vacíe.

Si el estado sigue fallido durante varios días, comunícalo: la causa casi siempre está
aguas arriba (la fuente de la AIFA inaccesible), y se ve en la causa indicada en la página.
