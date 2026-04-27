# Supabase Setup für Dialekta Outbound Dashboard

Diese Version speichert Leads, Import-Liste, Live-Queue und aktuellen Call-State direkt in Supabase, sobald die beiden ENV-Variablen gesetzt sind.

## 1. Projekt erstellen

1. Öffne https://supabase.com
2. Klicke auf **New project**
3. Name zum Beispiel: `dialekta-outbound`
4. Region wählen, Passwort setzen, Projekt erstellen

## 2. Tabellen automatisch anlegen

1. In Supabase links auf **SQL Editor** gehen
2. **New query** öffnen
3. Den ganzen Inhalt aus `supabase/schema.sql` einfügen
4. Auf **Run** klicken

Danach hast du diese Tabellen:

- `staged_leads`: importierte, aber noch nicht übernommene Leads
- `leads`: übernommene Leads mit Status, Termin, Notizen, Zusammenfassung
- `live_queues`: geplante oder laufende Anruflisten
- `live_queue_leads`: Verbindung zwischen Queue und Lead
- `dashboard_settings`: aktueller Call-State
- `lead_events`: vorbereitet für spätere Ereignis-Historie
- `export_logs`: vorbereitet für spätere Export-Protokolle

## 3. Supabase Keys kopieren

1. Links unten auf **Project Settings**
2. Dann **API**
3. Kopiere:
   - **Project URL**
   - **anon public key**

## 4. Lokal verbinden

Im Projekt eine Datei `.env.local` erstellen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=DEIN_ANON_PUBLIC_KEY
```

Dann installieren und starten:

```bash
npm install
npm run dev
```

## 5. Vercel verbinden

1. Vercel Projekt öffnen
2. **Settings**
3. **Environment Variables**
4. Diese zwei Variablen anlegen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Danach in Vercel **Redeploy** auslösen

## 6. Testen

1. App öffnen
2. Einen Lead hinzufügen oder Demo-Daten importieren
3. In Supabase links auf **Table Editor** gehen
4. Tabelle `staged_leads` oder `leads` öffnen
5. Du solltest die Daten sehen

## Wichtiger Sicherheitshinweis

Das SQL ist bewusst sehr einfach gehalten, damit es sofort funktioniert. Die Tabellen sind mit dem anon key schreibbar. Für einen öffentlichen Produktivbetrieb sollte danach Supabase Auth ergänzt werden, damit nur berechtigte Nutzer schreiben dürfen.
