
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingPlansProps {
  currentPlan?: 'free' | 'premium';
  onUpgrade: () => void;
  onManageSubscription?: () => void;
}

const PricingPlans = ({ currentPlan = 'free', onUpgrade, onManageSubscription }: PricingPlansProps) => {
  const navigate = useNavigate();

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

  const handleUpgradeClick = () => {
    navigate('/payment');
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-full sm:min-w-0">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative flex-1 min-w-[280px] sm:min-w-0 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-xs">
                Популярный
              </Badge>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3 md:mb-4">
                <plan.icon className={`h-8 w-8 md:h-12 md:w-12 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <CardTitle className="text-lg md:text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl md:text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm md:text-base">/{plan.period}</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-3 md:space-y-4 flex-1 flex flex-col">
              <ul className="space-y-2 md:space-y-3 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 md:gap-3">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-xs md:text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 md:pt-4 mt-auto">
                {currentPlan === plan.id ? (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full text-xs md:text-sm py-2 md:py-2" disabled>
                      Текущий план
                    </Button>
                    {plan.id === 'premium' && onManageSubscription && (
                      <Button variant="ghost" className="w-full text-xs md:text-sm py-2 md:py-2" onClick={onManageSubscription}>
                        Управление подпиской
                      </Button>
                    )}
                  </div>
                ) : plan.id === 'premium' ? (
                  <Button className="w-full text-xs md:text-sm py-2 md:py-2" onClick={handleUpgradeClick}>
                    <Zap className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Перейти на Премиум
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full text-xs md:text-sm py-2 md:py-2" disabled>
                    Текущий план
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
