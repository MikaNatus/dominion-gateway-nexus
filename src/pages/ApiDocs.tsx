
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
  requestBody?: object;
  successResponse?: object;
  errorResponse?: object;
  availableValues?: string[];
}

const ApiDocs = () => {
  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const dnsEndpoints: ApiEndpoint[] = [
    { 
      method: 'GET', 
      url: '/api/domains/:id/records', 
      description: 'Получить все DNS записи домена',
      successResponse: {
        "records": [
          {
            "id": "rec_123",
            "name": "@",
            "type": "A",
            "content": "213.209.129.114",
            "ttl": 3600
          }
        ]
      },
      errorResponse: {
        "error": "Domain not found",
        "code": 404
      }
    },
    { 
      method: 'POST', 
      url: '/api/domains/:id/records', 
      description: 'Добавить новую DNS запись',
      requestBody: {
        "name": "@",
        "type": "A", 
        "content": "213.209.129.114",
        "ttl": 3600
      },
      successResponse: {
        "id": "rec_124",
        "name": "@",
        "type": "A",
        "content": "213.209.129.114",
        "ttl": 3600,
        "created_at": "2024-01-15T10:30:00Z"
      },
      errorResponse: {
        "error": "Invalid record type",
        "code": 400
      }
    },
    { 
      method: 'PUT', 
      url: '/api/records/:recordId', 
      description: 'Обновить существующую DNS запись',
      requestBody: {
        "name": "@",
        "type": "A",
        "content": "213.209.129.114", 
        "ttl": 3600
      },
      successResponse: {
        "id": "rec_123",
        "name": "@",
        "type": "A",
        "content": "213.209.129.114",
        "ttl": 3600,
        "updated_at": "2024-01-15T10:35:00Z"
      },
      errorResponse: {
        "error": "Record not found",
        "code": 404
      }
    },
    { 
      method: 'DELETE', 
      url: '/api/records/:recordId', 
      description: 'Удалить DNS запись',
      successResponse: {
        "message": "Record deleted successfully"
      },
      errorResponse: {
        "error": "Record not found",
        "code": 404
      }
    }
  ];

  const nsEndpoints: ApiEndpoint[] = [
    { 
      method: 'GET', 
      url: '/api/domains/:id/status', 
      description: 'Проверить статус подключения NS-записей',
      successResponse: {
        "status": "connected",
        "ns_servers": [
          "ns1.clouddns.ru",
          "ns2.clouddns.ru"
        ],
        "last_check": "2024-01-15T10:30:00Z"
      },
      errorResponse: {
        "status": "not_connected",
        "error": "NS servers not pointing to CloudDNS"
      }
    },
    { 
      method: 'GET', 
      url: '/api/domains/:id/ns', 
      description: 'Получить NS-записи домена',
      successResponse: {
        "ns_servers": [
          "ns1.clouddns.ru",
          "ns2.clouddns.ru"
        ]
      }
    }
  ];

  const modeEndpoints: ApiEndpoint[] = [
    { 
      method: 'GET', 
      url: '/api/domains/:id/mode', 
      description: 'Получить текущий режим домена',
      successResponse: {
        "mode": "proxy",
        "description": "Проксирование через CloudDNS"
      }
    },
    { 
      method: 'POST', 
      url: '/api/domains/:id/mode', 
      description: 'Изменить режим домена',
      requestBody: {
        "mode": "proxy"
      },
      availableValues: ["proxy", "direct"],
      successResponse: {
        "mode": "proxy",
        "message": "Mode updated successfully"
      },
      errorResponse: {
        "error": "Invalid mode value",
        "code": 400,
        "available_modes": ["proxy", "direct"]
      }
    }
  ];

  const sslEndpoints: ApiEndpoint[] = [
    { 
      method: 'GET', 
      url: '/api/domains/:id/ssl', 
      description: 'Получить статус SSL сертификата',
      successResponse: {
        "status": "active",
        "certificate": {
          "issuer": "Let's Encrypt",
          "expires_at": "2024-04-15T00:00:00Z",
          "domains": ["example.com", "www.example.com"]
        }
      }
    },
    { 
      method: 'POST', 
      url: '/api/domains/:id/ssl/renew', 
      description: 'Перевыпустить SSL сертификат',
      successResponse: {
        "message": "SSL renewal initiated",
        "status": "processing"
      },
      errorResponse: {
        "error": "Domain not verified",
        "code": 400
      }
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const EndpointCard = ({ endpoints, title, icon: Icon }: { 
    endpoints: ApiEndpoint[], 
    title: string, 
    icon: React.ComponentType<{ className?: string }> 
  }) => (
    <div className="space-y-6">
      {endpoints.map((endpoint, index) => (
        <Card key={index}>
          <CardHeader>
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
          </CardHeader>
          
          <CardContent className="space-y-4">
            {endpoint.requestBody && (
              <div>
                <h4 className="font-medium mb-2">Тело запроса:</h4>
                <div className="bg-muted rounded p-3">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(endpoint.requestBody, null, 2)}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(JSON.stringify(endpoint.requestBody, null, 2))}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Копировать
                </Button>
              </div>
            )}

            {endpoint.availableValues && (
              <div>
                <h4 className="font-medium mb-2">Доступные значения:</h4>
                <div className="flex flex-wrap gap-2">
                  {endpoint.availableValues.map((value) => (
                    <Badge key={value} variant="outline">
                      {value}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p><strong>proxy</strong> - Проксирование через CloudDNS с использованием нашего SSL сертификата</p>
                  <p><strong>direct</strong> - Прямое подключение с вашим SSL сертификатом на стороне сервера</p>
                </div>
              </div>
            )}

            {endpoint.successResponse && (
              <div>
                <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Успешный ответ (200):</h4>
                <div className="bg-muted rounded p-3">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(endpoint.successResponse, null, 2)}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(JSON.stringify(endpoint.successResponse, null, 2))}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Копировать
                </Button>
              </div>
            )}

            {endpoint.errorResponse && (
              <div>
                <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Ответ при ошибке:</h4>
                <div className="bg-muted rounded p-3">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(endpoint.errorResponse, null, 2)}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(JSON.stringify(endpoint.errorResponse, null, 2))}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Копировать
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
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
                Подробный справочник по REST API для управления доменами
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

            <div>
              <h4 className="font-medium mb-2">Коды ошибок</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code>200</code>
                  <span className="text-muted-foreground">Успешный запрос</span>
                </div>
                <div className="flex justify-between">
                  <code>400</code>
                  <span className="text-muted-foreground">Некорректный запрос</span>
                </div>
                <div className="flex justify-between">
                  <code>401</code>
                  <span className="text-muted-foreground">Неавторизован</span>
                </div>
                <div className="flex justify-between">
                  <code>404</code>
                  <span className="text-muted-foreground">Ресурс не найден</span>
                </div>
                <div className="flex justify-between">
                  <code>500</code>
                  <span className="text-muted-foreground">Внутренняя ошибка сервера</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocs;
