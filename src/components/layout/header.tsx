import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Bell, User, Film, Menu, Home, Star, Heart, Edit } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Movies', href: '/movies', icon: Film },
    { label: 'Reviews', href: '/review/new', icon: Edit },
    { label: 'Watchlist', href: '/watchlist', icon: Heart },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden text-white hover:text-primary p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-white font-playfair text-xl">
                    Navigation
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 space-y-4">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-primary/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <span className="text-xl sm:text-2xl font-playfair font-bold text-white text-glow">
                CineReview
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navigationItems.map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className={
                  item.href === '/' 
                    ? "text-white hover:text-primary transition-colors" 
                    : "text-gray-300 hover:text-primary transition-colors"
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search */}
         
          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button size="sm" variant="ghost" className="text-white hover:text-primary p-2">
              <Search className="w-4 h-4 lg:hidden" />
            </Button>
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer" onClick={() => window.location.href = '/profile'}>
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}