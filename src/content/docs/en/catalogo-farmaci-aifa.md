# Drug Catalog: How It's Updated

The Fibonacci drug catalog comes from **AIFA** and contains approximately 159,000 entries.
It is not compiled manually: an automatic process imports and keeps it aligned.

The **Drugs catalog (status)** page in the admin area shows how the last import went.
It is reserved for the administrator role.

## What the page shows

- **Status of the last execution**: completed, in progress, or failed.
- **When it occurred** and **how long it took**.
- **How many entries** were read, added, or updated.
- **The error**, if any, with the reason.

When an import is **in progress**, the page refreshes automatically every thirty
seconds: there is no need to reload it. A full import takes about forty minutes,
so seeing it "in progress" for a long time is normal.

## "Force sync now" is disabled, and it's intentional

The button is there but not clickable. An import requires significant resources and
takes tens of minutes: starting it from a web interface, possibly twice by mistake,
would slow down the medical record during office hours. Synchronization is scheduled,
and it is forced from the server when truly needed.

## What to do if the import fails

The catalog **remains the one from the last successful import**: no drugs disappear,
and prescribing continues to work. A failure is not an emergency:
it means the catalog ages, not that it empties.

If the status remains failed for several days, report it: the cause is almost always
upstream (the AIFA source unreachable), and it is visible in the reason shown on the page.
