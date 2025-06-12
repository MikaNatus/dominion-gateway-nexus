
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Shield, 
  Database, 
  Settings,
  ArrowLeft,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
}

const ApiDocs = () => {
  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const dnsEndpoints: ApiEndpoint[] = [
    { method: 'GET', url: '/api/domains/:id/records', description: 'Все записи' },
    { method: 'POST', url: '/api/domains/:id/records', description: 'Добавить запись' },
    { method: 'PUT', url: '/api/records/:recordId', description: 'Обновить запись' },
    { method: 'DELETE', url: '/api/records/:recordId', description: 'Удалить запись' }
  ];

  const nsEndpoints: ApiEndpoint[] = [
    { method: 'GET', url: '/api/domains/:id/status', description: 'Проверить подключение NS-записей' },
    { method: 'GET', url: '/api/domains/:id/ns', description: 'Получить NS-записи этого домена' }
  ];

  const modeEndpoints: ApiEndpoint[] = [
    { method: 'GET', url: '/api/domains/:id/mode', description: 'Получить текущий режим' },
    { method: 'POST', url: '/api/domains/:id/mode', description: 'Изменить режим (direct, proxy)' }
  ];

  const sslEndpoints: ApiEndpoint[] = [
    { method: 'GET', url: '/api/domains/:id/ssl', description: 'Статус SSL (от Traefik)' },
    { method: 'POST', url: '/api/domains/:id/ssl/renew', description: 'Перезапустить выдачу (опционально)' }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EndpointCard = ({ endpoints, title, icon: Icon }: { 
    endpoints: ApiEndpoint[], 
    title: string, 
    icon: React.ComponentType<{ className?: string }> 
  }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Badge className={getMethodColor(endpoint.method)}>
                  {endpoint.method}
                </Badge>
                <code className="text-sm bg-muted px-2 py-1 rounded break-all">
                  {endpoint.url}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(endpoint.url)}
                className="shrink-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {endpoint.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">API Документация</h1>
              <p className="text-muted-foreground mt-1">
                Справочник по REST API для управления доменами
              </p>
            </div>
          </div>
          <Button variant="outline" className="shrink-0">
            <ExternalLink className="h-4 w-4 mr-2" />
            Swagger UI
          </Button>
        </div>

        {/* API Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">DNS Records</p>
                  <p className="text-xs text-muted-foreground">4 endpoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">NS Status</p>
                  <p className="text-xs text-muted-foreground">2 endpoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Mode</p>
                  <p className="text-xs text-muted-foreground">2 endpoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">SSL</p>
                  <p className="text-xs text-muted-foreground">2 endpoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <Tabs defaultValue="dns" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dns" className="text-xs sm:text-sm">DNS</TabsTrigger>
            <TabsTrigger value="ns" className="text-xs sm:text-sm">NS & Status</TabsTrigger>
            <TabsTrigger value="mode" className="text-xs sm:text-sm">Mode</TabsTrigger>
            <TabsTrigger value="ssl" className="text-xs sm:text-sm">SSL</TabsTrigger>
          </TabsList>

          <TabsContent value="dns" className="space-y-6">
            <EndpointCard 
              endpoints={dnsEndpoints} 
              title="📡 DNS-записи" 
              icon={Database}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Поддерживаемые типы записей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV'].map((type) => (
                    <Badge key={type} variant="outline" className="text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ns">
            <EndpointCard 
              endpoints={nsEndpoints} 
              title="🔍 NS и статус" 
              icon={Globe}
            />
          </TabsContent>

          <TabsContent value="mode">
            <EndpointCard 
              endpoints={modeEndpoints} 
              title="🔀 Режим работы" 
              icon={Settings}
            />
          </TabsContent>

          <TabsContent value="ssl">
            <EndpointCard 
              endpoints={sslEndpoints} 
              title="🔒 SSL-сертификаты" 
              icon={Shield}
            />
          </TabsContent>
        </Tabs>

        {/* Base URL Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Базовая информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Base URL</h4>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-muted rounded p-3">
                <code className="text-sm break-all">https://api.clouddns.ru</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('https://api.clouddns.ru')}
                  className="shrink-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Аутентификация</h4>
              <p className="text-sm text-muted-foreground">
                Все запросы требуют API ключ в заголовке <code>Authorization: Bearer YOUR_API_KEY</code>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Формат ответа</h4>
              <p className="text-sm text-muted-foreground">
                Все ответы возвращаются в формате JSON с соответствующими HTTP статус кодами.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocs;
