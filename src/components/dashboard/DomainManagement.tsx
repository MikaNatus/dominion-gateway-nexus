
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  Server, 
  Copy, 
  RefreshCw,
  Settings,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

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

interface DomainManagementProps {
  domain: Domain;
  onBack: () => void;
}

const DomainManagement = ({ domain, onBack }: DomainManagementProps) => {
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Статус обновлен');
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, type: string) => {
    const statusText = {
      active: 'Активен',
      pending: 'Ожидание',
      error: 'Ошибка'
    }[status] || 'Неизвестно';

    const variant = status === 'active' ? 'default' : 
                   status === 'pending' ? 'secondary' : 'destructive';

    return (
      <Badge variant={variant} className="text-xs">
        {type === 'ssl' ? `SSL: ${statusText}` : statusText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{domain.name}</h1>
            <p className="text-sm text-muted-foreground">
              ID: {domain.id} • Добавлен: {domain.createdAt}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(domain.status, 'domain')}
          {getStatusBadge(domain.sslStatus, 'ssl')}
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статус домена</CardTitle>
            {getStatusIcon(domain.status)}
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {domain.status === 'active' ? 'Активен' :
               domain.status === 'pending' ? 'Настройка' : 'Ошибка'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NS записи</CardTitle>
            {getStatusIcon(domain.nsStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {domain.nsStatus === 'connected' ? 'Подключены' :
               domain.nsStatus === 'pending' ? 'Ожидание' : 'Ошибка'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL режим</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold capitalize">
              {domain.sslMode}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Обзор</TabsTrigger>
          <TabsTrigger value="dns" className="text-xs sm:text-sm">DNS</TabsTrigger>
          <TabsTrigger value="ssl" className="text-xs sm:text-sm">SSL</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>NS серверы</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshStatus}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Настройте эти NS записи у вашего регистратора домена:
              </p>
              <div className="space-y-2">
                {domain.nsServers.map((ns, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono flex-1 min-w-0 truncate">{ns}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ns)}
                      className="ml-2 shrink-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {domain.nsStatus !== 'connected' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Требуется настройка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700">
                  Домен еще не подключен. Установите NS записи у регистратора и дождитесь обновления DNS (до 48 часов).
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS записи</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Управление DNS записями будет доступно после подключения домена.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SSL сертификат</span>
                <Badge variant={domain.sslStatus === 'active' ? 'default' : 'secondary'}>
                  {domain.sslStatus === 'active' ? 'Активен' : 'Настройка'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Режим SSL:</label>
                <div className="text-sm text-muted-foreground">
                  Текущий режим: <span className="font-mono">{domain.sslMode}</span>
                </div>
              </div>
              
              {domain.sslStatus === 'active' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">
                      SSL сертификат активен и автоматически обновляется
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки домена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Дополнительные настройки
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть сайт
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive" size="sm">
                  Удалить домен
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainManagement;
