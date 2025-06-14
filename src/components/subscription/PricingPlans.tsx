
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Globe, Zap } from 'lucide-react';

interface PricingPlansProps {
  currentPlan?: 'free' | 'premium';
  onUpgrade: () => void;
  onManageSubscription?: () => void;
}

const PricingPlans = ({ currentPlan = 'free', onUpgrade, onManageSubscription }: PricingPlansProps) => {
  const plans = [
    {
      id: 'free',
      name: 'Бесплатный',
      price: '0',
      period: 'навсегда',
      description: 'Идеально для начала работы',
      features: [
        'Привязка 1 домена',
        'Бесплатный SSL сертификат',
        'Базовая поддержка DNS',
        'Стандартная поддержка'
      ],
      icon: Globe,
      popular: false
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: '100',
      period: 'месяц',
      description: 'Для профессионального использования',
      features: [
        'Безлимитное количество доменов',
        'Бесплатный SSL сертификат',
        'Защита от DDoS атак',
        'Приоритетная поддержка',
        'Расширенная аналитика',
        'API доступ'
      ],
      icon: Shield,
      popular: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
              Популярный
            </Badge>
          )}
          
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <plan.icon className={`h-12 w-12 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/{plan.period}</span>
            </div>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              {currentPlan === plan.id ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Текущий план
                  </Button>
                  {plan.id === 'premium' && onManageSubscription && (
                    <Button variant="ghost" className="w-full" onClick={onManageSubscription}>
                      Управление подпиской
                    </Button>
                  )}
                </div>
              ) : plan.id === 'premium' ? (
                <Button className="w-full" onClick={onUpgrade}>
                  <Zap className="h-4 w-4 mr-2" />
                  Перейти на Премиум
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Текущий план
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingPlans;
