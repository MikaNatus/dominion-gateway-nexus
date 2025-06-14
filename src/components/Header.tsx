
import React from 'react';
import { User, LogOut, Settings, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  user?: {
    email: string;
    name?: string;
    plan?: 'free' | 'premium';
  };
  onLogout?: () => void;
  onSettingsClick?: () => void;
  onSubscriptionClick?: () => void;
}

const Header = ({ user, onLogout, onSettingsClick, onSubscriptionClick }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">CloudDNS</h1>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Domain Management Platform
          </span>
        </div>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <div className="hidden sm:block text-left">
                  <div className="text-sm">{user.email}</div>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant={user.plan === 'premium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.plan === 'premium' ? 'Премиум' : 'Бесплатный'}
                    </Badge>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">{user.email}</p>
                <Badge 
                  variant={user.plan === 'premium' ? 'default' : 'secondary'}
                  className="text-xs w-fit"
                >
                  {user.plan === 'premium' ? 'Премиум план' : 'Бесплатный план'}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSubscriptionClick}>
                <CreditCard className="h-4 w-4 mr-2" />
                Тарифные планы
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="h-4 w-4 mr-2" />
                Настройки аккаунта
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
