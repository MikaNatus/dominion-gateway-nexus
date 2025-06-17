
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Globe, Copy } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

const DomainSettings = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'premium' as 'free' | 'premium',
  };

  const domainName = 'example.com'; // Mock domain name
  const nsServers = ['ns1.clouddns.com', 'ns2.clouddns.com']; // Mock NS servers

  const handleLogout = () => {
    navigate('/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const handleDeleteDomain = () => {
    // Show confirmation dialog in real app
    toast.success('Домен удален');
    navigate('/dashboard');
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
              <h1 className="text-2xl font-bold">Настройки - {domainName}</h1>
            </div>
          </div>

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
                  {nsServers.map((ns, index) => (
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
                <Button variant="destructive" onClick={handleDeleteDomain}>
                  Удалить домен
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Это действие нельзя отменить. Все DNS записи будут удалены.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DomainSettings;
