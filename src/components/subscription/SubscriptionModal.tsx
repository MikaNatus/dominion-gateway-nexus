
import React from 'react';
import {
  NativeDialog,
  NativeDialogContent,
  NativeDialogHeader,
  NativeDialogTitle,
  NativeDialogDescription,
} from '@/components/ui/native-dialog';
import PricingPlans from './PricingPlans';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'premium';
}

const SubscriptionModal = ({ isOpen, onClose, currentPlan }: SubscriptionModalProps) => {
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
    <NativeDialog open={isOpen} onOpenChange={onClose} className="max-w-4xl">
      <NativeDialogContent>
        <NativeDialogHeader className="text-center">
          <NativeDialogTitle className="text-2xl">Выберите тарифный план</NativeDialogTitle>
          <NativeDialogDescription>
            Выберите план, который лучше всего подходит для ваших потребностей
          </NativeDialogDescription>
        </NativeDialogHeader>

        <div className="py-6">
          <PricingPlans
            currentPlan={currentPlan}
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
          />
        </div>
      </NativeDialogContent>
    </NativeDialog>
  );
};

export default SubscriptionModal;
