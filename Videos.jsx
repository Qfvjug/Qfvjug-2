import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Play, Heart, Search, Filter, ExternalLink, Clock } from 'lucide-react';
import { getLatestVideos } from '../services/youtube.js';
import { favorites, formatRelativeDate, debounce } from '../utils/helpers.js';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Alle Videos', color: 'default' },
    { id: 'minecraft', name: 'Minecraft', color: 'green' },
    { id: 'unity', name: 'Unity', color: 'blue' },
    { id: 'challenges', name: 'Challenges', color: 'orange' },
    { id: 'tutorials', name: 'Tutorials', color: 'purple' },
    { id: 'gaming', name: 'Gaming', color: 'red' }
  ];

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoData = await getLatestVideos(24);
        setVideos(videoData);
        setFilteredVideos(videoData);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    // Favoriten-Videos aktualisieren
    const favoriteIds = favorites.get();
    const favVideos = videos.filter(video => favoriteIds.includes(video.id));
    setFavoriteVideos(favVideos);
  }, [videos]);

  // Debounced search function
  const debouncedSearch = debounce((term, category) => {
    let filtered = videos;

    // Nach Kategorie filtern
    if (category !== 'all') {
      filtered = filtered.filter(video => 
        video.category?.toLowerCase() === category || 
        video.title.toLowerCase().includes(category)
      );
    }

    // Nach Suchbegriff filtern
    if (term) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(term.toLowerCase()) ||
        video.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, videos]);

  const toggleFavorite = (videoId) => {
    favorites.toggle(videoId);
    const favoriteIds = favorites.get();
    const favVideos = videos.filter(video => favoriteIds.includes(video.id));
    setFavoriteVideos(favVideos);
  };

  const VideoCard = ({ video, showFavoriteButton = true }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Button 
            size="lg" 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2"
            onClick={() => window.open(video.url, '_blank')}
          >
            <Play className="h-5 w-5" />
            Ansehen
          </Button>
        </div>
        {video.category && (
          <Badge 
            className="absolute top-2 left-2" 
            variant="secondary"
          >
            {video.category}
          </Badge>
        )}
        {showFavoriteButton && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(video.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${favorites.isFavorite(video.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatRelativeDate(video.publishedAt)}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 h-auto p-1"
            onClick={() => window.open(video.url, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
            YouTube
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Videos werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Videos</h1>
          <p className="text-muted-foreground text-lg">
            Alle meine YouTube-Videos in einer Übersicht
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Videos durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-1"
              >
                <Filter className="h-3 w-3" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="all">Alle Videos ({filteredVideos.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favoriten ({favoriteVideos.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold mb-2">Keine Videos gefunden</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Versuche andere Suchbegriffe oder Filter'
                    : 'Es sind noch keine Videos verfügbar'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            {favoriteVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold mb-2">Keine Favoriten</h3>
                <p className="text-muted-foreground">
                  Markiere Videos als Favoriten, um sie hier zu sehen
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteVideos.map((video) => (
                  <VideoCard key={video.id} video={video} showFavoriteButton={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Videos;

