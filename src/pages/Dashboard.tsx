import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import DomainManagement from '@/components/dashboard/DomainManagement';
import AddDomainModal from '@/components/dashboard/AddDomainModal';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import UserSettingsModal from '@/components/user/UserSettingsModal';
import { Plus, FileText, Globe, Shield, ShieldCheck, AlertCircle, Settings, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const itemsPerPage = 10;

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

  // Pagination logic
  const paginatedDomains = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return domains.slice(startIndex, endIndex);
  }, [domains, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(domains.length / itemsPerPage);

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

  const handleSelectDomain = (domainId: string, checked: boolean) => {
    if (checked) {
      setSelectedDomains([...selectedDomains, domainId]);
    } else {
      setSelectedDomains(selectedDomains.filter(id => id !== domainId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDomains(paginatedDomains.map(domain => domain.id));
    } else {
      setSelectedDomains([]);
    }
  };

  const handleDeleteSelected = () => {
    setDomains(domains.filter(domain => !selectedDomains.includes(domain.id)));
    setSelectedDomains([]);
    toast.success(`Удалено ${selectedDomains.length} доменов`);
  };

  const openDomainInNewTab = (domainName: string) => {
    window.open(`https://${domainName}`, '_blank');
  };

  const getStatusBadge = (status: string, disableHover = false) => {
    const baseClasses = disableHover ? "pointer-events-none" : "";
    switch (status) {
      case 'active': 
      case 'connected': 
        return <Badge className={`bg-green-100 text-green-800 ${baseClasses}`}>Активен</Badge>;
      case 'pending': 
        return <Badge className={`bg-yellow-100 text-yellow-800 ${baseClasses}`}>Ожидание</Badge>;
      case 'error': 
        return <Badge className={`bg-red-100 text-red-800 ${baseClasses}`}>Ошибка</Badge>;
      default: 
        return <Badge variant="secondary" className={baseClasses}>Неизвестно</Badge>;
    }
  };

  const isAllSelected = paginatedDomains.length > 0 && paginatedDomains.every(domain => selectedDomains.includes(domain.id));
  const isIndeterminate = selectedDomains.length > 0 && !isAllSelected;

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
          <div className="flex items-center space-x-2">
            {selectedDomains.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteSelected}
                className="mr-2"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить ({selectedDomains.length})
              </Button>
            )}
            <Button onClick={() => setIsAddDomainOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить домен
            </Button>
          </div>
        </div>

        {/* Domains Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Мои домены</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Домен</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>NS статус</TableHead>
                  <TableHead>SSL</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDomains.includes(domain.id)}
                        onCheckedChange={(checked) => handleSelectDomain(domain.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">{domain.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(domain.status, true)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(domain.nsStatus, true)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {domain.sslStatus === 'active' ? (
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        ) : domain.sslStatus === 'pending' ? (
                          <Shield className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">{domain.sslMode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(domain.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleManageDomain(domain)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Управление
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openDomainInNewTab(domain.name)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Что дальше?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ознакомьтесь с API или добавьте свой первый домен.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate('/api-docs')}>
                <FileText className="w-4 h-4 mr-2" />
                API Документация
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
