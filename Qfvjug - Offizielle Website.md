# Qfvjug - Offizielle Website

Eine moderne, minimalistische YouTube-Kanal-Website mit Dark-Design, React-Frontend, Firebase Realtime Database, Admin-Panel und VIP-Bereich.

## 🌟 Features

### Frontend
- **Modern React App** mit Vite und TypeScript-Support
- **Dark Mode als Standard** mit umschaltbarem Light Mode
- **Vollständig responsive** für Mobile, Tablet und Desktop
- **Tailwind CSS** mit shadcn/ui Komponenten
- **Smooth Animationen** und Hover-Effekte
- **Loading States** und Error Handling

### Seiten & Funktionen
- **Startseite**: Hero-Section mit YouTube-Integration und News-Ticker
- **Videos**: YouTube-Synchronisation mit Kategorien und Favoriten-System
- **Downloads**: Firebase-basierte Verwaltung von Spielen, Mods und Tools
- **VIP-Bereich**: Exklusiver Zugang mit separatem Login-System
- **Kontakt**: Social Media Links und Community-Richtlinien
- **Admin-Panel**: Content-Management mit Firebase Authentication

### Technische Features
- **Firebase Realtime Database** für dynamische Inhalte
- **Firebase Authentication** für Admin-Zugang
- **YouTube Data API v3** Integration
- **LocalStorage** für Favoriten und Einstellungen
- **SEO-optimiert** mit Meta-Tags und semantischem HTML
- **PWA-ready** mit Service Worker Support

### Extras
- **Easter Eggs**: Konami-Code, Achievement-System, Matrix-Effekt
- **QR-Code Generator** im Browser
- **Discord-Integration** (Status-Widget)
- **Push-Notifications** (OneSignal-ready)
- **Accessibility** Features

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+ 
- pnpm (empfohlen) oder npm
- Firebase-Projekt
- YouTube Data API v3 Schlüssel

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd qfvjug-website

# Dependencies installieren
pnpm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
# .env.local mit deinen API-Schlüsseln ausfüllen

# Entwicklungsserver starten
pnpm run dev
```

### Umgebungsvariablen

Erstelle eine `.env.local` Datei im Projektroot:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# YouTube API
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_YOUTUBE_CHANNEL_ID=your_channel_id

# Optional: OneSignal für Push-Notifications
VITE_ONESIGNAL_APP_ID=your_onesignal_app_id
```

## 🔧 Firebase Setup

### 1. Firebase-Projekt erstellen
1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Erstelle ein neues Projekt
3. Aktiviere "Realtime Database"
4. Aktiviere "Authentication" mit E-Mail/Passwort

### 2. Datenbank-Struktur
Die Firebase Realtime Database sollte folgende Struktur haben:

```json
{
  "news": {
    "news_id": {
      "title": "News Titel",
      "content": "News Inhalt",
      "type": "announcement|video|update",
      "priority": "low|medium|high",
      "isVisible": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "downloads": {
    "download_id": {
      "title": "Download Titel",
      "description": "Beschreibung",
      "category": "minecraft|unity|tools|mods",
      "version": "1.0.0",
      "downloadUrl": "https://example.com/download.zip",
      "screenshots": ["url1", "url2"],
      "changelog": "Was ist neu...",
      "downloadCount": 0,
      "isVipOnly": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "vipUsers": {
    "user_id": {
      "username": "vip_user",
      "passwordHash": "hashed_password",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "isActive": true
    }
  }
}
```

### 3. Security Rules
```json
{
  "rules": {
    "news": {
      ".read": true,
      ".write": "auth != null"
    },
    "downloads": {
      ".read": true,
      ".write": "auth != null"
    },
    "vipUsers": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 📱 YouTube API Setup

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. Aktiviere die "YouTube Data API v3"
4. Erstelle API-Credentials (API-Schlüssel)
5. Füge den Schlüssel zu deiner `.env.local` hinzu

## 🎨 Customization

### Design anpassen
- **Farben**: Bearbeite `tailwind.config.js` für Custom Colors
- **Fonts**: Ändere Font-Familie in `src/styles/custom.css`
- **Logo**: Ersetze Logo-Komponenten in `src/components/`

### Inhalte anpassen
- **Texte**: Bearbeite die entsprechenden Komponenten in `src/pages/`
- **Social Media**: Aktualisiere Links in `src/components/Footer.jsx`
- **Kontaktdaten**: Ändere E-Mail in `src/pages/Contact.jsx`

## 🚀 Deployment

### Netlify (Empfohlen)

1. **Repository vorbereiten**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Netlify konfigurieren**:
   - Gehe zu [Netlify](https://netlify.com)
   - Verbinde dein GitHub Repository
   - Build Command: `pnpm run build`
   - Publish Directory: `dist`

3. **Umgebungsvariablen setzen**:
   - Gehe zu Site Settings > Environment Variables
   - Füge alle Variablen aus `.env.local` hinzu

4. **Deploy**:
   - Netlify deployed automatisch bei jedem Push

### Vercel
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel --prod
```

### Andere Hosting-Anbieter
```bash
# Build für Produktion
pnpm run build

# dist/ Ordner auf deinen Hosting-Anbieter hochladen
```

## 🛠 Entwicklung

### Verfügbare Scripts
```bash
# Entwicklungsserver
pnpm run dev

# Production Build
pnpm run build

# Build Preview
pnpm run preview

# Linting
pnpm run lint

# Type Checking
pnpm run type-check
```

### Projektstruktur
```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── ui/             # shadcn/ui Komponenten
│   ├── Layout.jsx      # Haupt-Layout
│   ├── Navigation.jsx  # Navigation
│   └── ...
├── pages/              # Seiten-Komponenten
│   ├── Home.jsx
│   ├── Videos.jsx
│   └── ...
├── contexts/           # React Contexts
│   ├── ThemeContext.jsx
│   └── AuthContext.jsx
├── services/           # API Services
│   ├── firebase.js
│   ├── youtube.js
│   └── database.js
├── utils/              # Utility-Funktionen
├── styles/             # CSS-Dateien
└── App.jsx            # Haupt-App-Komponente
```

## 🔐 Admin-Panel

### Ersten Admin-Benutzer erstellen
1. Gehe zur Firebase Console
2. Authentication > Users
3. Füge einen Benutzer mit E-Mail/Passwort hinzu
4. Navigiere zu `/admin` auf deiner Website
5. Melde dich mit den Credentials an

### Admin-Funktionen
- **News-Verwaltung**: Erstellen, bearbeiten, löschen
- **Downloads-Verwaltung**: Upload und Verwaltung von Dateien
- **VIP-Verwaltung**: VIP-Benutzer erstellen und verwalten
- **Analytics**: Übersicht über Website-Statistiken

## 👑 VIP-System

### VIP-Benutzer erstellen
1. Melde dich im Admin-Panel an
2. Gehe zu "VIP-Verwaltung"
3. Erstelle neue VIP-Zugangsdaten
4. VIPs können sich unter `/vip` anmelden

### VIP-Features
- Exklusive Downloads
- Frühe Releases
- Spezielle News
- Beta-Zugang

## 🎮 Easter Eggs

Die Website enthält verschiedene Easter Eggs:

- **Konami-Code**: ↑↑↓↓←→←→BA
- **Klick-Counter**: 10x auf Logo klicken
- **Achievement-System**: Verschiedene Erfolge freischalten
- **QR-Code Generator**: Versteckt in der Kontakt-Seite
- **Matrix-Effekt**: Wird durch Konami-Code ausgelöst

## 📊 Analytics & Monitoring

### Empfohlene Tools
- **Google Analytics 4**: Website-Traffic
- **Firebase Analytics**: App-Events
- **Sentry**: Error Monitoring
- **Lighthouse**: Performance Monitoring

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe `LICENSE` Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:

1. Prüfe die [FAQ](#häufig-gestellte-fragen) in der Kontakt-Seite
2. Öffne ein Issue auf GitHub
3. Kontaktiere über die Social Media Kanäle

## 🙏 Credits

- **React** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Firebase** - Backend Services
- **Lucide** - Icons
- **YouTube Data API** - Video Integration

---

Made with ❤️ for the Qfvjug community

