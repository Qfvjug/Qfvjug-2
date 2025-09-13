import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { 
  Settings, 
  Lock, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Users,
  FileText,
  Download,
  Crown,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { newsService, downloadsService, vipService } from '../services/database.js';
import { formatDate, formatRelativeDate } from '../utils/helpers.js';
import Loading from '../components/Loading.jsx';

const Admin = () => {
  const { adminUser, isAdmin, loginAdmin, logoutAdmin } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;

  function AdminLogin() {
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        await loginAdmin(loginForm.email, loginForm.password);
        setLoginForm({ email: '', password: '' });
      } catch (error) {
        setError('Ungültige Anmeldedaten. Bitte überprüfe E-Mail und Passwort.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Admin-Panel</CardTitle>
              <p className="text-muted-foreground">
                Melde dich mit deinen Admin-Zugangsdaten an
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
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
                  className="w-full gap-2" 
                  disabled={loading}
                >
                  <Lock className="h-4 w-4" />
                  {loading ? 'Anmeldung...' : 'Anmelden'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function AdminDashboard() {
    const [news, setNews] = useState([]);
    const [downloads, setDownloads] = useState([]);
    const [vipUsers, setVipUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        setLoading(true);
        const [newsData, downloadsData, vipData] = await Promise.all([
          newsService.getAll(),
          downloadsService.getAll(),
          vipService.getAll()
        ]);
        
        setNews(newsData);
        setDownloads(downloadsData);
        setVipUsers(vipData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <Loading fullScreen text="Admin-Daten werden geladen..." />;
    }

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Admin-Panel
              </h1>
              <p className="text-muted-foreground">
                Willkommen zurück, {adminUser.email}
              </p>
            </div>
            <Button variant="outline" onClick={logoutAdmin} className="gap-2">
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
              <TabsTrigger value="vip">VIP-Verwaltung</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <OverviewTab news={news} downloads={downloads} vipUsers={vipUsers} />
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <NewsTab news={news} setNews={setNews} />
            </TabsContent>

            <TabsContent value="downloads" className="mt-6">
              <DownloadsTab downloads={downloads} setDownloads={setDownloads} />
            </TabsContent>

            <TabsContent value="vip" className="mt-6">
              <VipTab vipUsers={vipUsers} setVipUsers={setVipUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
};

// Overview Tab Component
const OverviewTab = ({ news, downloads, vipUsers }) => {
  const stats = [
    {
      title: 'News-Artikel',
      value: news.length,
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      title: 'Downloads',
      value: downloads.length,
      icon: Download,
      color: 'text-green-500'
    },
    {
      title: 'VIP-Benutzer',
      value: vipUsers.length,
      icon: Crown,
      color: 'text-yellow-500'
    },
    {
      title: 'Gesamt-Downloads',
      value: downloads.reduce((sum, d) => sum + (d.downloadCount || 0), 0),
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Neueste News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {news.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeDate(item.createdAt)}
                    </p>
                  </div>
                  <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beliebte Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {downloads
                .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.downloadCount || 0} Downloads
                      </p>
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// News Tab Component
const NewsTab = ({ news, setNews }) => {
  const [editingNews, setEditingNews] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveNews = async (newsData) => {
    try {
      if (editingNews) {
        const updated = await newsService.update(editingNews.id, newsData);
        setNews(prev => prev.map(n => n.id === editingNews.id ? updated : n));
      } else {
        const newNews = await newsService.add(newsData);
        setNews(prev => [newNews, ...prev]);
      }
      setIsDialogOpen(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDeleteNews = async (id) => {
    if (confirm('Bist du sicher, dass du diese News löschen möchtest?')) {
      try {
        await newsService.delete(id);
        setNews(prev => prev.filter(n => n.id !== id));
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News-Verwaltung</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingNews(null)}>
              <Plus className="h-4 w-4" />
              Neue News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'News bearbeiten' : 'Neue News erstellen'}
              </DialogTitle>
            </DialogHeader>
            <NewsForm 
              news={editingNews} 
              onSave={handleSaveNews}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                      {item.type}
                    </Badge>
                    <Badge variant="outline">{item.priority}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-2 line-clamp-2">
                    {item.content}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Erstellt: {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingNews(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteNews(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// News Form Component
const NewsForm = ({ news, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    type: news?.type || 'announcement',
    priority: news?.priority || 'medium',
    isVisible: news?.isVisible ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titel</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Inhalt</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Typ</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="announcement">Ankündigung</SelectItem>
              <SelectItem value="update">Update</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priorität</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Niedrig</SelectItem>
              <SelectItem value="medium">Mittel</SelectItem>
              <SelectItem value="high">Hoch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isVisible"
          checked={formData.isVisible}
          onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
        />
        <Label htmlFor="isVisible">Sichtbar</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          Speichern
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
          <X className="h-4 w-4" />
          Abbrechen
        </Button>
      </div>
    </form>
  );
};

// Downloads Tab Component (simplified for brevity)
const DownloadsTab = ({ downloads, setDownloads }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Downloads-Verwaltung</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer Download
        </Button>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Downloads-Verwaltung wird implementiert...</p>
      </div>
    </div>
  );
};

// VIP Tab Component (simplified for brevity)
const VipTab = ({ vipUsers, setVipUsers }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">VIP-Verwaltung</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer VIP-Benutzer
        </Button>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">VIP-Verwaltung wird implementiert...</p>
      </div>
    </div>
  );
};

export default Admin;

