
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, CreditCard, Search, Settings } from 'lucide-react';

const Admin = () => {
  const [paymentMethods, setPaymentMethods] = useState({
    'usdt-trc20': { name: 'USDT TRC20', enabled: true },
    'usdt-bep20': { name: 'USDT BEP20', enabled: true },
    'btc': { name: 'Bitcoin (BTC)', enabled: true },
    'eth': { name: 'Ethereum (ETH)', enabled: true },
    'sbp': { name: 'СБП', enabled: true },
    'card': { name: 'Банковская карта', enabled: true }
  });

  const [users] = useState([
    { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', plan: 'premium', status: 'active', registered: '2024-01-15' },
    { id: 2, name: 'Мария Петрова', email: 'maria@example.com', plan: 'free', status: 'active', registered: '2024-02-10' },
    { id: 3, name: 'Алексей Сидоров', email: 'alexey@example.com', plan: 'premium', status: 'suspended', registered: '2024-01-28' },
    { id: 4, name: 'Елена Козлова', email: 'elena@example.com', plan: 'free', status: 'active', registered: '2024-03-05' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [methodId]: {
        ...prev[methodId],
        enabled: !prev[methodId].enabled
      }
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Админ панель
            </h1>
            <p className="text-muted-foreground">Управление пользователями и настройками системы</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Платежные системы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(paymentMethods).map(([id, method]) => (
                  <div key={id} className="flex items-center justify-between">
                    <Label htmlFor={id} className="text-sm font-medium">
                      {method.name}
                    </Label>
                    <Switch
                      id={id}
                      checked={method.enabled}
                      onCheckedChange={() => togglePaymentMethod(id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Users Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Управление пользователями
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по имени или email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="План" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все планы</SelectItem>
                      <SelectItem value="free">Бесплатный</SelectItem>
                      <SelectItem value="premium">Премиум</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="active">Активный</SelectItem>
                      <SelectItem value="suspended">Заблокирован</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>План</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.plan === 'premium' ? 'default' : 'secondary'}>
                              {user.plan === 'premium' ? 'Премиум' : 'Бесплатный'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                              {user.status === 'active' ? 'Активный' : 'Заблокирован'}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.registered}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Редактировать
                              </Button>
                              <Button 
                                variant={user.status === 'active' ? 'destructive' : 'default'} 
                                size="sm"
                              >
                                {user.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
