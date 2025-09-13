import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  FileText, 
  Package,
  Star,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { downloadsService } from '../services/database.js';
import { formatDate, formatFileSize, debounce } from '../utils/helpers.js';

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [filteredDownloads, setFilteredDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDownload, setSelectedDownload] = useState(null);

  const categories = [
    { id: 'all', name: 'Alle Downloads', icon: Package },
    { id: 'minecraft', name: 'Minecraft', icon: Package },
    { id: 'unity', name: 'Unity', icon: Package },
    { id: 'tools', name: 'Tools', icon: Package },
    { id: 'other', name: 'Sonstiges', icon: Package }
  ];

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const downloadData = await downloadsService.getAll();
        // Nur sichtbare Downloads anzeigen
        const visibleDownloads = downloadData.filter(download => download.isVisible);
        setDownloads(visibleDownloads);
        setFilteredDownloads(visibleDownloads);
      } catch (error) {
        console.error('Error loading downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDownloads();
  }, []);

  // Debounced search function
  const debouncedSearch = debounce((term, category) => {
    let filtered = downloads;

    // Nach Kategorie filtern
    if (category !== 'all') {
      filtered = filtered.filter(download => download.category === category);
    }

    // Nach Suchbegriff filtern
    if (term) {
      filtered = filtered.filter(download =>
        download.title.toLowerCase().includes(term.toLowerCase()) ||
        download.description.toLowerCase().includes(term.toLowerCase()) ||
        download.tags?.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      );
    }

    setFilteredDownloads(filtered);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, downloads]);

  const handleDownload = async (download) => {
    try {
      // Download-Counter erhöhen
      await downloadsService.incrementDownloadCount(download.id);
      
      // Download starten
      window.open(download.downloadUrl, '_blank');
      
      // Downloads-Liste aktualisieren
      const updatedDownloads = downloads.map(d => 
        d.id === download.id 
          ? { ...d, downloadCount: (d.downloadCount || 0) + 1 }
          : d
      );
      setDownloads(updatedDownloads);
      setFilteredDownloads(updatedDownloads.filter(d => 
        selectedCategory === 'all' || d.category === selectedCategory
      ));
    } catch (error) {
      console.error('Error handling download:', error);
      // Fallback: Download trotzdem starten
      window.open(download.downloadUrl, '_blank');
    }
  };

  const DownloadCard = ({ download }) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {download.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{download.category}</Badge>
              <Badge variant="outline">v{download.version}</Badge>
              {download.isVipOnly && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                  VIP
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2">
          {download.description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Screenshots Preview */}
          {download.screenshots && download.screenshots.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {download.screenshots.slice(0, 3).map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedDownload(download)}
                />
              ))}
              {download.screenshots.length > 3 && (
                <div 
                  className="w-20 h-20 bg-muted rounded border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setSelectedDownload(download)}
                >
                  <span className="text-sm text-muted-foreground">
                    +{download.screenshots.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {download.tags && download.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {download.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {download.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{download.tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Info Row */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{download.fileSize}</span>
              <span>{download.downloadCount || 0} Downloads</span>
            </div>
            <span>{formatDate(download.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1 gap-2" 
              onClick={() => handleDownload(download)}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{download.title}</DialogTitle>
                </DialogHeader>
                <DownloadDetails download={download} onDownload={handleDownload} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DownloadDetails = ({ download, onDownload }) => (
    <div className="space-y-6">
      {/* Screenshots Gallery */}
      {download.screenshots && download.screenshots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Screenshots
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {download.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-full aspect-video object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Beschreibung</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {download.description}
        </p>
      </div>

      {/* Requirements */}
      {download.requirements && download.requirements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Systemanforderungen</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {download.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Changelog */}
      {download.changelog && download.changelog.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Changelog
          </h3>
          <div className="space-y-4">
            {download.changelog.slice(0, 3).map((change, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">v{change.version}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(change.date)}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {change.changes.map((changeItem, changeIndex) => (
                    <li key={changeIndex}>{changeItem}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Button */}
      <div className="flex gap-4 pt-4 border-t">
        <Button 
          size="lg" 
          className="flex-1 gap-2" 
          onClick={() => onDownload(download)}
        >
          <Download className="h-5 w-5" />
          Download ({download.fileSize})
        </Button>
        <div className="text-sm text-muted-foreground flex flex-col justify-center">
          <span>{download.downloadCount || 0} Downloads</span>
          <span>Version {download.version}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Downloads werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Downloads</h1>
          <p className="text-muted-foreground text-lg">
            Mods, Tools und andere Downloads für deine Projekte
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Downloads durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-3 w-3" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Downloads Grid */}
        {filteredDownloads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Keine Downloads gefunden</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Versuche andere Suchbegriffe oder Filter'
                : 'Es sind noch keine Downloads verfügbar'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDownloads.map((download) => (
              <DownloadCard key={download.id} download={download} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;

