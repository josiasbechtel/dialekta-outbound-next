# Supabase Setup fuer Dialekta Outbound

Diese Version schreibt echte Daten in Supabase.

## 1. Supabase Tabellen neu anlegen

In Supabase:

1. Links auf **SQL Editor**
2. **New query**
3. Inhalt aus `supabase/schema.sql` komplett einfuegen
4. **Run** klicken

Wichtig: Das Script setzt die Dashboard-Tabellen sauber neu auf. Da aktuell noch keine echten Daten drin sind, ist das die einfachste und sicherste Variante.

## 2. Vercel Environment Variables

In Vercel unter **Project Settings > Environment Variables** diese zwei Variablen setzen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ebjuheaxtahepllhwhfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DEIN_GANZER_KEY
```

Nicht den Secret Key verwenden.

## 3. Redeploy

In Vercel:

1. **Deployments**
2. Beim letzten Deployment auf die drei Punkte
3. **Redeploy**

## 4. Test

Nach dem Redeploy:

1. App oeffnen
2. Demo-Daten laden oder manuellen Lead erstellen
3. Supabase > Table Editor pruefen

Erwartung:

- `staged_leads`: importierte, noch nicht uebernommene Leads
- `leads`: uebernommene/finale Leads
- `call_runs`: gestartete oder geplante Anrufdurchlaeufe
- `call_run_leads`: Zuordnung der Leads zu Durchlaeufen
- `appointments`: Termine
- `lead_events`: automatische Snapshots/Aenderungsprotokoll
- `import_batches`: Import-Gruppe
