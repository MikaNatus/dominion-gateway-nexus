
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Info, Settings, Shield, Server, Globe, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

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

const DomainManagement = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'premium' as 'free' | 'premium',
  };

  // Mock domain data - in real app, this would be fetched based on domainId
  const domain: Domain = {
    id: domainId || '1',
    name: 'example.com',
    status: 'active',
    nsStatus: 'connected',
    sslMode: 'proxy',
    sslStatus: 'active',
    nsServers: ['ns1.clouddns.com', 'ns2.clouddns.com'],
    createdAt: '2024-01-14T14:30:00Z',
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onSettingsClick={() => {}}
        onSubscriptionClick={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к панели управления
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{domain.name}</h1>
            </div>
          </div>

          {/* Domain Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Информация о домене</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Domain Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Статус домена</Label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      domain.status === 'active' ? 'bg-green-500' : 
                      domain.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      {domain.status === 'active' ? 'Активен' : 
                       domain.status === 'pending' ? 'Ожидание активации' : 'Ошибка'}
                    </span>
                  </div>
                </div>

                {/* NS Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Статус Name Servers</Label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      domain.nsStatus === 'connected' ? 'bg-green-500' : 
                      domain.nsStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      {domain.nsStatus === 'connected' ? 'Подключен к нашим NS' : 
                       domain.nsStatus === 'pending' ? 'Ожидание подключения' : 'Не подключен'}
                    </span>
                  </div>
                </div>

                {/* SSL Mode */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Режим SSL</Label>
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-4 w-4 ${
                      domain.sslMode === 'proxy' ? 'text-blue-500' : 'text-green-500'
                    }`} />
                    <span className="text-sm">
                      {domain.sslMode === 'proxy' ? 'Проксирование' : 'Прямое подключение'}
                    </span>
                  </div>
                </div>

                {/* SSL Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Статус SSL</Label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      domain.sslStatus === 'active' ? 'bg-green-500' : 
                      domain.sslStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      {domain.sslStatus === 'active' ? 'SSL активен' : 
                       domain.sslStatus === 'pending' ? 'Ожидание сертификата' : 'Ошибка SSL'}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Дата добавления</Label>
                  <div className="text-sm">
                    {new Date(domain.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>

              {/* NS Servers Alert */}
              {domain.nsStatus !== 'connected' && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                        Домен не подключен к нашим Name Servers
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                        Для работы домена необходимо указать наши NS серверы в настройках домена у вашего регистратора:
                      </p>
                      <div className="space-y-2">
                        {domain.nsServers.map((ns, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded px-3 py-2">
                            <code className="text-sm flex-1 text-gray-900 dark:text-gray-100">{ns}</code>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(ns)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(`/domain/${domain.id}/dns`)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>DNS записи</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Управление DNS записями домена
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(`/domain/${domain.id}/ssl`)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>SSL сертификат</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Настройка SSL сертификата
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(`/domain/${domain.id}/settings`)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Настройки</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Общие настройки домена
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainManagement;
