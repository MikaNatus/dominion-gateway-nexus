
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

const DomainSSL = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'premium' as 'free' | 'premium',
  };

  const domainName = 'example.com'; // Mock domain name
  const [sslMode, setSslMode] = useState<'proxy' | 'direct'>('proxy');
  const sslStatus = 'active'; // Mock SSL status

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSslModeChange = (mode: 'proxy' | 'direct') => {
    setSslMode(mode);
    toast.success(`SSL режим изменен на: ${mode === 'proxy' ? 'Проксирование' : 'Прямое подключение'}`);
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
            <Button variant="ghost" onClick={() => navigate(`/domain/${domainId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к управлению доменом
            </Button>
            <div>
              <h1 className="text-2xl font-bold">SSL сертификат - {domainName}</h1>
            </div>
          </div>

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
                      <Badge variant={sslStatus === 'active' ? 'default' : 'secondary'}>
                        {sslStatus === 'active' ? 'Активен' : sslStatus === 'pending' ? 'Ожидание' : 'Ошибка'}
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
        </div>
      </main>
    </div>
  );
};

export default DomainSSL;
