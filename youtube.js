// YouTube API Service
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'demo-key';
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCdemo';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Holt die Abonnentenzahl des Kanals
 */
export const getSubscriberCount = async () => {
  try {
    if (YOUTUBE_API_KEY === 'demo-key') {
      // Demo-Daten für Entwicklung
      return { count: '42.5K', raw: 42500 };
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscriber count');
    }
    
    const data = await response.json();
    const subscriberCount = data.items[0]?.statistics?.subscriberCount;
    
    if (!subscriberCount) {
      throw new Error('No subscriber count found');
    }
    
    return {
      count: formatNumber(parseInt(subscriberCount)),
      raw: parseInt(subscriberCount)
    };
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    return { count: 'N/A', raw: 0 };
  }
};

/**
 * Holt die neuesten Videos des Kanals
 */
export const getLatestVideos = async (maxResults = 12) => {
  try {
    if (YOUTUBE_API_KEY === 'demo-key') {
      // Demo-Daten für Entwicklung
      return generateDemoVideos(maxResults);
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const data = await response.json();
    
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

/**
 * Holt Video-Details inklusive Statistiken
 */
export const getVideoDetails = async (videoId) => {
  try {
    if (YOUTUBE_API_KEY === 'demo-key') {
      return generateDemoVideoDetails(videoId);
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const data = await response.json();
    const video = data.items[0];
    
    if (!video) {
      throw new Error('Video not found');
    }
    
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      viewCount: formatNumber(parseInt(video.statistics.viewCount)),
      likeCount: formatNumber(parseInt(video.statistics.likeCount)),
      url: `https://www.youtube.com/watch?v=${video.id}`
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

/**
 * Formatiert Zahlen für die Anzeige
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Generiert Demo-Videos für Entwicklung
 */
const generateDemoVideos = (count) => {
  const categories = ['Minecraft', 'Unity', 'Challenges', 'Tutorials', 'Gaming'];
  const videos = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    videos.push({
      id: `demo-video-${i}`,
      title: `${category} Video #${i + 1} - Awesome Content`,
      description: `Ein tolles ${category} Video mit spannenden Inhalten...`,
      thumbnail: `https://picsum.photos/320/180?random=${i}`,
      publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      url: `https://www.youtube.com/watch?v=demo-video-${i}`,
      category: category
    });
  }
  
  return videos;
};

/**
 * Generiert Demo-Video-Details
 */
const generateDemoVideoDetails = (videoId) => {
  return {
    id: videoId,
    title: 'Demo Video - Awesome Content',
    description: 'Ein tolles Demo-Video mit spannenden Inhalten...',
    thumbnail: 'https://picsum.photos/640/360?random=1',
    publishedAt: new Date().toISOString(),
    viewCount: '12.3K',
    likeCount: '456',
    url: `https://www.youtube.com/watch?v=${videoId}`
  };
};

