import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  Mail, 
  MessageCircle, 
  Youtube, 
  Twitter, 
  Instagram,
  ExternalLink,
  Heart
} from 'lucide-react';

const Contact = () => {
  const socialLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@qfvjug',
      description: 'Hauptkanal mit allen Videos',
      color: 'text-red-500'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      url: 'https://discord.gg/qfvjug',
      description: 'Community Server zum Chatten',
      color: 'text-blue-500'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/qfvjug',
      description: 'Updates und News',
      color: 'text-blue-400'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/qfvjug',
      description: 'Behind the Scenes',
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kontakt</h1>
          <p className="text-muted-foreground text-lg">
            Folge mir auf Social Media oder tritt der Community bei!
          </p>
        </div>

        {/* Social Media Links */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card key={link.name} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${link.color}`} />
                    {link.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {link.description}
                  </p>
                  <Button 
                    className="w-full gap-2 group-hover:gap-3 transition-all"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Besuchen
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Contact */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              Geschäftliche Anfragen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Für Kooperationen, Sponsoring oder andere geschäftliche Anfragen:
            </p>
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              business@qfvjug.com
            </Button>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Community-Richtlinien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Um eine positive und respektvolle Community zu gewährleisten, bitte ich alle um Einhaltung folgender Richtlinien:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Respektvoller Umgang miteinander</li>
              <li>• Keine Beleidigungen oder Hassrede</li>
              <li>• Kein Spam oder Werbung ohne Erlaubnis</li>
              <li>• Konstruktive Kritik ist willkommen</li>
              <li>• Hilfsbereitschaft gegenüber anderen Community-Mitgliedern</li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Häufig gestellte Fragen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Wann kommen neue Videos?</h3>
              <p className="text-muted-foreground">
                Ich versuche regelmäßig neue Videos zu veröffentlichen. Folge mir auf YouTube und aktiviere die Glocke für Benachrichtigungen!
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Kann ich deine Mods/Tools verwenden?</h3>
              <p className="text-muted-foreground">
                Ja! Alle Downloads sind kostenlos verfügbar. Bitte beachte die jeweiligen Nutzungsbedingungen.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Wie werde ich VIP-Mitglied?</h3>
              <p className="text-muted-foreground">
                VIP-Zugänge werden gelegentlich über Gewinnspiele oder spezielle Events vergeben. Folge meinen Social Media Kanälen für Updates!
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Machst du Tutorials?</h3>
              <p className="text-muted-foreground">
                Ja! Schau in der Videos-Sektion nach Tutorials oder schreib mir Vorschläge für neue Tutorial-Themen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Thank You Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-lg text-muted-foreground mb-4">
            <Heart className="h-5 w-5 text-red-500" />
            Vielen Dank für deine Unterstützung!
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-muted-foreground">
            Ohne euch wäre das alles nicht möglich. Ihr seid die beste Community! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

