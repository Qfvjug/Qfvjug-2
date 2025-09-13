import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { 
  Youtube, 
  MessageCircle, 
  Twitter, 
  Instagram,
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@qfvjug',
      color: 'hover:text-red-500'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      url: 'https://discord.gg/qfvjug',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/qfvjug',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/qfvjug',
      color: 'hover:text-pink-500'
    }
  ];

  const footerLinks = [
    { label: 'Startseite', path: '/' },
    { label: 'Videos', path: '/videos' },
    { label: 'Downloads', path: '/downloads' },
    { label: 'VIP', path: '/vip' },
    { label: 'Kontakt', path: '/contact' }
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Q</span>
              </div>
              <span className="font-bold text-xl">Qfvjug</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Willkommen auf der offiziellen Website von Qfvjug! 
              Hier findest du alle meine Videos, Downloads und exklusive VIP-Inhalte.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>for the community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Social Media</h3>
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 h-auto p-2 ${social.color}`}
                    onClick={() => window.open(social.url, '_blank')}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{social.name}</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Qfvjug. Alle Rechte vorbehalten.
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <Link 
              to="/impressum" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Impressum
            </Link>
            <Link 
              to="/datenschutz" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Datenschutz
            </Link>
          </div>
        </div>

        {/* Easter Egg Hint */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground/50">
            🥚 Psst... es gibt versteckte Easter Eggs auf dieser Seite!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

