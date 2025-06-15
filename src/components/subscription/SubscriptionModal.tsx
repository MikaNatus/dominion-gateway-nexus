
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PricingPlans from './PricingPlans';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'premium';
}

const SubscriptionModal = ({ isOpen, onClose, currentPlan }: SubscriptionModalProps) => {
  useEffect(() => {
    // Очистка стилей при размонтировании компонента
    return () => {
      document.body.style.removeProperty('pointer-events');
      document.body.style.removeProperty('overflow');
    };
  }, []);

  useEffect(() => {
    // Очистка стилей когда модалка закрывается
    if (!isOpen) {
      // Добавляем небольшую задержку для корректного закрытия анимации
      const timer = setTimeout(() => {
        document.body.style.removeProperty('pointer-events');
        document.body.style.removeProperty('overflow');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Сразу очищаем стили при закрытии
      document.body.style.removeProperty('pointer-events');
      document.body.style.removeProperty('overflow');
      onClose();
    }
  };

  const handleUpgrade = () => {
    // Здесь будет логика перехода на премиум план
    console.log('Переход на премиум план');
    // Можно открыть Stripe checkout или другую платежную систему
  };

  const handleManageSubscription = () => {
    // Здесь будет логика управления подпиской
    console.log('Управление подпиской');
    // Можно открыть Stripe customer portal
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Выберите тарифный план</DialogTitle>
          <DialogDescription>
            Выберите план, который лучше всего подходит для ваших потребностей
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <PricingPlans
            currentPlan={currentPlan}
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
