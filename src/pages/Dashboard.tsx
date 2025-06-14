import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import DomainManagement from '@/components/dashboard/DomainManagement';
import AddDomainModal from '@/components/dashboard/AddDomainModal';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import UserSettingsModal from '@/components/user/UserSettingsModal';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  sslMode: 'proxy' | 'direct';
  records: number;
  lastUpdated: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'premium' as 'free' | 'premium',
  };

  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'example.com',
      status: 'active',
      sslMode: 'proxy',
      records: 5,
      lastUpdated: '2024-01-14 14:30',
    },
    {
      id: '2',
      name: 'test.com',
      status: 'pending',
      sslMode: 'direct',
      records: 2,
      lastUpdated: '2024-01-13 18:00',
    },
    {
      id: '3',
      name: 'demo.net',
      status: 'error',
      sslMode: 'direct',
      records: 10,
      lastUpdated: '2024-01-12 09:45',
    },
  ]);

  const handleAddDomain = (domainName: string) => {
    const newDomain: Domain = {
      id: String(domains.length + 1),
      name: domainName,
      status: 'pending',
      sslMode: 'direct',
      records: 0,
      lastUpdated: 'Just now',
    };
    setDomains([...domains, newDomain]);
    setIsAddDomainOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSettingsClick = () => {
    setIsUserSettingsOpen(true);
  };

  const handleSubscriptionClick = () => {
    setIsSubscriptionOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
        onSubscriptionClick={handleSubscriptionClick}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Панель управления</h1>
          <Button onClick={() => setIsAddDomainOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить домен
          </Button>
        </div>

        <DomainManagement domains={domains} />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Что дальше?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ознакомьтесь с API или добавьте свой первый домен.
            </p>
            <div className="mt-4 flex space-x-4">
              <Button variant="outline" onClick={() => navigate('/api-docs')}>
                <FileText className="w-4 h-4 mr-2" />
                API Документация
              </Button>
              <Button onClick={() => setIsAddDomainOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить домен
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <AddDomainModal
        isOpen={isAddDomainOpen}
        onClose={() => setIsAddDomainOpen(false)}
        onAddDomain={handleAddDomain}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
