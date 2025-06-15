
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Save } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';

const AdminPayments = () => {
  const [paymentMethods, setPaymentMethods] = useState({
    'usdt-trc20': { 
      name: 'USDT TRC20', 
      enabled: true, 
      address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      fee: '0%'
    },
    'usdt-bep20': { 
      name: 'USDT BEP20', 
      enabled: true, 
      address: '0x742d35Cc8d7e2d3e2B9f54d88D8EF5b6D8f5e3F8',
      fee: '0%'
    },
    'btc': { 
      name: 'Bitcoin (BTC)', 
      enabled: true, 
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      fee: '0.5%'
    },
    'eth': { 
      name: 'Ethereum (ETH)', 
      enabled: true, 
      address: '0x742d35Cc8d7e2d3e2B9f54d88D8EF5b6D8f5e3F8',
      fee: '1%'
    },
    'sbp': { 
      name: 'СБП', 
      enabled: true, 
      phone: '+7 900 123-45-67',
      fee: '0%'
    },
    'card': { 
      name: 'Банковская карта', 
      enabled: true, 
      number: '5536 9138 **** ****',
      fee: '2%'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [methodId]: {
        ...prev[methodId],
        enabled: !prev[methodId].enabled
      }
    }));
    setHasChanges(true);
  };

  const updatePaymentMethod = (methodId: string, field: string, value: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [methodId]: {
        ...prev[methodId],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Здесь будет логика сохранения в базу данных
    console.log('Saving payment methods:', paymentMethods);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Настройка платежных систем
              </CardTitle>
              {hasChanges && (
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(paymentMethods).map(([id, method]) => (
              <Card key={id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{method.name}</h3>
                      <Badge variant={method.enabled ? 'default' : 'secondary'}>
                        {method.enabled ? 'Активен' : 'Отключен'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${id}-enabled`} className="text-sm font-medium">
                        Включен
                      </Label>
                      <Switch
                        id={`${id}-enabled`}
                        checked={method.enabled}
                        onCheckedChange={() => togglePaymentMethod(id)}
                      />
                    </div>
                  </div>

                  {method.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {method.address && (
                        <div className="space-y-2">
                          <Label htmlFor={`${id}-address`}>Адрес кошелька</Label>
                          <Input
                            id={`${id}-address`}
                            value={method.address}
                            onChange={(e) => updatePaymentMethod(id, 'address', e.target.value)}
                            placeholder="Введите адрес кошелька"
                          />
                        </div>
                      )}

                      {method.phone && (
                        <div className="space-y-2">
                          <Label htmlFor={`${id}-phone`}>Номер телефона</Label>
                          <Input
                            id={`${id}-phone`}
                            value={method.phone}
                            onChange={(e) => updatePaymentMethod(id, 'phone', e.target.value)}
                            placeholder="Введите номер телефона"
                          />
                        </div>
                      )}

                      {method.number && (
                        <div className="space-y-2">
                          <Label htmlFor={`${id}-number`}>Номер карты</Label>
                          <Input
                            id={`${id}-number`}
                            value={method.number}
                            onChange={(e) => updatePaymentMethod(id, 'number', e.target.value)}
                            placeholder="Введите номер карты"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor={`${id}-fee`}>Комиссия</Label>
                        <Input
                          id={`${id}-fee`}
                          value={method.fee}
                          onChange={(e) => updatePaymentMethod(id, 'fee', e.target.value)}
                          placeholder="Например: 1% или 0%"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayments;
