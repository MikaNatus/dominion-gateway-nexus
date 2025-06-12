
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  CheckCircle,
  Plus,
  Trash2,
  Edit
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

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

interface DomainManagementProps {
  domain: Domain;
  onBack: () => void;
}

const DomainManagement = ({ domain, onBack }: DomainManagementProps) => {
  const [loading, setLoading] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([
    { id: '1', type: 'A', name: '@', value: '192.168.1.1', ttl: 300 },
    { id: '2', type: 'CNAME', name: 'www', value: domain.name, ttl: 300 },
  ]);
  const [newRecord, setNewRecord] = useState({
    type: 'A' as DNSRecord['type'],
    name: '',
    value: '',
    ttl: 300,
    priority: undefined as number | undefined
  });
  const [editingRecord, setEditingRecord] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Статус обновлен');
    }, 2000);
  };

  const handleDeleteDomain = () => {
    if (confirm(`Вы уверены, что хотите удалить домен ${domain.name}?`)) {
      toast.success('Домен удален');
      onBack();
    }
  };

  const handleAddDNSRecord = () => {
    if (!newRecord.name || !newRecord.value) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const record: DNSRecord = {
      id: Date.now().toString(),
      type: newRecord.type,
      name: newRecord.name,
      value: newRecord.value,
      ttl: newRecord.ttl,
      priority: newRecord.priority
    };

    setDnsRecords([...dnsRecords, record]);
    setNewRecord({ type: 'A', name: '', value: '', ttl: 300, priority: undefined });
    toast.success('DNS запись добавлена');
  };

  const handleDeleteDNSRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter(r => r.id !== id));
    toast.success('DNS запись удалена');
  };

  const handleUpdateSSLMode = (mode: 'flexible' | 'full' | 'strict') => {
    toast.success(`SSL режим изменен на ${mode}`);
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
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2">Обзор</TabsTrigger>
          <TabsTrigger value="dns" className="text-xs sm:text-sm px-2">DNS</TabsTrigger>
          <TabsTrigger value="ssl" className="text-xs sm:text-sm px-2">SSL</TabsTrigger>
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

          <Card>
            <CardHeader>
              <CardTitle>Управление доменом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" onClick={() => window.open(`https://${domain.name}`, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть сайт
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive" size="sm" onClick={handleDeleteDomain}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить домен
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS записи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new DNS record */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-medium">Добавить DNS запись</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="dns-type">Тип</Label>
                    <Select value={newRecord.type} onValueChange={(value: DNSRecord['type']) => setNewRecord({...newRecord, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="AAAA">AAAA</SelectItem>
                        <SelectItem value="CNAME">CNAME</SelectItem>
                        <SelectItem value="MX">MX</SelectItem>
                        <SelectItem value="TXT">TXT</SelectItem>
                        <SelectItem value="NS">NS</SelectItem>
                        <SelectItem value="SRV">SRV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dns-name">Имя</Label>
                    <Input 
                      id="dns-name"
                      value={newRecord.name}
                      onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                      placeholder="@, www, mail"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dns-value">Значение</Label>
                    <Input 
                      id="dns-value"
                      value={newRecord.value}
                      onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                      placeholder="192.168.1.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dns-ttl">TTL</Label>
                    <Input 
                      id="dns-ttl"
                      type="number"
                      value={newRecord.ttl}
                      onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value) || 300})}
                    />
                  </div>
                </div>
                <Button onClick={handleAddDNSRecord} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить запись
                </Button>
              </div>

              {/* DNS records list */}
              <div className="space-y-2">
                {dnsRecords.map((record) => (
                  <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                    <div className="flex-1 space-y-1 sm:space-y-0">
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline">{record.type}</Badge>
                        <code className="font-mono">{record.name}</code>
                        <span>→</span>
                        <code className="font-mono break-all">{record.value}</code>
                        <span className="text-muted-foreground">TTL: {record.ttl}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDNSRecord(record.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ssl-mode">Режим SSL</Label>
                  <Select value={domain.sslMode} onValueChange={handleUpdateSSLMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="strict">Full (Strict)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Текущий режим: <span className="font-mono">{domain.sslMode}</span>
                  </p>
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

              <div className="pt-4 border-t">
                <Button variant="outline" disabled={domain.sslStatus === 'pending'}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить сертификат
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
