
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Shield, Check, CreditCard } from 'lucide-react';
import Header from '@/components/Header';

const Payment = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Mock user data for header
  const user = {
    name: 'Пользователь',
    email: 'user@example.com',
    plan: 'free' as const
  };

  const paymentMethods = [
    {
      id: 'usdt-trc20',
      name: 'USDT TRC20',
      description: 'Tether на сети TRON',
      icon: '₮',
      enabled: true
    },
    {
      id: 'usdt-bep20',
      name: 'USDT BEP20',
      description: 'Tether на сети BSC',
      icon: '₮',
      enabled: true
    },
    {
      id: 'btc',
      name: 'Bitcoin (BTC)',
      description: 'Биткойн',
      icon: '₿',
      enabled: true
    },
    {
      id: 'eth',
      name: 'Ethereum (ETH)',
      description: 'Эфириум',
      icon: 'Ξ',
      enabled: true
    },
    {
      id: 'sbp',
      name: 'СБП',
      description: 'Система быстрых платежей',
      icon: '₽',
      enabled: true
    },
    {
      id: 'card',
      name: 'Банковская карта',
      description: 'Visa, MasterCard, Мир',
      icon: '💳',
      enabled: true
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      alert('Пожалуйста, выберите способ оплаты');
      return;
    }

    setIsProcessing(true);
    
    // Симуляция обработки платежа
    setTimeout(() => {
      // Случайный результат для демонстрации
      const success = Math.random() > 0.3;
      if (success) {
        navigate('/payment-success');
      } else {
        navigate('/payment-failed');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onLogout={() => navigate('/login')}
        onSettingsClick={() => {}}
        onSubscriptionClick={() => navigate('/payment')}
      />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к панели управления
            </Button>
            <h1 className="text-3xl font-bold">Оформление подписки</h1>
            <p className="text-muted-foreground">Перейдите на Премиум план для расширенных возможностей</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* План подписки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Премиум план</span>
                  <Badge className="ml-auto">Популярный</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold">$100</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">Безлимитное количество доменов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">Бесплатный SSL сертификат</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">Защита от DDoS атак</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">Приоритетная поддержка</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">Расширенная аналитика</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">API доступ</span>
                  </li>
                </ul>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Премиум план (месячно)</span>
                    <span className="font-semibold">$100.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-bold">
                    <span>Итого к оплате</span>
                    <span>$100.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Выбор способа оплаты */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Способ оплаты</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Выберите способ оплаты:</Label>
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentMethods.filter(method => method.enabled).map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label 
                            htmlFor={method.id} 
                            className="flex-1 cursor-pointer flex items-center gap-3"
                          >
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-muted-foreground">{method.description}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing || !selectedPaymentMethod}
                  >
                    {isProcessing ? 'Обработка платежа...' : 'Перейти к оплате $100.00'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Нажимая "Перейти к оплате", вы соглашаетесь с нашими условиями использования и политикой конфиденциальности.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
