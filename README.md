# Kakometer

Kakometer er en statisk nettside som kan hostes på GitHub Pages og lagrer kakedata i Supabase.

## Supabase-oppsett

1. Opprett et Supabase-prosjekt.
2. Gå til SQL Editor i Supabase.
3. Kjør innholdet i `supabase-schema.sql`.
4. Gå til Project Settings -> API.
5. Kopier `Project URL` og `anon public` key.

## Lokal config

Lag en lokal `.env` basert på `.env.example`:

```bash
cp .env.example .env
```

Fyll inn verdiene:

```env
SUPABASE_URL=https://din-prosjekt-id.supabase.co
SUPABASE_ANON_KEY=din-anon-public-key
```

Generer `config.js`:

```bash
node build-config.mjs
```

Åpne deretter `index.html`, eller server mappen lokalt.

## GitHub Pages

Legg inn disse som repository secrets i GitHub:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

Workflowen i `.github/workflows/pages.yml` genererer `config.js` fra secrets og deployer siden til GitHub Pages.

I repoets Pages-innstillinger bør Source settes til GitHub Actions.

## Viktig om tilgang

Supabase `anon public` key er ment å brukes i nettleseren, så den blir synlig for brukere av nettsiden selv om den kommer fra `.env`/GitHub Secrets. Sikkerheten må derfor ligge i Supabase Row Level Security policies.

Oppsettet i `supabase-schema.sql` lar alle som kan åpne siden lese, legge til og slette kaker. Hvis siden skal være offentlig, bør neste steg være Supabase Auth eller en liten serverless-funksjon med passordbeskyttet skriving.
