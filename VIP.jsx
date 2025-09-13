import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Crown, 
  Lock, 
  Star, 
  Download, 
  Eye, 
  LogOut,
  Calendar,
  User,
  Gift,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { vipService } from '../services/database.js';
import { formatDate, formatRelativeDate } from '../utils/helpers.js';

const VIP = () => {
  const { vipUser, isVip, loginVip, logoutVip } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [vipContent, setVipContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isVip) {
      loadVipContent();
    }
  }, [isVip]);

  const loadVipContent = async () => {
    try {
      setLoading(true);
      const content = await vipService.getVipContent();
      setVipContent(content);
    } catch (error) {
      console.error('Error loading VIP content:', error);
      setError('Fehler beim Laden der VIP-Inhalte');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginVip(loginForm.username, loginForm.password);
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      setError('Ungültige Anmeldedaten. Bitte überprüfe Benutzername und Passwort.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutVip();
    setVipContent([]);
  };

  const VipLoginForm = () => (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <Card className="border-2 border-gradient-to-r from-yellow-400 to-orange-500">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">VIP-Bereich</CardTitle>
            <p className="text-muted-foreground">
              Melde dich mit deinen VIP-Zugangsdaten an
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600" 
                disabled={loading}
              >
                <Lock className="h-4 w-4" />
                {loading ? 'Anmeldung...' : 'Anmelden'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                VIP-Vorteile
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Exklusive Downloads und frühe Releases</li>
                <li>• Spezielle VIP-News und Updates</li>
                <li>• Zugang zu Beta-Versionen</li>
                <li>• Prioritärer Support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const VipDashboard = () => (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">VIP-Bereich</h1>
              <p className="text-muted-foreground">Willkommen zurück, {vipUser.username}!</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 gap-1">
              <Star className="h-3 w-3" />
              VIP-Mitglied
            </Badge>
            <span className="text-sm text-muted-foreground">
              Mitglied seit {formatDate(vipUser.createdAt)}
            </span>
          </div>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </div>

        {/* VIP Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Exklusive Inhalte</h3>
              <p className="text-2xl font-bold text-primary">{vipContent.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Letzter Login</h3>
              <p className="text-sm text-muted-foreground">
                {vipUser.lastLogin ? formatRelativeDate(vipUser.lastLogin) : 'Erster Login'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">VIP-Status</h3>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                Aktiv
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* VIP Content */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Exklusive VIP-Inhalte
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Inhalte werden geladen...</p>
            </div>
          ) : vipContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Noch keine VIP-Inhalte</h3>
              <p className="text-muted-foreground">
                Neue exklusive Inhalte werden bald verfügbar sein!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vipContent.map((content) => (
                <Card key={content.id} className="border-2 border-gradient-to-r from-yellow-400/20 to-orange-500/20 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {content.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                            VIP Exklusiv
                          </Badge>
                          <Badge variant="outline">{content.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {content.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Screenshots Preview */}
                      {content.screenshots && content.screenshots.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {content.screenshots.slice(0, 3).map((screenshot, index) => (
                            <img
                              key={index}
                              src={screenshot}
                              alt={`Screenshot ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}

                      {/* Info Row */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          {content.fileSize && <span>{content.fileSize}</span>}
                        </div>
                        <span>{formatDate(content.createdAt)}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {content.downloadUrl && (
                          <Button 
                            className="flex-1 gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600" 
                            onClick={() => window.open(content.downloadUrl, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return isVip ? <VipDashboard /> : <VipLoginForm />;
};

export default VIP;

