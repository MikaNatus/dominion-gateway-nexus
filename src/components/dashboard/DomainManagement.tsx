import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Globe, Shield, Server, Plus, Trash2, Copy, AlertCircle, Info } from 'lucide-react';
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

interface DomainManagementProps {
  domain: Domain;
  onBack: () => void;
}

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl: number;
}

const DomainManagement = ({ domain, onBack }: DomainManagementProps) => {
  const [sslMode, setSslMode] = useState(domain.sslMode);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([
    { id: '1', type: 'A', name: '@', value: '192.168.1.1', ttl: 300 },
    { id: '2', type: 'CNAME', name: 'www', value: 'example.com', ttl: 300 },
  ]);
  const [newRecord, setNewRecord] = useState({
    type: 'A' as DNSRecord['type'],
    name: '',
    value: '',
    ttl: 300
  });

  const handleSslModeChange = (mode: 'proxy' | 'direct') => {
    setSslMode(mode);
    toast.success(`SSL режим изменен на: ${mode === 'proxy' ? 'Проксирование' : 'Прямое подключение'}`);
  };

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.value) {
      toast.error('Заполните все поля');
      return;
    }
    
    const record: DNSRecord = {
      id: Date.now().toString(),
      ...newRecord
    };
    setDnsRecords([...dnsRecords, record]);
    setNewRecord({ type: 'A', name: '', value: '', ttl: 300 });
    toast.success('DNS запись добавлена');
  };

  const handleDeleteRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter(record => record.id !== id));
    toast.success('DNS запись удалена');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
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
                  sslMode === 'proxy' ? 'text-blue-500' : 'text-green-500'
                }`} />
                <span className="text-sm">
                  {sslMode === 'proxy' ? 'Проксирование' : 'Прямое подключение'}
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

      <Tabs defaultValue="dns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dns">DNS записи</TabsTrigger>
          <TabsTrigger value="ssl">SSL сертификат</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>DNS записи</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing DNS Records */}
              <div className="space-y-2">
                {dnsRecords.map((record) => (
                  <div key={record.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <Badge variant="outline">{record.type}</Badge>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <span className="font-mono text-sm">{record.name}</span>
                      <span className="font-mono text-sm truncate">{record.value}</span>
                      <span className="text-sm text-muted-foreground">TTL: {record.ttl}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(record.value)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteRecord(record.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Record */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Добавить новую запись</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Имя"
                    value={newRecord.name}
                    onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                  />
                  <Input
                    placeholder="Значение"
                    value={newRecord.value}
                    onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="TTL"
                      value={newRecord.ttl}
                      onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value)})}
                      className="w-20"
                    />
                    <Button onClick={handleAddRecord}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>SSL сертификат</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Режим SSL</Label>
                  <Select value={sslMode} onValueChange={handleSslModeChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proxy">Проксирование</SelectItem>
                      <SelectItem value="direct">Прямое подключение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SSL Mode Description */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-2">
                        {sslMode === 'proxy' ? 'Проксирование' : 'Прямое подключение'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {sslMode === 'proxy' 
                          ? 'Трафик проходит через наши серверы с использованием нашего SSL сертификата. Обеспечивает дополнительную защиту и кэширование.'
                          : 'Прямое подключение к вашему серверу с использованием вашего SSL сертификата на стороне сервера. Минимальная задержка.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Статус сертификата</Label>
                    <div className="mt-1">
                      <Badge variant={domain.sslStatus === 'active' ? 'default' : 'secondary'}>
                        {domain.sslStatus === 'active' ? 'Активен' : domain.sslStatus === 'pending' ? 'Ожидание' : 'Ошибка'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Выдан</Label>
                    <p className="text-sm text-muted-foreground mt-1">CloudDNS CA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Настройки домена</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name Servers</Label>
                <div className="mt-2 space-y-2">
                  {domain.nsServers.map((ns, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input value={ns} readOnly />
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(ns)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Укажите эти name servers в настройках вашего домена у регистратора
                </p>
              </div>

              <div className="border-t pt-4">
                <Button variant="destructive">
                  Удалить домен
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Это действие нельзя отменить. Все DNS записи будут удалены.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainManagement;
