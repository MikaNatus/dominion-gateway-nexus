
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Download, Crown } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Иконка успеха */}
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle className="h-24 w-24 text-green-500" />
                <Crown className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
              </div>
            </div>

            {/* Заголовок */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-green-600">Оплата прошла успешно!</h1>
              <p className="text-lg text-muted-foreground">
                Добро пожаловать в Премиум план CloudDNS
              </p>
            </div>

            {/* Детали платежа */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">План:</span>
                <span className="font-bold">Премиум</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Сумма:</span>
                <span className="font-bold">$100.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Период:</span>
                <span className="font-bold">1 месяц</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Следующий платеж:</span>
                <span className="font-bold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            {/* Что теперь доступно */}
            <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Теперь вам доступно:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Безлимитное количество доменов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Защита от DDoS атак</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Приоритетная поддержка</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Расширенная аналитика</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>API доступ</span>
                </li>
              </ul>
            </div>

            {/* Действия */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Перейти к панели управления
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.print()}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Скачать чек
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div className="text-sm text-muted-foreground pt-4 border-t">
              <p>
                Подтверждение оплаты отправлено на ваш email. 
                Если у вас есть вопросы, обратитесь в нашу поддержку.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
