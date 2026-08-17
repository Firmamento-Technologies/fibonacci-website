> **Traducción de cortesía.** En caso de discrepancia, prevalece la versión italiana de este documento.

# Seguridad y protección de datos

**Versión 0.2 · Última revisión: {ULTIMA_REVISIONE}**

{AVVISO_BOZZA}

La presente ficha técnica describe las medidas de seguridad, técnicas y organizativas, adoptadas por Fibonacci (en adelante, "Fibonacci" o el "Responsable del tratamiento") en la prestación del software SaaS de historia clínica digital Fibonacci (en adelante, el "Servicio" o "Fibonacci"). El documento se emite en virtud del artículo 32 del Reglamento (UE) 2016/679 (en adelante, "GDPR") y constituye el Anexo A del Acuerdo para el Tratamiento de Datos (DPA) suscrito por el médico cliente en calidad de Titular del tratamiento. Las medidas descritas se aplican al tratamiento de categorías especiales de datos según el art. 9 GDPR (datos relativos a la salud) realizado por cuenta del Titular en el ámbito del Servicio.

El documento se publica en la dirección {URL_SITO}/seguridad y está sujeto a actualizaciones periódicas en función de la evolución tecnológica del Servicio y del estado del arte en materia de seguridad informática. Las modificaciones técnicas significativas se notifican a los Titulares clientes según las modalidades indicadas al final del presente documento.

---

## 1. Arquitectura de seguridad

La arquitectura de seguridad de Fibonacci está estructurada en tres niveles concéntricos, cada uno de los cuales implementa controles independientes y complementarios. La lógica de defensa es la de profundidad (*defense in depth*): el fallo de un único nivel no es suficiente para comprometer la confidencialidad, la integridad o la disponibilidad de los datos clínicos.

### 1.1 Nivel de red (perímetro)

El perímetro de red está alojado en la infraestructura de Aruba S.p.A., en red italiana y, por tanto, dentro de la Unión Europea. El tráfico de entrada transita exclusivamente a través de un *reverse proxy* Caddy que finaliza TLS 1.3 y aplica los *headers* de seguridad HTTP descritos en la sección 6. El *backend* aplicativo no está expuesto directamente a Internet público: los contenedores Docker se comunican en una red privada, y el acceso administrativo a los *hosts* está permitido exclusivamente desde direcciones IP autorizadas mediante clave SSH, sin autenticación por contraseña.

**No se interpone ningún intermediario de red.** El dominio del Servicio resuelve directamente en la dirección de la infraestructura descrita anteriormente: no se emplean redes de distribución de contenidos, *proxy* inversos de terceros o *Web Application Firewall* gestionados por terceros, y no existe ningún punto en el que un sujeto distinto del Responsable finalice la conexión cifrada procedente del navegador. Esta circunstancia es verificable desde el exterior mediante una consulta DNS sobre el dominio del Servicio.

### 1.2 Nivel aplicativo

A nivel aplicativo, Fibonacci implementa autenticación multifactor, sesión *hardened*, control de accesos basado en roles (RBAC) y compartimentación FHIR por *tenant* médico. Cada solicitud es validada por *middleware* de saneamiento de *input* en el lado del servidor, control CSRF y *rate limiting* por usuario y por dirección IP. La lógica aplicativa está escrita en lenguajes de tipado fuerte y sigue las prácticas de desarrollo seguro descritas en la sección 7.

### 1.3 Nivel del dato

A nivel del dato, Fibonacci aplica cifrado en dos ejes: cifrado del sistema de archivos a nivel de volumen para toda la instancia PostgreSQL y cifrado aplicativo AES-256 GCM para las columnas que contienen identificadores sensibles y para los archivos de fotos. Las claves de cifrado aplicativas (*Key Encryption Keys*, KEK) se gestionan en el servidor y nunca se transmiten al navegador del médico usuario. Cada operación CRUD sobre los recursos clínicos se registra en un *audit log* inmutable en formato FHIR AuditEvent firmado en *hash-chain* SHA-256 (sección 4).

### 1.4 Diagrama de flujo simplificado

```
                              TLS 1.3, sin intermediarios
   [Navegador médico]  ----------------------------------->  [Caddy reverse proxy / Aruba IT]
                       (cookie httpOnly Secure)                     |
                                                                    |  red privada
                                                                    v
                                                       [Contenedor app Fibonacci]
                                                                    |
                                       +----------------------------+----------------------------+
                                       |                            |                            |
                                       v                            v                            v
                              [PostgreSQL cifrado]      [Almacenamiento fotos AES-256]         [Audit log hash-chain]
                                       |
                                       v
                                  [Backup diario cifrado AES-256]
```

---

## 2. Cifrado

El cifrado es la principal medida de mitigación del riesgo de exfiltración y de acceso no autorizado a los datos. Fibonacci aplica cifrado en tránsito, cifrado en reposo del sistema de archivos y cifrado aplicativo columnar y de *payloads* binarios.

| Componente | Qué hace (WHAT) | Riesgo mitigado (WHY) | Tecnología y parámetros (HOW) |
| --- | --- | --- | --- |
| Transporte cliente-servidor | Cifra toda la comunicación entre el navegador del médico y el *backend* | Interceptación en la red, ataques *man-in-the-middle* | TLS 1.3 con *cipher suite* AEAD recomendadas por IETF, HSTS *preload*, *Forward Secrecy* mediante ECDHE |
| Sistema de archivos de la base de datos | Cifra a nivel de bloque el volumen de la base de datos PostgreSQL | Exfiltración física de los discos, acceso no autorizado al volumen | Cifrado del sistema de archivos a nivel de volumen con claves gestionadas por el sistema *host*, derivadas de una *master key* no residente en la instancia |
| Cifrado aplicativo columnar | Cifra a nivel de aplicación los campos más sensibles de la historia clínica antes de la escritura en la base de datos | Exfiltración de la base de datos, acceso por parte de operadores de la infraestructura | AES-256 GCM con integridad garantizada por el *auth-tag*, *nonce* único por registro, KEK *server-side* |
| Cifrado de fotos clínicas | Cifra los archivos binarios de las fotos antes del almacenamiento | Exfiltración del almacenamiento de objetos, acceso no autorizado a los archivos | AES-256 GCM con KEK gestionada por el *sidecar* pdf-signer, descifrado *on-demand server-side* en el momento de la entrega autorizada |
| *Backup* | Cifra el paquete de *backup* antes de la transferencia *off-site* | Exfiltración del *backup*, pérdida de un soporte | AES-256 sobre el paquete de *snapshot*, clave separada de la KEK aplicativa |

### 2.1 Gestión de claves

Las claves de cifrado aplicativas (*Key Encryption Keys*) se custodian *server-side* y nunca se exponen al navegador del médico usuario. La derivación de las *Data Encryption Keys* (DEK) para cada registro se realiza en memoria en el *backend* en el momento de la operación de escritura o lectura. Las claves no se incluyen en los *backups* en el mismo paquete que los datos cifrados. La rotación de las KEK es un procedimiento documentado y recifra de forma incremental los datos existentes sin interrupción del servicio.

### 2.2 Integridad

El modo GCM (*Galois/Counter Mode*) garantiza simultáneamente confidencialidad e integridad. El *auth-tag* verifica que el *payload* no haya sido alterado y rechaza cualquier intento de manipulación del *ciphertext*. Esta propiedad es especialmente relevante para las fotos clínicas, donde la modificación de un solo bit invalidaría el valor probatorio del dato.

---

## 3. Control de accesos y autenticación

La identidad digital es la principal superficie de ataque de una aplicación sanitaria en la nube. Fibonacci adopta autenticación multifactor, *hashing* robusto de contraseñas, sesión *hardened* y compartimentación del dominio de datos por rol y por FHIR.

### 3.1 Autenticación

| Medida | Qué hace (WHAT) | Riesgo mitigado (WHY) | Cómo (HOW) |
| --- | --- | --- | --- |
| *Hashing* de contraseñas | Almacena solo el *digest* no reversible de la contraseña | Exfiltración de la base de datos de usuarios, *brute force* *offline* | bcrypt con *cost factor* calibrado en función de la carga, *salt* aleatorio por usuario |
| MFA TOTP | Requiere segundo factor al iniciar sesión | Robo de credenciales, reutilización de contraseñas comprometidas, *phishing* | RFC 6238 TOTP a 30 segundos, obligatorio para roles *admin*, recomendado y activable por el médico para su propia cuenta |
| *Recovery codes* | Permite recuperar la cuenta en ausencia del dispositivo TOTP | Pérdida del dispositivo, *lock-out* del usuario | Códigos de un solo uso generados al configurar MFA, *hash-only* en la base de datos, invalidados tras su uso |
| *Rate limiting* de inicio de sesión | Bloquea intentos automatizados | *Brute force*, *credential stuffing* | *Throttling* por IP y por usuario en los *endpoints* de inicio de sesión, verificación de MFA y dictado |

### 3.2 Sesión

Las sesiones de usuario se gestionan mediante *cookies* *httpOnly*, *Secure* y *SameSite=Strict*. El atributo *httpOnly* impide el acceso a la *cookie* desde JavaScript en el lado del cliente, reduciendo el impacto de posibles vulnerabilidades XSS. El atributo *Secure* fuerza la transmisión solo sobre TLS. El atributo *SameSite=Strict* mitiga las clases de ataque de tipo *cross-site request forgery* y *cross-site leak*. El token de sesión está sujeto a rotación: cada elevación de privilegio (inicio de sesión, cambio de contraseña, activación de MFA) emite un nuevo identificador e invalida el anterior.

### 3.3 RBAC y compartimentación

El acceso a los recursos clínicos está regulado por un modelo RBAC con los siguientes roles mínimos:

| Rol | Capacidades típicas |
| --- | --- |
| *admin* | Configuración de la organización, gestión de usuarios, acceso al panel de auditoría, sin acceso clínico por defecto |
| médico | Acceso completo a sus propios pacientes, creación de historias clínicas, dictado, firma de consentimientos |
| secretaría | Acceso a datos administrativos y agenda, acceso clínico limitado según la política del Titular |
| usuario | Perfil mínimo, acceso *self-service* a su propia configuración |

Sobre el modelo RBAC opera la compartimentación FHIR mediante *AccessPolicy* de Medplum: cada médico está aislado en sus propios pacientes, las consultas FHIR se filtran a nivel de servidor y el intento de lectura *cross-tenant* devuelve una denegación, registrada en el *audit log*. La compartimentación es la principal medida de mitigación del riesgo de *lateral movement* y de acceso no autorizado entre consultorios distintos que comparten la misma instancia.

---

## 4. Integridad y trazabilidad

Para las aplicaciones sanitarias, la integridad del dato es funcional a su valor probatorio y clínico. Fibonacci implementa un *audit log* inmutable en formato FHIR AuditEvent con concatenación criptográfica de las entradas (*hash-chain*).

### 4.1 *Audit log*

Cada operación CRUD sobre los recursos FHIR (*Patient*, *Encounter*, *Observation*, *Condition*, *MedicationStatement*, *DocumentReference*, *Consent*, *ImagingStudy* y similares) genera una entrada AuditEvent que contiene:

- identificador del actor (médico, rol, sesión);
- *timestamp* UTC de alta resolución;
- tipo de acción (*create*, *read*, *update*, *delete*, *sign*);
- referencia al recurso involucrado;
- resultado (*success*, *failure*) y razón de la eventual denegación;
- dirección IP de origen y *user agent*.

### 4.2 *Hash-chain*

Cada entrada de auditoría incorpora el *digest* SHA-256 de la entrada anterior, construyendo una cadena de *hash* análoga a un registro *append-only*. Cualquier manipulación retroactiva de una entrada intermedia provocaría la ruptura de la cadena y sería detectable mediante verificación determinista del registro. El *digest* de la última entrada es exportable como prueba de integridad periódica.

### 4.3 Acceso y retención

El *audit log* es accesible para el Titular a través de la sección /audit del área reservada, con filtros por actor, recurso y ventana temporal. La conservación es de diez años desde el evento, en coherencia con la obligación de conservación de la documentación sanitaria. Al vencimiento, el registro se elimina de forma segura o se anonimiza según las instrucciones del Titular.

---

## 5. Disponibilidad y *backup*

La continuidad de acceso a los datos clínicos es una propiedad de seguridad al igual que la confidencialidad y la integridad, y es objeto específico del art. 32, apartado 1, letras b) y c) GDPR.

| Medida | Qué hace (WHAT) | Riesgo mitigado (WHY) | Cómo (HOW) |
| --- | --- | --- | --- |
| *Backup* diario | Guarda un *snapshot* diario de la base de datos y los almacenamientos | Pérdida de datos por incidente, *ransomware*, error operativo | *Snapshot* cifrado AES-256, generado en ventana nocturna de baja carga |
| Retención 30 días | Mantiene 30 versiones *rolling* del *backup* | Exfiltración lenta, corrupción no detectada inmediatamente | Conservación de los paquetes cifrados con rotación a 30 días |
| Archivo continuo de los *log* de transacción | Permite la restauración a un instante preciso y no solo al último *snapshot* nocturno | Pérdida de las horas posteriores al último *backup* | Archivo de los *Write-Ahead Log*, con trabajo planificado cada 5 minutos |
| RPO 24h | Define el punto máximo de pérdida de datos aceptable | Restricción de planificación del *backup* | Garantizado por la frecuencia de *backup* diario |
| RTO 24h | Define el tiempo máximo de restauración del servicio | Restricción de planificación del *disaster recovery* | Procedimiento de restauración documentado, probado trimestralmente con medición del tiempo de recuperación |

### 5.1 Copia *off-site*: límite declarado

⚠️ **A la fecha de esta revisión, la copia de seguridad reside en la misma máquina que protege.** El sistema para la réplica en un proveedor tercero está instalado y activo (el trabajo planificado se ejecuta, y en ausencia de un destino configurado lo registra explícitamente en sus *logs*), pero el destino remoto aún no ha sido adquirido ni configurado. La consecuencia debe exponerse en su totalidad: **hoy, la pérdida del proveedor de *hosting* implicaría la pérdida del sistema y de su copia conjuntamente.**

El límite se declara aquí, y no en una nota a pie de página, porque es precisamente el tipo de información que un Titular debe conocer **antes** de confiar datos a un Responsable, y porque la copia *off-site* es objeto específico del art. 32, apartado 1, letra c) GDPR. El destino remoto será un proveedor **distinto** del que aloja la infraestructura primaria, y situado en la Unión Europea: una copia conservada por el mismo proveedor no es una copia *off-site*.

El presente apartado será sustituido por la descripción de la medida activa cuando esta esté en funcionamiento y verificada.

### 5.2 Pruebas de restauración

Trimestralmente se realiza una prueba de restauración completa a partir del *backup* más reciente, en una instancia no productiva, verificando la integridad del dato restaurado y el tiempo efectivo de recuperación. El resultado de la prueba se registra y conserva como evidencia según el art. 32, apartado 1, letra d) GDPR (procedimiento para probar, verificar y evaluar regularmente la eficacia de las medidas técnicas y organizativas).

---

## 6. *Hardening* aplicativo

Fibonacci adopta una configuración de *hardening* del *front-end* y del *back-end* orientada a reducir la superficie de ataque de las clases OWASP Top 10 más relevantes para aplicaciones web.

| Control | Qué hace (WHAT) | Riesgo mitigado (WHY) | Cómo (HOW) |
| --- | --- | --- | --- |
| *Content Security Policy strict* | Limita las fuentes permitidas para *scripts*, estilos, imágenes y conexiones | *Cross-site scripting*, *data exfiltration* | CSP *strict* sin *inline script*, *allowlist* explícita de las únicas fuentes necesarias |
| HSTS *preload* | Fuerza al navegador a contactar con el dominio solo vía HTTPS, incluso en el primer acceso | *Strip-down* a HTTP, ataques en Wi-Fi no confiable | *Header* Strict-Transport-Security con *max-age* elevado y *flag preload*, dominio inscrito en la *preload list* |
| X-Frame-Options DENY | Prohíbe la inclusión del Servicio en *iframes* externos | *Clickjacking*, *UI redress* | *Header* X-Frame-Options: DENY en cada respuesta del *backend* aplicativo |
| X-Content-Type-Options nosniff | Desactiva el *MIME sniffing* del navegador | Ejecución de contenidos como tipos distintos al declarado | *Header* X-Content-Type-Options: nosniff |
| *Permissions-Policy* | Desactiva APIs del navegador no necesarias (*geolocation*, micrófono donde no se requiere, USB, *serial*, *payment*) | Reducción de la superficie de ataque en el lado del cliente | *Permissions-Policy* restrictiva, activación explícita solo donde la función lo requiere (ej. micrófono solo en la página de dictado) |
| *CSRF token* | Protege las solicitudes mutantes de su emisión *cross-origin* | *Cross-site request forgery* | *Token* CSRF por sesión, validación *server-side* en cada POST, PUT, PATCH, DELETE |
| *Rate limiting* | Limita la frecuencia de las solicitudes en *endpoints* sensibles | *Brute force*, *scraping*, abuso de servicios con coste (dictado) | Límites diferenciados por IP y por usuario en los *endpoints* de inicio de sesión, verificación de MFA, dictado, exportación masiva |
| Saneamiento de *input* | Valida y normaliza cada *input* antes de su uso | *Injection* (SQL, NoSQL, comando), XSS reflejado, *path traversal* | Validación basada en esquemas a nivel de servidor, *parameterized queries* hacia la base de datos, *escaping* de salida *context-aware* |

---

## 7. Desarrollo seguro (*Secure SDLC*)

La seguridad está integrada en el ciclo de desarrollo del software (*Security by Design* ex art. 25 GDPR) mediante controles automáticos y revisión humana en cada modificación del código.

| Fase | Control | Riesgo mitigado (WHY) | Cómo (HOW) |
| --- | --- | --- | --- |
| Pre-*merge* | Revisión de código obligatoria | Defectos lógicos, regresiones de seguridad | Al menos un revisor distinto del autor aprueba cada *pull request* |
| Pre-*merge* | Análisis estático SAST | Vulnerabilidades de patrón (*injection*, *auth bypass*, *secret leak*) | Semgrep y CodeQL ejecutados en cada *pull request*, bloqueo del *merge* en caso de hallazgos *High* o *Critical* |
| Pre-*merge* | Escaneo de dependencias | Vulnerabilidades de librerías de terceros, *supply chain* | npm audit y Dependabot activos, alertas automáticas para CVE altas y críticas, actualización oportuna |
| Pre-*merge* | Pruebas E2E | Regresiones funcionales en flujos críticos | Suite Playwright en los flujos de inicio de sesión, MFA, creación de historia clínica, dictado, consentimiento, exportación |
| Post-*deploy* | *Pen test* OWASP ZAP *baseline* | Vulnerabilidades de *runtime* y de configuración | Ejecución mensual en entorno de producción, *triage* y remediación de hallazgos no falsos positivos |
| Continuo | Formación del equipo | Errores por desinformación, deriva de las prácticas | Formación anual en GDPR + seguridad aplicativa, participación en la comunidad OWASP, *security champion* designado |

Los secretos de producción (claves, *tokens*, contraseñas de servicio) se gestionan mediante el *secret manager* de la infraestructura, nunca están presentes en el código fuente y se rotan periódicamente o tras cualquier sospecha de exposición.

---

## 8. Gestión de incidentes y *data breach*

Fibonacci adopta un procedimiento documentado de respuesta a incidentes que define roles, umbrales de escalada, plazos de notificación y modalidades de comunicación con el Titular.

### 8.1 Notificación al Titular

En caso de violación de datos personales según el art. 4, n. 12 GDPR que involucre datos tratados por cuenta del Titular, Fibonacci notifica al Titular el evento en un plazo de **24 horas desde su descubrimiento**. Este plazo es más estricto que el plazo mínimo de "sin demora injustificada" previsto en el art. 33, apartado 2 GDPR para el Responsable del tratamiento, y tiene como objetivo proporcionar al Titular un margen amplio respecto a las 72 horas del art. 33, apartado 1 para su eventual notificación a la Autoridad de control.

La notificación al Titular incluye, en la medida disponible en el momento de la comunicación inicial:

- descripción de la naturaleza de la violación;
- categorías y número aproximado de interesados y de registros afectados;
- consecuencias probables;
- medidas técnicas y organizativas adoptadas o propuestas para su contención;
- punto de contacto operativo dentro de Fibonacci.

La información faltante en el momento de la primera notificación se transmite al Titular de forma incremental tan pronto como esté disponible, en coherencia con las Directrices EDPB 9/2022.

### 8.2 Escalada y cooperación

El procedimiento interno prevé la activación inmediata de un *incident manager*, el aislamiento del activo afectado, la conservación de las evidencias forenses y la apertura de un registro del incidente. Fibonacci coopera activamente con el Titular en la evaluación del riesgo para los interesados y en la preparación de la eventual notificación a la Autoridad o a los interesados. Al cierre del incidente, se redacta un *post-mortem* compartido con el Titular, que incluye la línea temporal, la causa raíz, las acciones de remedio aplicadas y las acciones correctivas a largo plazo (*lessons learned*).

### 8.3 Registro

Todos los incidentes, independientemente de su calificación final como violación notificable, se registran en el registro interno de incidentes, conservado a efectos de auditoría y como evidencia según el art. 33, apartado 5 GDPR.

---

## 9. Transferencias internacionales

Para el tratamiento de los datos sanitarios de los pacientes, Fibonacci no realiza ninguna transferencia fuera de la Unión Europea. Todo el *stack* aplicativo, la base de datos, el almacenamiento de fotos y los *backups* residen en la infraestructura de Aruba S.p.A., en red italiana.

### 9.1 Ausencia de intermediarios extraeuropeos en el recorrido del dato

El recorrido que realiza el dato clínico entre el navegador del médico y la base de datos **no atraviesa ningún sujeto extraeuropeo**, y no lo hace por construcción y no por configuración: no se emplea ninguna red de distribución de contenidos, ningún *proxy* inverso de terceros ni ningún *Web Application Firewall* gestionado por terceros. El dominio del Servicio resuelve directamente en la dirección de la infraestructura, y la conexión cifrada es finalizada únicamente por el *reverse proxy* del Responsable.

La diferencia respecto al esquema habitual en el sector debe mencionarse porque es la razón por la que este apartado es breve: cuando existe un intermediario, la transferencia extra-UE de los metadatos de red existe y debe justificarse con Cláusulas Contractuales Tipo y medidas suplementarias. Aquí **no existe la transferencia**, por lo que no es necesario justificarla. Esta circunstancia es verificable por cualquiera, desde el exterior y sin nuestro consentimiento, mediante una consulta DNS sobre el dominio del Servicio.

### 9.2 Transferencias residuales y su perímetro

El único subresponsable de la cadena con réplicas de resiliencia fuera de la Unión Europea es el proveedor de pagos indicado en el Anexo B, que **no trata datos de pacientes** ni datos clínicos de ningún tipo: la cadena de pagos está segregada de la clínica y la conciliación se realiza mediante identificador opaco. Para este proveedor son aplicables las Cláusulas Contractuales Tipo de la Decisión de ejecución (UE) 2021/914.

### 9.3 Otros subresponsables extra-UE

Cualquier otro subresponsable extra-UE se autoriza exclusivamente con el consentimiento del Titular según lo dispuesto en el DPA y está sujeto a las mismas garantías (SCC, medidas suplementarias, evaluación del riesgo de transferencia).

---

## 10. Continuidad operativa

⚠️ **Esta sección describía una arquitectura redundante que el Servicio no tiene.** La versión anterior declaraba distribución en múltiples zonas de disponibilidad, varias instancias de *reverse proxy* con *health check* y una réplica en *streaming* de la base de datos con promoción automática. Nada de esto está en funcionamiento: el Servicio se ejecuta en **un solo *host***, y declarar una redundancia inexistente en un anexo técnico suscrito es precisamente el tipo de afirmación que el Titular no puede verificar por sí mismo y sobre la que tiene derecho a no ser engañado.

A continuación, se detalla el estado real, distinguiendo entre lo que está activo y lo que está previsto.

| Componente | Estado | Riesgo mitigado (WHY) | Cómo (HOW) |
| --- | --- | --- | --- |
| Ubicación | **Activo** | Jurisdicción y ley aplicable conocidas y verificables | *Host* único en Aruba S.p.A., red italiana, Unión Europea |
| Aislamiento de red | **Activo** | Reducción de la superficie expuesta | Solo el *reverse proxy* es accesible desde Internet; los servicios aplicativos se comunican en red privada entre contenedores |
| *Backup* diario | **Activo** | Pérdida de datos por incidente, error operativo, *ransomware* | *Snapshot* cifrado nocturno, con rotación a 30 días |
| Restauración a un instante preciso | **Activo** | Pérdida de las horas posteriores al último *snapshot* | Archivo continuo de los *log* de transacción, trabajo planificado cada 5 minutos |
| Prueba de restauración | **Activo** | Un *backup* nunca restaurado no es un *backup* | Trabajo planificado de restauración y verificación, con resultado registrado |
| Copia *off-site* | **Previsto** | Pérdida del proveedor de *hosting* | Véase el límite declarado en el apartado 5.1: sistema instalado, destino remoto aún no activado |
| Redundancia del *host* | **Previsto** | Tolerancia a fallos de la máquina individual | No está en funcionamiento. Un fallo del *host* implica indisponibilidad del Servicio hasta su restauración |
| Plan de continuidad formalizado | **Previsto** | Coordinación de las acciones de restauración | Los procedimientos de restauración están documentados y se ejecutan; su formalización en un plan aprobado es posterior a la constitución de la sociedad |

---

## 11. Formación y gobernanza

La seguridad técnica solo es eficaz si va acompañada de una gobernanza organizativa coherente. Fibonacci integra obligaciones formativas y responsabilidades definidas dentro de su estructura.

| Medida | Qué hace (WHAT) | Riesgo mitigado (WHY) | Cómo (HOW) |
| --- | --- | --- | --- |
| Formación anual | Capacitación del personal técnico en GDPR y seguridad aplicativa | Reducción del error humano, alineación con el estado del arte | Curso anual obligatorio para todo el personal que accede a sistemas que tratan datos personales, certificación conservada |
| *Onboarding* | Lista de verificación de seguridad para nuevos empleados | Alineación inicial con los requisitos de seguridad | Procedimiento formalizado con entrega de credenciales, activación de MFA, lectura de políticas internas, aceptación del código de conducta |
| *Security champion* | Punto de referencia interno para cuestiones de seguridad | Desvío rápido de preguntas técnicas, escalada interna | Designación de un *security champion* dentro del equipo técnico |
| Acceso al código | Principio del mínimo privilegio | Reducción del riesgo de exfiltración interna | Accesos al repositorio y a la infraestructura concedidos por rol, revisión periódica de las autorizaciones |
| Gestión de activos | Inventario de los activos informativos | Conocimiento completo del perímetro a proteger | Inventario actualizado de sistemas, servicios, dependencias y flujos de datos |

---

## 12. Certificaciones y estándares de referencia

En la actualidad, Fibonacci **no está certificada según la norma ISO/IEC 27001**. Aunque carece de dicha certificación, Fibonacci adopta voluntariamente los controles aplicables del Anexo A de la norma ISO/IEC 27001:2022 como marco de referencia para su postura de seguridad, en particular en las áreas de controles organizativos, controles de personas, controles físicos y controles tecnológicos. Esta referencia no constituye una declaración de conformidad certificada y no debe interpretarse como un *claim* de certificación.

### 12.0 Qué está certificado, y por quién: la distinción que importa

Las certificaciones que cubren una parte del Servicio pertenecen al **proveedor de la infraestructura**, no a Fibonacci. La distinción se declara aquí porque es la que un proveedor poco escrupuloso omite, exhibiendo la marca de su proveedor de *hosting* como si fuera propia.

| Nivel | Quién responde | Qué está certificado o declarado | Cómo se verifica |
| --- | --- | --- | --- |
| *Data center* e infraestructura | Aruba S.p.A. | Certificación **ISO/IEC 27001**; adhesión al **CISPE Data Protection Code of Conduct**, código de conducta ex **art. 40 GDPR** aprobado por la CNIL en 2021 | Registro público CISPE; declaraciones publicadas por el proveedor |
| Aplicación, datos, procesos | Fibonacci | **Ninguna certificación de terceros.** Conformidad con el GDPR autodeclarada sobre la base de la documentación interna y las evidencias conservadas | El presente documento, el DPA y el Anexo B, todos públicos y sin formulario de solicitud |

⚠️ **Qué significa esto en la práctica**: el hecho de que el *data center* esté certificado según la norma ISO/IEC 27001 dice algo sobre la seguridad física y organizativa de la sala de servidores, y **nada** sobre la calidad del código aplicativo de Fibonacci, su modelo de control de accesos o su gestión de claves. Quien presenta la certificación de su proveedor de *hosting* como garantía de su software está respondiendo a una pregunta distinta de la que se le ha formulado.

La conformidad con el GDPR, y en particular con los principios de *security by design* y *by default* (art. 25 GDPR) y con las medidas técnicas y organizativas adecuadas (art. 32 GDPR), es autocertificada por el Responsable sobre la base de la documentación interna y las evidencias de proceso conservadas.

Entre los estándares y directrices adicionales considerados en el diseño de las medidas descritas en el presente documento, aunque no sean objeto de certificación, se incluyen:

- OWASP Top 10 2021 y OWASP Application Security Verification Standard (ASVS) para las prácticas de desarrollo seguro y *hardening* aplicativo;
- NIST Special Publication 800-53 para el vocabulario de controles de seguridad;
- Directrices EDPB 9/2022 sobre la notificación de violaciones de datos personales.

### 12.1 Hoja de ruta de certificación

Fibonacci ha establecido como objetivo la evaluación para iniciar el proceso de certificación ISO/IEC 27001 al alcanzar la primera ronda consolidada de clientes piloto del Servicio. El estado de avance de la hoja de ruta se comunica de manera transparente a los Titulares clientes mediante actualizaciones periódicas del presente documento y, cuando proceda, mediante comunicaciones específicas.

### 12.2 Espacio Europeo de Datos Sanitarios: la obligación que llega

El **Reglamento (UE) 2025/327** establece el Espacio Europeo de Datos Sanitarios (EHDS) y define un marco armonizado para los **sistemas de historias clínicas electrónicas**. El reglamento se aplica a partir del **26 de marzo de 2027**; para los sistemas destinados al tratamiento de las categorías prioritarias de datos sanitarios electrónicos personales mencionadas en el art. 14, apartado 1, letras a), b) y c), las disposiciones pertinentes se aplican a partir del **26 de marzo de 2029**.

Para un sistema de historias clínicas electrónicas, el marco previsto por el reglamento implica: redacción de la **documentación técnica** (art. 37), **ficha informativa** que acompaña al sistema (art. 38), **declaración UE de conformidad** respecto a los requisitos esenciales del **Anexo II** (art. 39), evaluación de los componentes de software armonizados en un **entorno digital europeo de pruebas** (art. 40), colocación del **marcado CE de conformidad** (art. 41) y registro en la **base de datos UE** de sistemas de historias clínicas electrónicas (art. 49).

**Fibonacci no es actualmente un sistema con marcado CE según el Capítulo III del Reglamento (UE) 2025/327, y no lo declara.** El marcado no es aplicable hoy: las especificaciones comunes del entorno digital europeo de pruebas y el formato europeo de intercambio de historias clínicas electrónicas se delegan a actos de ejecución de la Comisión.

Lo que sí es posible declarar hoy es el estado del producto respecto a los requisitos del Anexo II que **no dependen** de dichos actos de ejecución:

| Requisito (Anexo II) | Estado | Evidencia |
| --- | --- | --- |
| 2.6 ausencia de características que dificulten la exportación autorizada de los datos para sustituir el sistema por otro producto | **Cumplido** | La exportación íntegra en formato FHIR R4 es una función del producto, disponible para el Titular en cualquier momento y sin autorización del Responsable |
| 3.1 mecanismos fiables de identificación y autenticación de los profesionales sanitarios | **Cumplido** | Apartado 3 del presente documento |
| 3.2 y 3.3 registro de accesos e instrumentos para examinar y analizar sus datos | **Cumplido** | Apartado 4: registro FHIR AuditEvent con concatenación de *hashes*, consultable por el Titular con filtros por actor, recurso y ventana temporal |
| 3.4 soporte a períodos de conservación y derechos de acceso diferenciados por origen y categoría del dato | **Parcial** | Conservación diferenciada activa; la granularidad por origen del dato está en proceso de ampliación |
| 2.1, 2.2, 2.3, 2.4 interoperabilidad en el formato europeo de intercambio | **No aplicable por el momento** | El formato europeo de intercambio se delega a actos de ejecución aún no adoptados. El producto adopta mientras tanto FHIR R4, que es la base técnica sobre la que se construye el formato europeo |

---

## 13. Contactos operativos

| Función | Contacto |
| --- | --- |
| Seguridad informática y reporte de vulnerabilidades | {EMAIL_SICUREZZA} |
| Contacto para la protección de datos | {EMAIL_PRIVACY} |
| Privacidad y cuestiones de tratamiento de datos | {EMAIL_PRIVACY} |

Las notificaciones de vulnerabilidades son bienvenidas y se gestionan de acuerdo con las prácticas de *responsible disclosure*. Es posible, a solicitud del notificante, establecer un canal cifrado mediante clave PGP del equipo de seguridad, proporcionada bajo petición. Fibonacci se compromete a proporcionar una respuesta inicial al notificante en un plazo razonable desde la recepción, a no emprender acciones legales contra notificaciones realizadas de buena fe y dentro del perímetro indicado, y a reconocer públicamente la contribución del notificante salvo solicitud de anonimato.

---

## 14. Última revisión

Última revisión del presente documento: {ULTIMA_REVISIONE}.

> El presente documento tiene carácter descriptivo y está actualizado a la versión actual del software Fibonacci. Las modificaciones técnicas significativas a las medidas de seguridad aquí descritas se notifican a los Titulares clientes por correo electrónico a la dirección de contacto indicada en el Contrato de Servicio, con un preaviso razonable respecto a su entrada en vigor. Versión 0.2.
