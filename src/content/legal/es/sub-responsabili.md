> **Traducción de cortesía.** En caso de discrepancia, prevalece la versión italiana de este documento.

# Subencargados del tratamiento

**Versión 2.0 · Última revisión: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

El presente documento constituye el **Anexo B** del Acuerdo para el Tratamiento de Datos (DPA) ex art. 28 del Reglamento (UE) 2016/679 (en adelante, "GDPR") celebrado entre el Titular del tratamiento (médico cliente) y Fibonacci en calidad de Responsable del tratamiento para la prestación del software SaaS Fibonacci. En él se enumeran de manera nominativa los subencargados autorizados conforme a los arts. 28.2 y 28.4 GDPR y está sujeto a actualización continua.

---

## 1. Premisa y normativa

1.1. **Definición de subencargado**. Se define como subencargado del tratamiento (en adelante, "Subencargado") al tercero, persona física o jurídica, del que el Responsable se sirve para la ejecución de actividades específicas de tratamiento por cuenta del Titular, conforme al art. 28, apartados 2 y 4, del GDPR.

1.2. **Autorización general ex art. 28.2 GDPR**. Con la firma del DPA, el Titular otorga al Responsable una autorización escrita general para recurrir a los Subencargados indicados en el presente Anexo B, reconociendo que cada uno de ellos ha sido seleccionado por el Responsable sobre la base de un juicio de fiabilidad y de adecuación de las garantías ofrecidas en términos de seguridad técnica y organizativa del tratamiento, conforme al art. 28, apartado 1, GDPR.

1.3. **Cadena contractual**. El Responsable celebra con cada Subencargado un contrato escrito que impone las mismas obligaciones de protección de datos previstas en el DPA entre Titular y Responsable, en particular en materia de confidencialidad, medidas de seguridad, asistencia al Titular en el ejercicio de los derechos de los interesados y cooperación con la Autoridad de control. El Responsable responde frente al Titular del incumplimiento de los Subencargados de las obligaciones de protección de datos, conforme al art. 28, apartado 4, GDPR.

1.4. **Obligación de información y derecho de oposición**. Cualquier modificación del listado de Subencargados, incluida la incorporación de un nuevo Subencargado, la sustitución de un Subencargado existente o la finalización de la relación con un Subencargado, será comunicada por el Responsable al Titular con **preaviso de al menos 30 (treinta) días** respecto a la fecha de eficacia de la modificación, mediante comunicación por correo electrónico a la dirección del Titular que conste en el Contrato de Servicio y actualización simultánea de la presente página publicada en la dirección `{URL_SITO}/sub-responsabili`.

1.5. **Ejercicio del derecho de oposición**. Dentro del plazo de 30 días mencionado en el punto 1.4, el Titular podrá oponerse de manera motivada a la modificación propuesta. El procedimiento aplicable en caso de oposición se regula en el apartado 3 del presente Anexo.

1.6. **Transparencia**. El presente listado se hace público con el fin de permitir al Titular verificar, antes de la firma del Contrato de Servicio y durante toda la duración de la relación, la identidad y ubicación de los sujetos que intervienen en la cadena de tratamiento.

---

## 2. Listado de subencargados autorizados

Los subencargados actualmente autorizados en la fecha de última revisión del presente documento son los siguientes.

### 2.1. Aruba S.p.A.

- **Denominación legal**: Aruba S.p.A.
- **Sede legal**: Via San Clemente 53, 24036 Ponte San Pietro (BG), Italia
- **Categoría de servicio**: alojamiento de la infraestructura aplicativa, base de datos relacional PostgreSQL, almacenamiento de las fotografías clínicas cifradas, ejecución de las copias de seguridad periódicas
- **Tipología de datos tratados**: categorías especiales de datos según el art. 9 GDPR (datos sanitarios, anamnesis, informes, prescripciones), datos personales de los pacientes, fotografías clínicas. Todos los datos en reposo están cifrados con algoritmo AES-256; las claves de cifrado son gestionadas por el Responsable y no están a disposición del proveedor
- **Localización del tratamiento**: infraestructura del proveedor en red italiana. El bloque de direcciones que aloja el Servicio está registrado en la base de datos RIPE como `ARUBA-NET`, Aruba S.p.A., país **IT**: la verificación está al alcance de cualquiera, mediante una consulta `whois` sobre la dirección pública del Servicio
- **Base jurídica de la transferencia**: tratamiento realizado íntegramente dentro del territorio de la Unión Europea; no se configura ninguna transferencia de datos a terceros países conforme al Capítulo V del GDPR
- **Garantías declaradas por el proveedor**: certificación **ISO/IEC 27001** y adhesión al **CISPE Data Protection Code of Conduct for Cloud Infrastructure Service Providers**, código de conducta conforme al **art. 40 GDPR** aprobado por la CNIL francesa en 2021, que actúa como autoridad de control designada para el código. La inscripción del proveedor es verificable en el registro público CISPE
- **Política de privacidad del proveedor**: [https://www.aruba.it/documents/tc-files/it/11_it_privacy_policy_aruba_spa.aspx](https://www.aruba.it/documents/tc-files/it/11_it_privacy_policy_aruba_spa.aspx)
- **Informativa GDPR del proveedor**: [https://www.aruba.it/gdpr-regolamento-europeo-privacy.aspx](https://www.aruba.it/gdpr-regolamento-europeo-privacy.aspx)
- **Registro público CISPE**: [https://cispe.cloud/publicregister/](https://cispe.cloud/publicregister/)
- **Notas operativas**: el proveedor actúa como mero proveedor de infraestructura; no tiene acceso aplicativo ni lógico a los datos clínicos, que residen en volúmenes cifrados cuya clave está exclusivamente a disposición del Responsable
- ⚠️ **Por completar**: el nombramiento escrito como subencargado ex art. 28.3 GDPR con este proveedor está en proceso de formalización junto con la constitución de la sociedad titular del Servicio. Hasta entonces, esta entrada describe el esquema técnico verificado, no una relación contractual ya perfeccionada

### 2.2. Hostinger International Ltd

- **Denominación legal**: Hostinger International Ltd
- **Sede legal**: 61 Lordou Vironos str., 6023 Larnaca, Chipre
- **Categoría de servicio**: envío de correos electrónicos transaccionales mediante servidor SMTP autenticado, incluyendo confirmaciones y recordatorios de citas, notificaciones del sistema, entrega de documentos adjuntos y comunicaciones relativas al primer acceso; **DNS autoritativo** para el dominio del Servicio y sus subdominios
- **Tipología de datos tratados**: dirección de correo electrónico del destinatario, nombre del destinatario, contenido textual del mensaje, posibles documentos adjuntos, registros técnicos de envío. **No recibe datos sanitarios con detalle clínico en el cuerpo del mensaje**; los textos se limitan a información operativa (fecha, hora, lugar de la cita) y comunicaciones de servicio
- **Localización del tratamiento**: proveedor establecido en la Unión Europea (Chipre). La ubicación de los servidores de correo depende del plan contratado y debe verificarse en el panel del proveedor
- **Base jurídica de la transferencia**: para eventuales tratamientos fuera del Espacio Económico Europeo se aplican las Cláusulas Contractuales Tipo mencionadas en el Data Processing Addendum del proveedor, que forma parte integral de los términos de servicio aceptados
- **Política de privacidad del proveedor**: [https://www.hostinger.com/legal/privacy-policy](https://www.hostinger.com/legal/privacy-policy)
- **DPA del proveedor**: [https://www.hostinger.com/legal/dpa](https://www.hostinger.com/legal/dpa)
- **Notas operativas**: el contenido de los mensajes está estructurado de manera que no transmita información clínica identificativa; la referencia al servicio sanitario se mantiene genérica. ⚠️ Excepción: la entrega de documentos adjuntos (consentimientos informados, hoja de visita), solicitada explícitamente por el usuario del servicio: en ese caso, el adjunto transita por el servidor de correo del proveedor

### 2.3. Mistral AI SAS

- **Denominación legal**: Mistral AI SAS
- **Sede legal**: 15 rue des Halles, 75001 París, Francia
- **Categoría de servicio**: transcripción automática del habla (Speech-to-Text) mediante el modelo Voxtral para la funcionalidad de dictado médico integrada en el Software
- **Tipología de datos tratados**: grabaciones de audio temporales del dictado del Titular, que pueden contener referencias directas o indirectas a categorías especiales de datos según el art. 9 GDPR. El audio se envía en streaming vía API HTTPS y se procesa en ventana temporal
- **Localización del tratamiento**: servidores ubicados en la Unión Europea
- **Base jurídica de la transferencia**: tratamiento realizado dentro del territorio de la Unión Europea
- **Política de privacidad del proveedor**: [https://mistral.ai/terms/#privacy-policy](https://mistral.ai/terms/#privacy-policy)
- **DPA del proveedor**: condiciones enterprise de Mistral AI, suscritas por el Responsable en el momento de la activación del servicio; copia disponible a solicitud escrita del Titular
- **Notas operativas**: el audio no es conservado por el proveedor más allá del tiempo estrictamente necesario para completar la transcripción (retention zero). El Responsable ha seleccionado la configuración contractual que excluye el uso del input de los clientes API para el entrenamiento de los modelos (opt-out training), en ausencia de opt-in explícito. El texto transcrito devuelto por el servicio se transfiere inmediatamente a la infraestructura del Responsable mencionada en el punto 2.1 y no queda a cargo del proveedor

### 2.4. Stripe Payments Europe Limited

- **Denominación legal**: Stripe Payments Europe Limited
- **Sede legal**: 1 Grand Canal Street Lower, Grand Canal Dock, Dublín, Irlanda
- **Categoría de servicio**: gestión de la suscripción al Servicio Fibonacci, cargo recurrente en tarjeta de crédito o instrumento de pago equivalente, emisión de la facturación del Titular frente al Responsable
- **Tipología de datos tratados**: datos personales y datos de pago del Titular médico (titularidad, NIF, dirección de facturación, datos del instrumento de pago). **No recibe en ningún caso datos clínicos de los pacientes**, ni datos identificativos de los mismos
- **Localización del tratamiento**: servidores principales ubicados en la Unión Europea (Irlanda); réplica de resiliencia en centros de datos localizados en Estados Unidos de América y en el Reino Unido
- **Base jurídica de la transferencia**: para la réplica en Estados Unidos, cláusulas contractuales tipo de la Comisión UE según la Decisión 2021/914 (módulo Responsable-Subencargado) integradas con medidas suplementarias; para el Reino Unido, decisión de adecuación de la Comisión UE del 28 de junio de 2021
- **Política de privacidad del proveedor**: [https://stripe.com/it/privacy](https://stripe.com/it/privacy)
- **DPA del proveedor**: [https://stripe.com/it/legal/dpa](https://stripe.com/it/legal/dpa)
- **Notas operativas**: la cadena de pago está segregada de la cadena clínica; la conciliación entre suscripción y tenant Fibonacci se realiza mediante identificador opaco que no transmite datos clínicos

---

## 2-bis. Sujetos que NO intervienen en la cadena

Este apartado enumera lo que **no** existe. Sirve porque la ausencia de un intermediario es en sí misma una garantía, y porque una versión anterior del presente Anexo declaraba un subencargado que el Servicio no utiliza.

**Ninguna red de distribución de contenidos (CDN), ningún proxy inverso de terceros, ningún Web Application Firewall gestionado por terceros.** El dominio del Servicio resuelve **directamente** en la dirección de la infraestructura mencionada en el punto 2.1: entre el navegador del usuario y el backend no se interpone ningún otro sujeto, y no existe ningún punto en el que un tercero termine la conexión cifrada. Esta circunstancia es verificable desde el exterior mediante una consulta DNS sobre el dominio del Servicio.

**Consecuencia sobre el Capítulo V del GDPR**: la cadena que trata los datos de los pacientes no incluye ningún proveedor sujeto a jurisdicción extraeuropea. Las únicas transferencias a terceros países restantes se refieren a la cadena de pagos mencionada en el punto 2.4, que **no trata datos de los pacientes**.

---

## 3. Procedimiento de modificación del listado y derecho de oposición

3.1. **Notificación previa**. Cualquier modificación del presente listado (incorporación de un nuevo Subencargado, sustitución de un Subencargado existente, finalización de una relación de subencargado) será notificada por el Responsable al Titular con **preaviso de al menos 30 (treinta) días** respecto a la fecha de eficacia de la modificación. La notificación se enviará por correo electrónico a la dirección de contacto del Titular que conste en el Contrato de Servicio y, simultáneamente, se actualizará la presente página.

3.2. **Contenido de la notificación**. La notificación indicará: la denominación y sede del Subencargado afectado, la categoría de servicio encomendada, la tipología de datos tratados, la localización del tratamiento, la base jurídica de la transferencia cuando sea aplicable, las garantías adoptadas y la fecha de eficacia.

3.3. **Derecho de oposición**. En un plazo de 30 días desde la recepción de la notificación, el Titular podrá oponerse por escrito a la modificación propuesta, indicando los motivos de la oposición. La oposición se enviará a la dirección {EMAIL_PRIVACY}, o por correo electrónico certificado (PEC) o carta certificada con acuse de recibo a la dirección de la sede del Responsable.

3.4. **Gestión de la oposición**. Recibida la oposición, el Responsable evaluará de buena fe soluciones alternativas adecuadas para satisfacer la necesidad técnica u organizativa subyacente a la modificación, sin perjuicio del derecho del Responsable a adoptar la solución técnica que considere más adecuada para la continuación del Servicio.

3.5. **Falta de acuerdo**. En ausencia de acuerdo entre las Partes en un plazo razonable posterior a la oposición, cada Parte podrá rescindir el Contrato de Servicio con preaviso por escrito, sin perjuicio de la aplicación de las disposiciones contractuales en materia de devolución y cancelación de datos al término de la relación.

3.6. **Modificaciones urgentes por razones de seguridad**. Si la modificación fuera necesaria con carácter urgente por razones de seguridad, continuidad del servicio o para cumplir con una obligación legal, el Responsable podrá proceder con un preaviso inferior, comunicando sin demora los motivos al Titular. En este caso, el derecho de oposición del Titular y las disposiciones de los puntos 3.3, 3.4 y 3.5 se aplicarán igualmente, aunque con carácter posterior.

3.7. **Ausencia de oposición**. La falta de oposición del Titular en el plazo de 30 días equivaldrá a la aceptación de la modificación.

---

## 4. Registro de versiones

| Versión | Fecha | Modificación |
| --- | --- | --- |
| 1.0 | {ULTIMA_REVISIONE} | Primera publicación del listado nominativo de subencargados del tratamiento, incluyendo Hetzner Online GmbH, Hostinger International Ltd, Mistral AI SAS, Stripe Payments Europe Limited y Cloudflare, Inc. |
| 1.1 | {ULTIMA_REVISIONE} | Sustitución de Brevo SAS por Hostinger International Ltd como subencargado para el envío de correos electrónicos transaccionales: el servicio ya no utiliza una plataforma externa de email marketing y envía los correos mediante el servidor SMTP autenticado del proveedor del buzón de correo. |
| 2.0 | {ULTIMA_REVISIONE} | **Corrección del proveedor de hosting y eliminación de un subencargado nunca utilizado.** (a) Hetzner Online GmbH (Falkenstein, Alemania) es sustituida por **Aruba S.p.A.** (Italia), que es el sujeto en el que reside efectivamente la infraestructura: la verificación se realizó resolviendo el dominio del Servicio e interrogando el registro RIPE de la dirección resultante. (b) **Cloudflare, Inc. se elimina**: el Servicio no utiliza ninguna red de distribución de contenidos ni proxy de terceros, y el dominio resuelve directamente en la infraestructura mencionada en el punto 2.1. En consecuencia, la cadena que trata los datos de los pacientes ya no incluye ninguna transferencia a terceros países. (c) El DNS autoritativo se atribuye a Hostinger International Ltd, que lo proporciona de facto. |

---

## 5. Contactos

Para cualquier solicitud de aclaración, ejercicio del derecho de oposición o petición de documentación adicional relativa a los subencargados autorizados, el Titular podrá dirigirse a los siguientes contactos:

- **Contacto para la protección de datos**: {EMAIL_PRIVACY}
- **Oficina de privacidad**: {EMAIL_PRIVACY}
- **Responsable del tratamiento**: {DENOMINAZIONE} · sede legal: {SEDE_LEGALE}

---

> El presente documento está actualizado a la fecha indicada al inicio y está sujeto a revisión continua. El Titular podrá solicitar en cualquier momento confirmación escrita de la versión vigente del presente listado, escribiendo a la dirección {EMAIL_PRIVACY}. En caso de discrepancia entre la copia impresa y la versión publicada en la dirección `{URL_SITO}/sub-responsabili`, prevalecerá la versión publicada en línea.
