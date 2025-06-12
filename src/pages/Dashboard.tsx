import React, { useState } from 'react';
import Header from '@/components/Header';
import DomainManagement from '@/components/dashboard/DomainManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Shield, Server, Plus } from 'lucide-react';
import AddDomainModal from '@/components/dashboard/AddDomainModal';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  nsStatus: 'connected' | 'pending' | 'error';
  sslMode: 'flexible' | 'full' | 'strict';
  sslStatus: 'active' | 'pending' | 'error';
  nsServers: string[];
  createdAt: string;
}

const Dashboard = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'example.com',
      status: 'active',
      nsStatus: 'connected',
      sslMode: 'full',
      sslStatus: 'active',
      nsServers: ['ns1.clouddns.ru', 'ns2.clouddns.ru'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'test-site.org',
      status: 'pending',
      nsStatus: 'pending',
      sslMode: 'flexible',
      sslStatus: 'pending',
      nsServers: ['ns1.clouddns.ru', 'ns2.clouddns.ru'],
      createdAt: '2024-01-20'
    }
  ]);
  
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const user = {
    email: 'user@example.com',
    name: 'Пользователь'
  };

  const handleLogout = () => {
    console.log('Выход из системы');
  };

  const handleSettingsClick = () => {
    console.log('Настройки аккаунта');
  };

  const handleAddDomain = (domainName: string) => {
    const newDomain: Domain = {
      id: Date.now().toString(),
      name: domainName,
      status: 'pending',
      nsStatus: 'pending',
      sslMode: 'flexible',
      sslStatus: 'pending',
      nsServers: ['ns1.clouddns.ru', 'ns2.clouddns.ru'],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDomains([...domains, newDomain]);
    setShowAddModal(false);
  };

  const stats = {
    totalDomains: domains.length,
    activeDomains: domains.filter(d => d.status === 'active').length,
    sslCertificates: domains.filter(d => d.sslStatus === 'active').length,
    pendingDomains: domains.filter(d => d.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onSettingsClick={handleSettingsClick} 
      />
      
      <main className="container mx-auto px-6 py-8">
        {selectedDomain ? (
          <div>
            <DomainManagement 
              domain={selectedDomain} 
              onBack={() => setSelectedDomain(null)} 
            />
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Панель управления</h1>
                <p className="text-muted-foreground">
                  Управляйте своими доменами и SSL сертификатами
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/api-docs'}
                  className="order-2 sm:order-1"
                >
                  📡 API Docs
                </Button>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="order-1 sm:order-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить домен
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего доменов</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDomains}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные домены</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeDomains}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SSL сертификаты</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.sslCertificates}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">В ожидании</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingDomains}</div>
                </CardContent>
              </Card>
            </div>

            {/* Domains List */}
            <Card>
              <CardHeader>
                <CardTitle>Мои домены</CardTitle>
              </CardHeader>
              <CardContent>
                {domains.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Нет доменов</h3>
                    <p className="text-muted-foreground mb-4">
                      Добавьте свой первый домен для управления DNS и SSL
                    </p>
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить домен
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {domains.map((domain) => (
                      <div 
                        key={domain.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer gap-4"
                        onClick={() => setSelectedDomain(domain)}
                      >
                        <div className="flex items-center space-x-4">
                          <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div>
                            <h3 className="font-semibold">{domain.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Добавлен: {domain.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                          <div className="text-center">
                            <div className={`inline-block px-2 py-1 text-xs rounded-full ${
                              domain.status === 'active' ? 'bg-green-100 text-green-800' :
                              domain.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {domain.status === 'active' ? 'Активен' :
                               domain.status === 'pending' ? 'Ожидание' : 'Ошибка'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={`inline-block px-2 py-1 text-xs rounded-full ${
                              domain.sslStatus === 'active' ? 'bg-blue-100 text-blue-800' :
                              domain.sslStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              SSL: {domain.sslStatus === 'active' ? 'Активен' :
                                   domain.sslStatus === 'pending' ? 'Ожидание' : 'Ошибка'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <AddDomainModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddDomain}
      />
    </div>
  );
};

export default Dashboard;
