# Come il sito arriva online

Il sito è `output: 'export'` di Next: **file statici**, nessun runtime. Dal 2026-08-11 non sta più
su GitHub Pages ma sul **VPS `188.213.175.26`** (Aruba, farm in Italia), servito da **Caddy**.

## Perché la configurazione è versionata, ma NON qui

Perché una configurazione che vive solo su un server è un pezzo di infrastruttura che **nessun
clone ha**. È il difetto registrato in TD-63 del knowledge — *«14 file untracked in `/opt/emr`…
o entra in git o resta una mina»* — e vale identico qui: se la macchina si perde, con lei si perde
il modo di rimetterla in piedi.

🔴 **Ma la copia stava in due repo, e il 2026-08-19 si è misurato quanto costa** (TD-256): la copia
che stava qui era **quella che girava davvero** sulla macchina, e portandocela sopra aveva
cancellato in silenzio la correzione TD-153 sulla cache — `/assets/*` rispondeva
`cache-control: no-store` da internet, cioè ogni visita riscaricava l'intero pacchetto dell'app.
⇒ La sorgente è **una sola**, `EMR/infra/caddy/Caddyfile.aruba`, e un controllo ogni 6 ore la
confronta con la macchina. Qui resta un file di rimando: ⛔ non rimetterci una copia.

## I pezzi

| dove | cosa |
|---|---|
| `EMR/infra/caddy/Caddyfile.aruba` | la configurazione del server, **sorgente unica** (TD-256) |
| `infra/Caddyfile` | ⛔ **non è più una configurazione**: solo un rimando alla riga sopra |
| `/var/www/fibonaccimedica` sulla macchina | il contenuto, cioè `out/` costruito |
| `NEXT_PUBLIC_DOMINIO_SITO` | l'interruttore: toglie il prefisso, porta `SITE_URL` sul dominio |

## Rilasciare a mano

    NEXT_PUBLIC_DOMINIO_SITO=fibonaccimedica.it npm run build
    rsync -az --delete out/ root@188.213.175.26:/var/www/fibonaccimedica/

⚠️ **Se cambi il Caddyfile, ricordati di ricaricare**: `systemctl reload caddy`. L'ho imparato
sbagliando — l'installazione avvia Caddy con la configurazione di default, e copiare la propria
*dopo* non basta: `systemctl enable --now` su un servizio già attivo non ricarica niente, e il
sito continuava a mostrare la pagina di benvenuto di Caddy.

## Cosa manca

Il **DNS**: record A di `fibonaccimedica.it` → `188.213.175.26`. Finché punta altrove Caddy non può
emettere il certificato (fallisce la validazione ACME) — è atteso e riprova da solo.
