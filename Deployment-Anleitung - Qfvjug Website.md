# Deployment-Anleitung - Qfvjug Website

## 🚀 Schritt-für-Schritt Deployment auf Netlify

### 1. Repository vorbereiten

```bash
# Stelle sicher, dass alle Änderungen committed sind
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Firebase-Projekt einrichten

#### Firebase Console Setup
1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Gib "qfvjug-website" als Projektname ein
4. Aktiviere Google Analytics (optional)
5. Erstelle das Projekt

#### Realtime Database aktivieren
1. Gehe zu "Realtime Database" im Firebase-Menü
2. Klicke auf "Datenbank erstellen"
3. Wähle "Im Testmodus starten" (später auf Produktionsregeln ändern)
4. Wähle eine Region (z.B. europe-west1)

#### Authentication einrichten
1. Gehe zu "Authentication" > "Sign-in method"
2. Aktiviere "E-Mail/Passwort"
3. Gehe zu "Users" und füge den ersten Admin-Benutzer hinzu

#### Firebase-Konfiguration abrufen
1. Gehe zu Projekteinstellungen (Zahnrad-Symbol)
2. Scrolle zu "Deine Apps" und klicke auf "Web-App hinzufügen"
3. Gib "Qfvjug Website" als App-Name ein
4. Kopiere die Firebase-Konfiguration

### 3. YouTube API einrichten

#### Google Cloud Console
1. Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. Gehe zu "APIs & Services" > "Bibliothek"
4. Suche nach "YouTube Data API v3" und aktiviere sie
5. Gehe zu "Anmeldedaten" > "Anmeldedaten erstellen" > "API-Schlüssel"
6. Kopiere den API-Schlüssel

#### YouTube-Kanal-ID finden
1. Gehe zu deinem YouTube-Kanal
2. Klicke auf "Kanal anpassen"
3. Gehe zu "Erweiterte Einstellungen"
4. Kopiere die Kanal-ID

### 4. Netlify Deployment

#### Netlify Account erstellen
1. Gehe zu [Netlify](https://netlify.com)
2. Registriere dich oder melde dich an
3. Verbinde dein GitHub-Konto

#### Site erstellen
1. Klicke auf "New site from Git"
2. Wähle GitHub als Git-Provider
3. Wähle dein qfvjug-website Repository
4. Konfiguriere Build-Einstellungen:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (in netlify.toml oder Environment Variables)

#### Umgebungsvariablen setzen
1. Gehe zu Site Settings > Environment Variables
2. Füge folgende Variablen hinzu:

```env
VITE_FIREBASE_API_KEY=dein_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=dein-projekt.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://dein-projekt-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=dein-projekt-id
VITE_FIREBASE_STORAGE_BUCKET=dein-projekt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_YOUTUBE_API_KEY=dein_youtube_api_key
VITE_YOUTUBE_CHANNEL_ID=deine_kanal_id
```

#### Deploy starten
1. Klicke auf "Deploy site"
2. Warte auf den Build-Prozess
3. Deine Website ist unter der generierten Netlify-URL verfügbar

### 5. Custom Domain (Optional)

#### Domain konfigurieren
1. Gehe zu Site Settings > Domain management
2. Klicke auf "Add custom domain"
3. Gib deine Domain ein (z.B. qfvjug.com)
4. Folge den DNS-Konfigurationsanweisungen

#### SSL-Zertifikat
1. Netlify aktiviert automatisch Let's Encrypt SSL
2. Warte auf die Zertifikatserstellung (kann bis zu 24h dauern)

### 6. Firebase Security Rules

#### Produktions-Regeln setzen
```json
{
  "rules": {
    "news": {
      ".read": true,
      ".write": "auth != null && auth.token.email_verified == true"
    },
    "downloads": {
      ".read": true,
      ".write": "auth != null && auth.token.email_verified == true"
    },
    "vipUsers": {
      ".read": "auth != null && auth.token.email_verified == true",
      ".write": "auth != null && auth.token.email_verified == true"
    }
  }
}
```

### 7. Erste Inhalte hinzufügen

#### Admin-Panel nutzen
1. Gehe zu deiner-domain.com/admin
2. Melde dich mit dem Firebase-Admin-Account an
3. Füge erste News-Artikel hinzu
4. Lade Downloads hoch
5. Erstelle VIP-Benutzer

#### Test-Daten hinzufügen
Du kannst auch direkt in der Firebase Console Test-Daten hinzufügen:

```json
{
  "news": {
    "welcome": {
      "title": "Willkommen auf der neuen Website!",
      "content": "Die neue Qfvjug Website ist online! Hier findest du alle Videos, Downloads und exklusive VIP-Inhalte.",
      "type": "announcement",
      "priority": "high",
      "isVisible": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

## 🔧 Troubleshooting

### Häufige Probleme

#### Build-Fehler
```bash
# Lokaler Test vor Deployment
pnpm run build
pnpm run preview
```

#### Firebase-Verbindungsfehler
- Überprüfe alle Umgebungsvariablen
- Stelle sicher, dass die Firebase-Regeln korrekt sind
- Prüfe die Firebase-Konsole auf Fehler

#### YouTube API-Fehler
- Überprüfe API-Schlüssel und Kanal-ID
- Stelle sicher, dass die YouTube Data API aktiviert ist
- Prüfe API-Quotas in der Google Cloud Console

### Performance-Optimierung

#### Netlify-Optimierungen
```toml
# netlify.toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Firebase-Optimierungen
- Verwende Firebase-Indizes für bessere Query-Performance
- Implementiere Caching für häufig abgerufene Daten
- Nutze Firebase-Funktionen für komplexe Backend-Logik

## 📊 Monitoring & Analytics

### Empfohlene Tools einrichten

#### Google Analytics 4
1. Erstelle GA4-Property
2. Füge Tracking-Code hinzu
3. Konfiguriere Events und Conversions

#### Sentry für Error Monitoring
```bash
pnpm add @sentry/react @sentry/vite-plugin
```

#### Lighthouse CI für Performance
```bash
pnpm add -D @lhci/cli
```

## 🔄 Continuous Deployment

### Automatische Deployments
Netlify deployed automatisch bei jedem Push zum main-Branch.

### Branch-Deployments
- Feature-Branches werden als Preview-Deployments erstellt
- Pull Requests erhalten automatische Deploy-Previews

### Rollback-Strategie
1. Gehe zu Netlify Dashboard > Deploys
2. Wähle eine frühere Version
3. Klicke auf "Publish deploy"

## 🛡️ Sicherheit

### Wichtige Sicherheitsmaßnahmen
1. **Umgebungsvariablen**: Niemals API-Schlüssel im Code committen
2. **Firebase Rules**: Produktionsregeln verwenden
3. **HTTPS**: Immer SSL/TLS verwenden
4. **Headers**: Security-Headers konfigurieren
5. **Updates**: Regelmäßige Dependency-Updates

### Security Checklist
- [ ] Firebase Security Rules konfiguriert
- [ ] API-Schlüssel als Umgebungsvariablen
- [ ] HTTPS aktiviert
- [ ] Security Headers gesetzt
- [ ] Dependencies aktuell
- [ ] Admin-Zugang gesichert

## 📈 Nach dem Deployment

### Wichtige nächste Schritte
1. **Content hinzufügen**: News, Downloads, VIP-Inhalte
2. **SEO optimieren**: Meta-Tags, Sitemap, robots.txt
3. **Analytics einrichten**: Google Analytics, Firebase Analytics
4. **Monitoring aktivieren**: Uptime-Monitoring, Error-Tracking
5. **Backup-Strategie**: Firebase-Backups konfigurieren

### Wartung
- Regelmäßige Updates der Dependencies
- Monitoring der Firebase-Quotas
- Performance-Überwachung
- Content-Updates über Admin-Panel

---

🎉 **Herzlichen Glückwunsch!** Deine Qfvjug Website ist jetzt live!

