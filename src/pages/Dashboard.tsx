
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import DomainManagement from '@/components/dashboard/DomainManagement';
import DomainCard from '@/components/dashboard/DomainCard';
import AddDomainModal from '@/components/dashboard/AddDomainModal';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import UserSettingsModal from '@/components/user/UserSettingsModal';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  nsStatus: 'connected' | 'pending' | 'error';
  sslMode: 'proxy' | 'direct';
  sslStatus: 'active' | 'pending' | 'error';
  nsServers: string[];
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

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
      nsStatus: 'connected',
      sslMode: 'proxy',
      sslStatus: 'active',
      nsServers: ['ns1.clouddns.com', 'ns2.clouddns.com'],
      createdAt: '2024-01-14T14:30:00Z',
    },
    {
      id: '2',
      name: 'test.com',
      status: 'pending',
      nsStatus: 'pending',
      sslMode: 'direct',
      sslStatus: 'pending',
      nsServers: ['ns1.clouddns.com', 'ns2.clouddns.com'],
      createdAt: '2024-01-13T18:00:00Z',
    },
    {
      id: '3',
      name: 'demo.net',
      status: 'error',
      nsStatus: 'error',
      sslMode: 'direct',
      sslStatus: 'error',
      nsServers: ['ns1.clouddns.com', 'ns2.clouddns.com'],
      createdAt: '2024-01-12T09:45:00Z',
    },
  ]);

  const handleAddDomain = (domainName: string) => {
    const newDomain: Domain = {
      id: String(domains.length + 1),
      name: domainName,
      status: 'pending',
      nsStatus: 'pending',
      sslMode: 'direct',
      sslStatus: 'pending',
      nsServers: ['ns1.clouddns.com', 'ns2.clouddns.com'],
      createdAt: new Date().toISOString(),
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

  const handleManageDomain = (domain: Domain) => {
    setSelectedDomain(domain);
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
  };

  // If a domain is selected, show the domain management view
  if (selectedDomain) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          user={user}
          onLogout={handleLogout}
          onSettingsClick={handleSettingsClick}
          onSubscriptionClick={handleSubscriptionClick}
        />
        <main className="container mx-auto px-4 py-8">
          <DomainManagement 
            domain={selectedDomain} 
            onBack={handleBackToDomains}
          />
        </main>

        <SubscriptionModal
          isOpen={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
        />

        <UserSettingsModal
          isOpen={isUserSettingsOpen}
          onClose={() => setIsUserSettingsOpen(false)}
          user={user}
        />
      </div>
    );
  }

  // Default dashboard view with domain list
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

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onManage={handleManageDomain}
            />
          ))}
        </div>

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
        onAdd={handleAddDomain}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Dashboard;
