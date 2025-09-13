import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Menu, 
  Home, 
  Play, 
  Download, 
  Crown, 
  Mail, 
  Sun, 
  Moon,
  Settings,
  LogOut
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isVip, vipUser, logoutVip, isAdmin, logoutAdmin } = useAuth();

  const navItems = [
    { path: '/', label: 'Startseite', icon: Home },
    { path: '/videos', label: 'Videos', icon: Play },
    { path: '/downloads', label: 'Downloads', icon: Download },
    { path: '/vip', label: 'VIP', icon: Crown, badge: isVip ? 'Aktiv' : null },
    { path: '/contact', label: 'Kontakt', icon: Mail }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item, mobile = false }) => {
    const Icon = item.icon;
    const isActive = isActivePath(item.path);
    
    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsOpen(false)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
          ${isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
          ${mobile ? 'w-full justify-start' : ''}
        `}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Q</span>
            </div>
            <span className="font-bold text-xl">Qfvjug</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* User Status */}
            {isVip && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full border border-yellow-400/20">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{vipUser.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logoutVip}
                  className="h-6 w-6 p-0 hover:bg-red-500/10"
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            )}

            {isAdmin && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Admin</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logoutAdmin}
                  className="h-6 w-6 p-0 hover:bg-red-500/10"
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">Q</span>
                    </div>
                    <span className="font-bold text-xl">Qfvjug</span>
                  </div>

                  {/* User Status Mobile */}
                  {(isVip || isAdmin) && (
                    <div className="py-4 border-b space-y-2">
                      {isVip && (
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg border border-yellow-400/20">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{vipUser.username}</span>
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs">
                              VIP
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={logoutVip}
                            className="h-8 w-8 p-0"
                          >
                            <LogOut className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      {isAdmin && (
                        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-primary" />
                            <span className="font-medium">Admin</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={logoutAdmin}
                            className="h-8 w-8 p-0"
                          >
                            <LogOut className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <div className="flex-1 py-4">
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <NavLink key={item.path} item={item} mobile />
                      ))}
                    </div>
                  </div>

                  {/* Mobile Footer */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="gap-2"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="h-4 w-4" />
                            Hell
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" />
                            Dunkel
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

