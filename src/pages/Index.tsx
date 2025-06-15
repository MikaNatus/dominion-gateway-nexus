import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Crown, Zap, CheckCircle, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">DNSKing</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Link to="/login">
                <Button variant="ghost">Войти</Button>
              </Link>
              <Link to="/register">
                <Button>Регистрация</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Управление доменами и SSL сертификатами
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Полный контроль над вашими доменами. DNS управление, SSL сертификаты, 
            мониторинг и защита — всё в одном месте.
          </p>
          <div className="flex justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Начать бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Возможности платформы</h2>
            <p className="text-lg text-muted-foreground">
              Всё необходимое для профессионального управления доменами
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>SSL Сертификаты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Автоматическое получение и обновление SSL сертификатов Let's Encrypt. 
                  Полная защита ваших доменов.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Crown className="h-12 w-12 text-primary mb-4" />
                <CardTitle>DNS Управление</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Полный контроль над DNS записями. A, AAAA, CNAME, MX записи 
                  с быстрым распространением изменений.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Высокая производительность</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Глобальная сеть серверов обеспечивает быстрый отклик 
                  и высокую доступность ваших сайтов.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Почему выбирают DNSKing?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Простота настройки</h3>
                    <p className="text-muted-foreground">
                      Добавьте домен и получите NS серверы за несколько кликов
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Автоматические SSL</h3>
                    <p className="text-muted-foreground">
                      SSL сертификаты получаются и обновляются автоматически
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">API для разработчиков</h3>
                    <p className="text-muted-foreground">
                      Полноценный API для автоматизации управления доменами
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Готовы начать?</h3>
              <p className="text-muted-foreground mb-6">
                Присоединяйтесь к тысячам пользователей, которые доверяют нам управление своими доменами.
              </p>
              <Link to="/login">
                <Button className="w-full">Создать аккаунт</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">DNSKing</span>
          </div>
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 DNSKing. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
