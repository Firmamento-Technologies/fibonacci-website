# Las áreas tratadas: en la foto y en el modelo 3D

> ⚠️ **Reescrita el 17-08-2026 revisando la pantalla.** La versión anterior
> describía una tabla resumen con reordenamiento por arrastrar, atajos de
> teclado, un botón **«Importa desde visita anterior»** y **«Inserisci prodotto
> custom»**: **ninguna de esas cosas existe**, y es el peor defecto que puede
> tener una guía, porque quien la lee busca el botón y concluye que el
> producto está roto. Si encuentras aquí algo que no aparece en pantalla, repórtalo.

Dentro de una sesión, las áreas tratadas se marcan en una imagen en lugar de
describirlas con palabras: cada punto es un **punto rojo numerado**, y la lista
de áreas se completa automáticamente a medida que los colocas.

Las superficies son **dos**, y son dos formas de indicar las mismas áreas:

| Opción | Cómo se marca | Qué muestra |
|---|---|---|
| `Foto` | un clic en el retrato | el retrato frontal, hombre o mujer: 76 áreas del rostro |
| `3D` | doble clic en el modelo | el cuerpo entero, **incluido el rostro**, hombre o mujer |

⚠️ **Hasta el 17 de agosto de 2026 también había una opción entre `rostro` y `cuerpo`, y se eliminó**: «solo confunde». El modelo tridimensional es **uno solo**, con la capa del rostro superpuesta: se hace clic donde se ha tratado, ya sea la cabeza o el tobillo.
La foto se mantiene porque en el rostro frontal es más rápido que cualquier 3D.

## Requisitos previos

- Cuenta con rol `médico` y acceso clínico al paciente.
- Una sesión abierta: el módulo `Nuevo tratamiento` en la pestaña `Tratamientos`
  de la historia clínica.

## Paso 1, elegir la superficie

En el módulo del tratamiento, en la sección `Body-map y áreas tratadas`, dos botones:
`Foto` y `3D`.

El **sexo del modelo** (`mujer` / `hombre`) es **único** y vale para ambas:
elegirlo en el retrato y volver a encontrarlo en el 3D sería la misma pregunta
planteada dos veces. En el retrato, el sexo también cambia **dónde caen los puntos**,
porque los dos rostros tienen proporciones distintas.

⚠️ El selector de sexo solo aparece si el modelo correspondiente se ha descargado
en el servidor. Las áreas registradas en la historia clínica **no dependen de qué
modelo estás viendo**: los códigos de las regiones son los mismos.

## Paso 2, colocar un punto

- **En el retrato**: un clic en el punto tratado.
- **En el modelo 3D**: **doble clic**. El doble clic sirve para distinguir el
  marcado de la rotación: se arrastra para girar, se usa la rueda para
  acercarse, y el clic simple no debe marcar nada por error. Un segundo doble clic
  en el mismo punto lo elimina.
- El botón `Recenter` devuelve el modelo a la posición inicial.
- En el retrato, `Abrir a pantalla completa` amplía la imagen cuando los puntos están muy juntos.

En el 3D, el punto queda **donde has hecho clic**, no en el centro del área: en un muslo,
el centro del área estaría veinte centímetros más allá. El modelo se abre con la figura completa:
para las áreas del rostro, se acerca con la rueda.

⚠️ **Los puntos exactos valen para el modelo en el que los has colocado.** Los dos cuerpos
no son el mismo: al cambiar de hombre a mujer, el punto exacto no existe y el punto
se posiciona en el centro del área, que en ese modelo siempre es correcto. Las áreas registradas no cambian.

## Paso 3, qué se escribe en un punto

En el retrato, el punto abre una ventanita con dos campos principales:

- **Tratamiento**, texto libre (por ejemplo «filler de ácido hialurónico», «bótox»);
- **Cantidad**, texto libre con la unidad (por ejemplo «0,5 ml», «25 U»).

Debajo, la sección **Cómo se realizó**, cerrada por defecto y **opcional**, con cuatro menús desplegables de vocabulario cerrado:

- `Instrumento`: aguja, cánula, microagujas o roller, otro;
- `Calibre`: del 18G, el más grueso, al 34G, el más fino;
- `Plano`: supraperióstico, subgaleal, subfascial, subcutáneo, dérmico profundo, dérmico superficial;
- `Técnica`: bolo, microbolo, retrógrado, anterógrado, en abanico, lineal.

No es un capricho documental: el reglamento (UE) 2022/2346, anexo §3.1 letra j,
exige documentar la técnica de inyección, los instrumentos y la cantidad máxima inyectada
en función de la zona y la técnica. Los cuatro menús desplegables son lo que permite responder.

⛔ **Ninguno de los menús sugiere el valor correcto para la zona**: no proponen un plano,
no avisan si una combinación es inusual. Las tablas por zona existen en la bibliografía y
quedan fuera del software, porque serían una indicación clínica.

⚠️ Un punto sin estos cuatro campos sigue siendo válido: todas las anotaciones
escritas antes del 15 de agosto de 2026 no los tienen.

## Paso 4, la lista de áreas se completa sola

Los puntos y la lista `Áreas tratadas` debajo del mapa son **lo mismo visto de dos formas**:

- colocas un punto, el área entra en la lista;
- eliges un área de la lista, el punto aparece en el mapa;
- quitas una, desaparece el otro.

Esto también **funciona entre superficies**: un área marcada en el modelo 3D ya tiene su punto al volver al retrato.

## Paso 5, las áreas dictadas y las escritas a mano

Dos herramientas llevan al mapa las áreas que has escrito (o dictado) con palabras,
y **ambas requieren un gesto tuyo**: nada entra en la historia clínica por sí solo.

- **«Áreas detectadas en el texto»**: aparece debajo del campo de notas mientras escribes.
  Es un reconocimiento por palabras clave, sin modelo lingüístico: propone etiquetas y tú añades las correctas.
- **«Extraer áreas automáticamente del texto»** envía el texto de las notas al servicio de extracción,
  que responde con áreas, producto y cantidad ya separados, y las áreas **se añaden** a los puntos existentes
  en lugar de sustituirlos.

⚠️ **El dictado por sí solo no colorea el mapa.** `Dictar la sesión` rellena producto,
cantidad, lote y uso off-label, pero las zonas reconocidas las escribe al final de las notas
en la forma `[áreas dictadas: …]`, porque marcarlas requiere el código exacto del área.
Son las dos herramientas anteriores las que las convierten en puntos: saberlo evita buscar marcas que nadie ha colocado.

## Paso 6, uso off-label

`Uso off-label` es una casilla de la ficha del tratamiento, no del punto individual,
y cuando está activa pide la `Motivación off-label`. El campo existe porque en medicina estética
el uso fuera de indicación es frecuente y legítimo **siempre que esté documentado**:
la motivación es lo que queda registrado.

Consulta la guía [Registrar un tratamiento](/manuale/trattamenti) para lote,
caducidad, parámetros del dispositivo y recuperación.

## Qué no hace el modelo 3D

- **En el cuerpo, las áreas no se colorean de verde**, y no es un olvido: los límites
  de las regiones surgen de una partición en coordenadas óseas y cortan recto donde
  la anatomía es curva. Rellenarlos de color mostraba ese defecto en lugar de la sesión.
  La marca es el punto.
- **Las regiones no son todas las del modelo.** La lista contiene las zonas que la
  medicina estética trata realmente, agrupadas en cuello, escote, brazos, manos,
  abdomen, espalda, glúteos, muslos y piernas. Pie, uñas, pabellón auricular y regiones
  íntimas existen en el modelo anatómico y **no están en la lista clínica**: una lista
  que lo contiene todo es una lista en la que no se encuentra nada.
- **Al hacer clic fuera de esas regiones no se asigna nada**, y la página lo indica:
  muestra el nombre técnico del punto pulsado, así queda claro que el clic llegó pero
  que esa zona no la registramos.
- **El lado derecho o izquierdo lo determina el clic, no el nombre.** En el modelo
  anatómico «región anterior del brazo» es un solo nombre para dos brazos: es la
  posición del punto la que decide el lado.
- **No es el atlas.** Para mostrar al paciente esqueleto, músculos o vasos se usa la
  página [Atlas anatómico 3D](/manuale/anatomia), que no registra nada.

## El mapa agregado, en la pestaña Tratamientos

Fuera de la sesión, la pestaña `Tratamientos` de la historia clínica tiene un `Mapa de tratamientos`
que resume **todo el historial del paciente**: cada área muestra **cuántas veces** se ha tratado,
y el color indica la **categoría predominante** de producto en esa área. La leyenda está en la página,
debajo de `Leyenda categorías`.

Al hacer clic en un área, la línea de tiempo debajo se filtra por esa zona; `Eliminar filtro`
vuelve a mostrar todo. La página también señala un `Desequilibrio izq/der detectado` cuando los
recuentos entre ambos lados difieren, y `Abrir modelo completo` lleva al atlas.

⚠️ **El número no es la cantidad de producto**: es el número de tratamientos registrados en esa área.
No hay un selector de período en este mapa: muestra todo el historial.

## Exportar los datos

Desde la pestaña `Tratamientos`: `Exportar PDF` genera el resumen de los tratamientos,
`Exportar CSV` lo mismo en formato de tabla. El expediente de **una sola sesión** se descarga
desde la fila de la sesión, y se describe en [Registrar un tratamiento](/manuale/trattamenti).

## Solución de problemas

**El modelo 3D no aparece.** Se descarga en la primera apertura y es pesado: con una conexión lenta
tarda unos segundos. Si sigue vacío, recarga la página: los modelos se sirven sin caché, así que
una recarga basta para recuperarlos.

**He hecho doble clic y no ha pasado nada.** Si el punto pulsado está fuera de las regiones que registramos,
aparece el mensaje con el nombre técnico de la zona: prueba más al centro o elige el área de la lista.

**El punto está en el lugar equivocado en el retrato.** Arrástralo: la posición se actualiza.
En el 3D se elimina con un segundo doble clic y se vuelve a colocar donde sea necesario.

**He cambiado el sexo del modelo y los puntos se han movido.** Los dos cuerpos tienen coordenadas distintas:
en el otro modelo, el punto exacto no existe y el punto vuelve al centro del área. **Las áreas en la historia clínica permanecen** idénticas.

## Véase también

- [Registrar un tratamiento](/manuale/trattamenti)
- [Atlas anatómico 3D](/manuale/anatomia)
- [Completar la anamnesis con dictado por IA](/manuale/anamnesi-dettatura)
- [Resultados y complicaciones](/manuale/esiti-e-complicanze)

Última revisión: {ULTIMA_REVISIONE}
