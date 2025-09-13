import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Play, Users, Bell, ExternalLink } from 'lucide-react';
import { getSubscriberCount, getLatestVideos } from '../services/youtube.js';
import { newsService } from '../services/database.js';
import { formatRelativeDate } from '../utils/helpers.js';

const Home = () => {
  const [subscriberCount, setSubscriberCount] = useState({ count: 'Lädt...', raw: 0 });
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Abonnentenzahl laden
        const subCount = await getSubscriberCount();
        setSubscriberCount(subCount);

        // Neuestes Video als Featured Video laden
        const videos = await getLatestVideos(1);
        if (videos.length > 0) {
          setFeaturedVideo(videos[0]);
        }

        // News laden
        const newsData = await newsService.getAll();
        setNews(newsData.slice(0, 5)); // Nur die neuesten 5 News
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lädt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Qfvjug
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Willkommen auf der offiziellen Website
          </p>
          
          {/* Subscriber Count */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">{subscriberCount.count}</span>
              <span className="text-muted-foreground">Abonnenten</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Neueste Videos
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Bell className="h-5 w-5" />
              Benachrichtigungen aktivieren
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      {featuredVideo && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Neuestes Video</h2>
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={featuredVideo.thumbnail} 
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group hover:bg-black/40 transition-colors cursor-pointer">
                  <Button size="lg" className="gap-2 opacity-90 group-hover:opacity-100">
                    <Play className="h-6 w-6" />
                    Video ansehen
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{featuredVideo.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {featuredVideo.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeDate(featuredVideo.publishedAt)}
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Auf YouTube ansehen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* News Ticker Section */}
      {news.length > 0 && (
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Neueste Updates</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                        {item.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeDate(item.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Entdecke mehr</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Play className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Videos</h3>
                <p className="text-muted-foreground">
                  Alle meine YouTube-Videos in Kategorien sortiert
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">DL</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Downloads</h3>
                <p className="text-muted-foreground">
                  Mods, Tools und andere Downloads
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">VIP</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">VIP-Bereich</h3>
                <p className="text-muted-foreground">
                  Exklusive Inhalte für VIP-Mitglieder
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

