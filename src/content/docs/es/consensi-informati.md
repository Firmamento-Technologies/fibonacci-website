# Generar y firmar consentimientos informados en PDF

Esta guía describe cómo generar borradores de consentimiento informado estructurados según la **ley 219/2017** utilizando el **Asistente de IA de Fibonacci**, validarlos sección por sección y recoger la firma grafométrica del paciente en formato PDF/A-3b conforme a la normativa. Está dirigida a médicos de medicina estética y cirugía plástica que operan en Italia.

Fibonacci no distribuye modelos de terceros. El sistema combina dos fuentes:

1. **Más de 100 modelos propietarios Fibonacci v0.1 (borradores para validar)** para los procedimientos más frecuentes de medicina estética inyectiva y no quirúrgica, cirugía plástica facial y corporal, y seguimiento.
2. **Asistente de IA generativo** para consentimientos personalizados para cualquier tratamiento fuera del catálogo, partiendo de una librería de **72 cláusulas jurídicas extraídas de fuentes de la Administración Pública italiana** (actos regionales, ASL, empresas hospitalarias) que son de dominio público según la ley 633/1941 art. 5.

Todos los resultados son validados por tres capas anti-alucinación (ver Paso 4) y archivados con un sello electrónico avanzado, y cada paso queda registrado en el `Registro de accesos`.

## Requisitos previos

- Cuenta con rol `medico` o `admin studio`.
- Datos completos del paciente con al menos nombre, apellidos, código fiscal y fecha de nacimiento.
- Perfil médico de la consulta configurado con datos identificativos y número de inscripción en el `Ordine dei Medici` (verificar en `Ajustes` → `Datos de la consulta y médico`).
- Para la firma grafométrica: una tablet o dispositivo táctil en el que el paciente pueda estampar su firma, y un documento de identidad del paciente para la verificación previa.

## Paso 1, apertura del módulo de consentimientos

Desde la ficha de visita del paciente, la pestaña `Consentimientos` abre el panel de gestión. La pantalla muestra:

- en la columna izquierda el listado de los consentimientos ya generados para el paciente, con estado `Bozza`, `Inviato`, `Firmato`, `Revocato`;
- en la columna derecha el botón `Añadir consentimiento` que abre el Asistente de IA.

Los consentimientos ya firmados permanecen accesibles en solo lectura. La generación de un nuevo consentimiento no sobrescribe ni modifica los anteriores: cada consentimiento es un documento independiente, con su propio rastro inalterable.

Alternativamente, desde el menú `Consentimientos` → `Catálogo` se accede a los más de 100 modelos propietarios Fibonacci listos para descargar en PDF (rellenados automáticamente con los datos de la consulta y el médico). Son útiles como referencia o para impresiones rápidas sin paciente en carga.

## Paso 2, Asistente de IA en 4 pasos

El botón `Añadir consentimiento` abre el asistente en 4 pasos.

**Paso 1 · Selección del procedimiento**: el catálogo enumera los procedimientos disponibles divididos por categoría (medicina estética inyectiva, no quirúrgica, seguimiento). Puedes buscar por nombre o empezar desde cero con una descripción libre del tratamiento.

**Paso 2 · Parámetros clínicos**: campos preestablecidos para técnica, materiales (ej. tipo de `filler`, lote, dispositivo láser), riesgos conocidos específicos del procedimiento, alternativas terapéuticas y notas. Cuantos más detalles introduzcas, mayor será la puntuación de confianza en el paso siguiente.

**Paso 3 · Generación con IA**: el sistema invoca el modelo lingüístico configurado y en 10-15 segundos compone el borrador de las 8 secciones obligatorias según la ley 219/2017:

1. Identificación del paciente y contexto de la prestación
2. Descripción clínica del procedimiento
3. Beneficios esperados
4. Riesgos documentados y probabilidades realistas
5. Alternativas terapéuticas (incluida la abstención)
6. Consecuencias del rechazo
7. Declaración de comprensión del paciente
8. Firma y ratificación

Debajo del resultado recibes el panel `Validación automática` (Paso 4).

**Paso 4 · Revisión médica + firma**: en el último paso revisas cada una de las 8 secciones después de haberlas releído, luego recoges la firma grafométrica del paciente. El botón `Guardar e enviar` permanece desactivado hasta que no hayas confirmado las 8 secciones.

## Paso 3, parámetros clínicos y personalización

El editor del asistente en el Paso 2 presenta los siguientes campos rellenados o sugeridos:

- **Datos personales**: nombre, apellidos, código fiscal, fecha de nacimiento del paciente (rellenados automáticamente).
- **Consulta**: denominación, IVA, dirección, teléfono, PEC (rellenados automáticamente desde `Ajustes`).
- **Médico ejecutor**: nombre, colegio profesional, número de inscripción (rellenados automáticamente).
- **Fecha de la prestación**: normalmente hoy o la fecha de la cita vinculada.
- **Técnica**: descripción del método (ej. "inyección intradérmica con cánula 25G en zona bermellón, paciente sentado, anestesia tópica EMLA 30 min").
- **Materiales**: productos utilizados con lotes trazables.
- **Riesgos conocidos**: los riesgos específicos de este procedimiento con probabilidades (ej. "equimosis 5-10%, edema 48h, asimetría <2%, isquemia rara").
- **Alternativas**: opciones alternativas razonables (incluido "abstención del tratamiento").
- **Notas libres**: eventuales condiciones clínicas del paciente que modifican el consentimiento (alergias, terapias anticoagulantes).

El nivel de detalle que introduzcas aquí guía a la IA: entrada detallada → salida detallada con citas puntuales. Entrada escasa → salida genérica que deberá marcarse como `review_obbligatoria`.

## Paso 4, validadores anti-alucinación

Antes de que el consentimiento se muestre al médico, el sistema ejecuta tres validadores en secuencia:

**Validador #1 · Lista negra de términos prohibidos**: el backend rechaza automáticamente cualquier resultado que contenga:

- nombres de marcas o siglas de empresas terceras del sector (protección anti-copyright);
- afirmaciones engañosas del tipo "resultado garantizado", "100% seguro", "curación garantizada", "ninguna complicación", "certifico que", "sin ningún riesgo".

En caso de coincidencia, el resultado nunca se muestra y el sistema regenera con un prompt reforzado.

**Validador #2 · Comprobación de citas**: verifica que el texto contenga referencias normativas obligatorias (`L. 219/2017`, `Cassazione`, `GDPR`). Si faltan, emite un aviso pero no bloquea: el médico puede proceder igualmente de forma consciente.

**Validador #3 · Puntuación de confianza por sección**: cada sección de las 8 obligatorias obtiene una puntuación `0.0-1.0` calculada en base a:

- longitud del texto (secciones demasiado cortas = baja confianza);
- presencia de citas normativas en línea (`legge 219`, `art.`, `gdpr`, `cassazione`, `fnomceo`, `lazio`);
- número de cláusulas de la Administración Pública referenciadas en la librería de 72 elementos.

La sección 5 (Firma/suscripción) siempre requiere revisión manual independientemente de la puntuación, al ser la más crítica desde el punto de vista jurídico.

Si `overall_confidence < 0.7` o si hay errores en la lista negra, el sistema establece `review_obbligatoria=true` y bloquea el guardado hasta que el médico no reformule manualmente las secciones problemáticas.

Además, un *frequency check* señala como advertencia porcentajes sospechosos (ej. "100% de riesgo", "0.001% de complicación") que a menudo indican alucinaciones numéricas del LLM.

## Paso 5, firma del paciente y archivado

Tras la revisión médica (8/8 casillas activas), el botón `Guardar e enviar` se activa. Al hacer clic, ocurren en secuencia:

1. **Generación de PDF/A-3b**: el módulo `pdf-signer` de Fibonacci convierte el Markdown del consentimiento en PDF/A-3 conforme a la norma ISO 19005-3, con archivo XML embebido para la validación a largo plazo. Este es el formato requerido por el Codice dell'Amministrazione Digitale art. 44 para la conservación decenal.

2. **Sello electrónico avanzado**: el PDF se sella en el servidor con certificado del titular de la consulta y marca temporal (TSA conforme a eIDAS).

3. **Firma grafométrica del paciente**: el paciente firma en la tablet; el sistema captura, además de la imagen de la firma, los datos biométricos del trazo (presión, velocidad, tiempos), que se cifran e incorporan al PDF para un eventual peritaje grafológico. Se trata de una firma electrónica avanzada (FEA), que debe recogerse previa verificación de la identidad del paciente mediante documento. La FEA tiene la eficacia probatoria del documento privado (art. 2702 c.c.); si es impugnada, la carga de la prueba recae sobre quien la presenta. La presunción plena de atribución al firmante (art. 20 c. 1-bis CAD) se obtiene con la firma cualificada (FEQ), activable —junto con la marca temporal cualificada— mediante QTSP acreditado.

4. **Archivado**: el consentimiento firmado se incorpora a la historia clínica del paciente, vinculado a la visita y al médico que lo recogió. El PDF queda adjunto y descargable.

5. **Registro**: la operación se registra en el `Registro de accesos` inmutable con `action=C` (create), `purposeOfEvent` que describe la revisión de IA de las 8 secciones, *agent* (médico), *source* (Asistente de IA), *outcome* (success/failure). Búsqueda forense desde el *Audit Log* con filtros por fecha, paciente, médico.

El paciente recibe una copia del PDF firmado por correo electrónico. La consulta conserva siempre el original archivado.

## Paso 6, revocación, modificación, reimpresión

- **Revocación**: el paciente o el médico pueden revocar un consentimiento firmado desde el menú contextual `Revoca`. El estado pasa a `inactive` (Revocato), se crea un nuevo `AuditEvent action=U` con la motivación, pero el PDF original permanece archivado. Una revocación tras la prestación implica la interrupción del tratamiento (ley 219/2017 art. 1 comma 5).

- **Modificación**: los consentimientos firmados **no son modificables**. Si se necesita un consentimiento actualizado (ej. cambio de técnica), se genera uno nuevo. El sistema muestra automáticamente los anteriores en la ficha del paciente con el historial de versiones.

- **Reimpresión**: desde el consentimiento firmado siempre se puede volver a descargar el PDF original, idéntico al sellado. Útil para llevarlo en la historia clínica en papel o entregarlo nuevamente al paciente.

⚠️ **Revocar un consentimiento no es borrar datos.** El PDF revocado permanece archivado: es lo que demuestra que el consentimiento existía en el momento en que se realizó la prestación, y la revocación no afecta a la historia clínica. Si el paciente solicita el acceso, la portabilidad o la eliminación de sus datos, la guía es otra: [Exportaciones y derechos del paciente](/manuale/esportazioni-e-diritti).

## Notas importantes

- Los más de 100 modelos propietarios Fibonacci están en **versión 0.1 (borrador interno)**. Cubren la estructura legal prevista (8 secciones L. 219/2017 + 5 elementos Cassazione 26104/2022 + GDPR + eIDAS + PDF/A-3b), pero **el contenido clínico no ha sido validado aún por abogado sanitario ni por médico especialista** de la disciplina. Antes de usarlos con pacientes reales debes: (1) hacer revisar cada modelo por el abogado de tu consulta, (2) verificar riesgos/porcentajes con las guías societarias actualizadas (SICPRE/ISAPS, SIDeMaST, SIME/AIME), (3) personalizar el consentimiento para cada paciente (alergias, terapias en curso, comorbilidades —el asistente te obliga a hacerlo en el Paso 2—), (4) firmar el documento tras la firma del paciente. Fibonacci proporciona la infraestructura técnica, no sustituye el asesoramiento legal del abogado sanitario ni la responsabilidad clínica del médico tratante.

- El Asistente de IA genera textos que **deben ser siempre revisados** por el médico antes del envío: la IA es una herramienta de apoyo (conforme al requisito RF-5.4), no un dispositivo médico. La revisión obligatoria de las 8 secciones del Paso 4 sirve para marcar esta responsabilidad.

- Los datos tratados para la generación del consentimiento no se utilizan para el entrenamiento de los modelos (opt-out contractual con los proveedores). La inferencia se realiza a través del proveedor LLM configurado: la lista actualizada de los subencargados y sus sedes de tratamiento se publica en `/sub-responsabili`. No introduzcas en el contexto clínico identificadores directos del paciente más allá de lo estrictamente necesario.

## Referencias normativas

- **Ley 219/2017 art. 1**: Normas en materia de consentimiento informado y disposiciones anticipadas de tratamiento.
- **Cassazione 26104/2022**: Carga de la prueba del consentimiento informado a cargo del médico.
- **GDPR art. 9 + art. 30**: Tratamiento de datos sanitarios + registro de actividades de tratamiento.
- **Reglamento UE 910/2014 (eIDAS)**: Firma electrónica avanzada.
- **CAD art. 44 + ISO 19005-3**: Conservación de documentos informáticos conforme a la normativa.
- **Ley 633/1941 art. 5**: Actos de la Administración Pública en dominio público.

> Documento actualizado el **{ULTIMA_REVISIONE}**.
