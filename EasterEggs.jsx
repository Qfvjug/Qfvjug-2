import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Sparkles, 
  Gift, 
  Star, 
  Heart, 
  Zap,
  Rocket,
  Crown,
  Diamond
} from 'lucide-react';

// Konami Code Easter Egg
export const useKonamiCode = () => {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  const [keySequence, setKeySequence] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeySequence(prev => {
        const newSequence = [...prev, event.code].slice(-konamiCode.length);
        
        if (newSequence.length === konamiCode.length && 
            newSequence.every((key, index) => key === konamiCode[index])) {
          setKonamiActivated(true);
          // Reset nach 5 Sekunden
          setTimeout(() => setKonamiActivated(false), 5000);
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return konamiActivated;
};

// Click Counter Easter Egg
export const useClickCounter = (threshold = 10) => {
  const [clickCount, setClickCount] = useState(0);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);

  const handleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= threshold && !easterEggTriggered) {
        setEasterEggTriggered(true);
        setTimeout(() => {
          setEasterEggTriggered(false);
          setClickCount(0);
        }, 3000);
      }
      return newCount;
    });
  };

  return { clickCount, easterEggTriggered, handleClick };
};

// Floating Hearts Animation
export const FloatingHearts = ({ show, onComplete }) => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (show) {
      const newHearts = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        delay: Math.random() * 2
      }));
      
      setHearts(newHearts);
      
      setTimeout(() => {
        setHearts([]);
        onComplete?.();
      }, 4000);
    }
  }, [show, onComplete]);

  if (!show || hearts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-bounce"
          style={{
            left: heart.x,
            top: heart.y,
            animationDelay: `${heart.delay}s`,
            animationDuration: '3s'
          }}
        >
          <Heart className="h-6 w-6 text-red-500 fill-current" />
        </div>
      ))}
    </div>
  );
};

// Sparkle Effect
export const SparkleEffect = ({ show, children }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 5
        };
        
        setSparkles(prev => [...prev, newSparkle]);
        
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000);
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setSparkles([]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [show]);

  return (
    <div className="relative">
      {children}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size
          }}
        >
          <Sparkles className="h-full w-full text-yellow-400 fill-current" />
        </div>
      ))}
    </div>
  );
};

// Secret Achievement System
export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState(
    JSON.parse(localStorage.getItem('qfvjug-achievements') || '[]')
  );

  const achievementsList = [
    {
      id: 'first_visit',
      title: 'Willkommen!',
      description: 'Erste Website-Besuche',
      icon: Star,
      condition: () => true
    },
    {
      id: 'konami_master',
      title: 'Konami-Meister',
      description: 'Konami-Code eingegeben',
      icon: Zap,
      condition: () => false // Wird extern getriggert
    },
    {
      id: 'click_master',
      title: 'Klick-Meister',
      description: '100 Klicks erreicht',
      icon: Rocket,
      condition: () => false // Wird extern getriggert
    },
    {
      id: 'theme_switcher',
      title: 'Theme-Wechsler',
      description: '10x Theme gewechselt',
      icon: Crown,
      condition: () => false // Wird extern getriggert
    },
    {
      id: 'explorer',
      title: 'Entdecker',
      description: 'Alle Seiten besucht',
      icon: Diamond,
      condition: () => false // Wird extern getriggert
    }
  ];

  const unlockAchievement = (achievementId) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const newUnlocked = [...unlockedAchievements, achievementId];
      setUnlockedAchievements(newUnlocked);
      localStorage.setItem('qfvjug-achievements', JSON.stringify(newUnlocked));
      
      const achievement = achievementsList.find(a => a.id === achievementId);
      if (achievement) {
        setAchievements(prev => [...prev, achievement]);
        setTimeout(() => {
          setAchievements(prev => prev.filter(a => a.id !== achievementId));
        }, 5000);
      }
    }
  };

  return {
    achievements,
    unlockedAchievements,
    unlockAchievement,
    achievementsList
  };
};

// Achievement Notification
export const AchievementNotification = ({ achievements }) => {
  if (achievements.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map(achievement => {
        const Icon = achievement.icon;
        return (
          <Card key={achievement.id} className="animate-slide-in-right border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400 rounded-full">
                  <Icon className="h-4 w-4 text-yellow-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Achievement freigeschaltet!
                  </h4>
                  <p className="text-sm font-medium">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// QR Code Generator Easter Egg
export const QRCodeGenerator = () => {
  const [showQR, setShowQR] = useState(false);
  const [qrText, setQrText] = useState('');

  const generateQR = () => {
    const text = qrText || window.location.href;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    return qrUrl;
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => setShowQR(!showQR)}
        variant="outline"
        className="gap-2"
      >
        <Gift className="h-4 w-4" />
        QR-Code Generator
      </Button>
      
      {showQR && (
        <Card className="p-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Text für QR-Code (leer = aktuelle URL)"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="text-center">
              <img 
                src={generateQR()} 
                alt="QR Code" 
                className="mx-auto border rounded"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Discord Status Widget (Mock)
export const DiscordStatus = () => {
  const [status, setStatus] = useState({
    online: true,
    activity: 'Coding the website',
    members: 1337
  });

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${status.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <div>
          <p className="font-medium">Discord Status</p>
          <p className="text-sm text-muted-foreground">{status.activity}</p>
          <p className="text-xs text-muted-foreground">{status.members} Mitglieder online</p>
        </div>
      </div>
    </Card>
  );
};

// Matrix Rain Effect (für Konami Code)
export const MatrixRain = ({ show }) => {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    if (show) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
      const columns = Math.floor(window.innerWidth / 20);
      
      const newDrops = Array.from({ length: columns }, (_, i) => ({
        id: i,
        x: i * 20,
        y: Math.random() * window.innerHeight,
        speed: Math.random() * 3 + 1,
        char: characters[Math.floor(Math.random() * characters.length)]
      }));
      
      setDrops(newDrops);
      
      const interval = setInterval(() => {
        setDrops(prev => prev.map(drop => ({
          ...drop,
          y: drop.y > window.innerHeight ? 0 : drop.y + drop.speed,
          char: Math.random() > 0.95 ? 
            characters[Math.floor(Math.random() * characters.length)] : 
            drop.char
        })));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setDrops([]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show || drops.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 bg-black/80">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="absolute text-green-400 font-mono text-sm"
          style={{
            left: drop.x,
            top: drop.y,
            textShadow: '0 0 10px #00ff00'
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  );
};

export default {
  useKonamiCode,
  useClickCounter,
  FloatingHearts,
  SparkleEffect,
  useAchievements,
  AchievementNotification,
  QRCodeGenerator,
  DiscordStatus,
  MatrixRain
};

