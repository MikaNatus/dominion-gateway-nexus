
import React, { useState } from 'react';
import {
  NativeDialog,
  NativeDialogContent,
  NativeDialogHeader,
  NativeDialogTitle,
  NativeDialogDescription,
} from '@/components/ui/native-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Key, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    email: string;
    name?: string;
    plan?: 'free' | 'premium';
  };
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserSettingsModal = ({ isOpen, onClose, user }: UserSettingsModalProps) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Mock API key - в реальном приложении получать с сервера
  const apiKey = 'sk_live_51M8ZqLJKL...hidden...xyz123';
  
  const form = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleClose = () => {
    form.reset();
    setShowApiKey(false);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success('API ключ скопирован в буфер обмена');
    } catch (error) {
      toast.error('Не удалось скопировать API ключ');
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Пароли не совпадают'
      });
      return;
    }

    if (data.newPassword.length < 6) {
      form.setError('newPassword', {
        type: 'manual',
        message: 'Пароль должен содержать минимум 6 символов'
      });
      return;
    }

    try {
      // Здесь будет логика изменения пароля
      console.log('Изменение пароля:', data);
      toast.success('Пароль успешно изменен');
      form.reset();
    } catch (error) {
      toast.error('Не удалось изменить пароль');
    }
  };

  const handleCancelPasswordChange = () => {
    form.reset();
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <NativeDialog open={isOpen} onOpenChange={handleClose} className="max-w-2xl">
      <NativeDialogContent>
        <NativeDialogHeader>
          <NativeDialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Настройки аккаунта
          </NativeDialogTitle>
          <NativeDialogDescription>
            Управление профилем, API ключами и безопасностью
          </NativeDialogDescription>
        </NativeDialogHeader>

        <div className="space-y-6">
          {/* Информация о пользователе */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация о профиле</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Тарифный план</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.plan === 'premium' ? 'default' : 'secondary'}>
                      {user.plan === 'premium' ? 'Премиум' : 'Бесплатный'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API ключ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-4 w-4" />
                API ключ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Используйте этот ключ для доступа к API CloudDNS
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyApiKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Никому не сообщайте ваш API ключ. Он дает полный доступ к вашему аккаунту.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Смена пароля */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Изменение пароля</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Текущий пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPasswords.current ? 'text' : 'password'}
                              placeholder="Введите текущий пароль"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => togglePasswordVisibility('current')}
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Новый пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPasswords.new ? 'text' : 'password'}
                              placeholder="Введите новый пароль"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => togglePasswordVisibility('new')}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите новый пароль</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              placeholder="Повторите новый пароль"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => togglePasswordVisibility('confirm')}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">
                      Изменить пароль
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelPasswordChange}>
                      Отмена
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </NativeDialogContent>
    </NativeDialog>
  );
};

export default UserSettingsModal;
