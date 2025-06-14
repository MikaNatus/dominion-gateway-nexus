
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, Phone, Mail } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();

  const commonReasons = [
    'Недостаточно средств на карте',
    'Карта заблокирована или просрочена',
    'Неверные данные карты',
    'Превышен лимит операций',
    'Технические проблемы банка'
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Иконка ошибки */}
            <div className="flex justify-center">
              <XCircle className="h-24 w-24 text-red-500" />
            </div>

            {/* Заголовок */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-red-600">Оплата не прошла</h1>
              <p className="text-lg text-muted-foreground">
                К сожалению, при обработке платежа произошла ошибка
              </p>
            </div>

            {/* Возможные причины */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-red-900 mb-3">Возможные причины:</h3>
              <ul className="space-y-2 text-red-800">
                {commonReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Что делать дальше */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Что делать дальше:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">1.</span>
                  <span>Проверьте данные карты и баланс</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">2.</span>
                  <span>Попробуйте оплатить еще раз</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">3.</span>
                  <span>Обратитесь в банк для разблокировки карты</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">4.</span>
                  <span>Свяжитесь с нашей поддержкой</span>
                </li>
              </ul>
            </div>

            {/* Действия */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate('/payment')}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Попробовать снова
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться назад
              </Button>
            </div>

            {/* Контакты поддержки */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Нужна помощь?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@clouddns.ru</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+7 (800) 123-45-67</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;
