# Come il sito arriva online

Il sito è `output: 'export'` di Next: **file statici**, nessun runtime. Dal 2026-08-11 non sta più
su GitHub Pages ma sul **VPS `188.213.175.26`** (Aruba, farm in Italia), servito da **Caddy**.

## Perché la configurazione sta QUI e non solo sulla macchina

Perché una configurazione che vive solo su un server è un pezzo di infrastruttura che **nessun
clone ha**. È il difetto registrato in TD-63 del knowledge — *«14 file untracked in `/opt/emr`…
o entra in git o resta una mina»* — e vale identico qui: se la macchina si perde, con lei si perde
il modo di rimetterla in piedi.

## I pezzi

| dove | cosa |
|---|---|
| `infra/Caddyfile` | la configurazione del server (questo file → `/etc/caddy/Caddyfile`) |
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
