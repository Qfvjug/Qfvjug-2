# Firebase Realtime Database Struktur

Diese Datei dokumentiert die Struktur der Firebase Realtime Database für die Qfvjug Website.

## Datenstruktur

```json
{
  "news": {
    "news_id_1": {
      "title": "Neues Video ist online!",
      "content": "Schaut euch mein neuestes Minecraft-Video an...",
      "type": "video", // "video", "announcement", "update"
      "priority": "high", // "low", "medium", "high"
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "isVisible": true
    }
  },
  
  "downloads": {
    "download_id_1": {
      "title": "Awesome Minecraft Mod",
      "description": "Eine tolle Mod für Minecraft mit vielen Features...",
      "category": "minecraft", // "minecraft", "unity", "tools", "other"
      "version": "1.2.0",
      "downloadUrl": "https://example.com/download/mod.zip",
      "fileSize": "15.2 MB",
      "screenshots": [
        "https://example.com/screenshot1.jpg",
        "https://example.com/screenshot2.jpg"
      ],
      "changelog": [
        {
          "version": "1.2.0",
          "date": "2024-01-15",
          "changes": [
            "Neue Features hinzugefügt",
            "Bugs behoben"
          ]
        }
      ],
      "requirements": [
        "Minecraft 1.20+",
        "Forge 47.0+"
      ],
      "tags": ["minecraft", "mod", "adventure"],
      "downloadCount": 1250,
      "createdAt": "2024-01-10T14:20:00.000Z",
      "updatedAt": "2024-01-15T09:15:00.000Z",
      "isVisible": true,
      "isVipOnly": false
    }
  },
  
  "vip-users": {
    "vip_user_id_1": {
      "username": "vip_user_1",
      "password": "hashed_password_here", // In Produktion sollte das gehashed sein
      "createdAt": "2024-01-01T12:00:00.000Z",
      "lastLogin": "2024-01-15T08:30:00.000Z"
    }
  },
  
  "vip-content": {
    "vip_content_id_1": {
      "title": "Exklusiver VIP Download",
      "description": "Nur für VIP-Mitglieder verfügbar...",
      "type": "download", // "download", "news", "video"
      "downloadUrl": "https://example.com/vip/exclusive.zip",
      "fileSize": "25.8 MB",
      "screenshots": [
        "https://example.com/vip_screenshot1.jpg"
      ],
      "createdAt": "2024-01-12T16:45:00.000Z",
      "updatedAt": "2024-01-12T16:45:00.000Z"
    }
  }
}
```

## Datentypen und Validierung

### News
- **title**: String (max 200 Zeichen)
- **content**: String (max 2000 Zeichen)
- **type**: Enum ["video", "announcement", "update"]
- **priority**: Enum ["low", "medium", "high"]
- **isVisible**: Boolean
- **createdAt/updatedAt**: ISO 8601 Timestamp

### Downloads
- **title**: String (max 100 Zeichen)
- **description**: String (max 1000 Zeichen)
- **category**: Enum ["minecraft", "unity", "tools", "other"]
- **version**: String (Semantic Versioning)
- **downloadUrl**: String (URL)
- **fileSize**: String (z.B. "15.2 MB")
- **screenshots**: Array of URLs
- **changelog**: Array of Objects
- **requirements**: Array of Strings
- **tags**: Array of Strings
- **downloadCount**: Number
- **isVisible**: Boolean
- **isVipOnly**: Boolean

### VIP Users
- **username**: String (unique, max 50 Zeichen)
- **password**: String (gehashed in Produktion)
- **createdAt**: ISO 8601 Timestamp
- **lastLogin**: ISO 8601 Timestamp (nullable)

### VIP Content
- **title**: String (max 200 Zeichen)
- **description**: String (max 1000 Zeichen)
- **type**: Enum ["download", "news", "video"]
- **downloadUrl**: String (URL, optional)
- **fileSize**: String (optional)
- **screenshots**: Array of URLs (optional)

## Firebase Security Rules

```javascript
{
  "rules": {
    // News - Lesen für alle, Schreiben nur für authentifizierte Admins
    "news": {
      ".read": true,
      ".write": "auth != null"
    },
    
    // Downloads - Lesen für alle, Schreiben nur für authentifizierte Admins
    "downloads": {
      ".read": true,
      ".write": "auth != null"
    },
    
    // VIP Users - Nur für authentifizierte Admins
    "vip-users": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    
    // VIP Content - Nur für authentifizierte Admins
    "vip-content": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Indizierung

Für bessere Performance sollten folgende Indizes erstellt werden:

- `news`: Sortierung nach `createdAt` (descending)
- `downloads`: Sortierung nach `createdAt` (descending)
- `downloads`: Filter nach `category`
- `downloads`: Filter nach `isVisible`
- `vip-content`: Sortierung nach `createdAt` (descending)

