
import React, { useState } from 'react';
import {
  NativeDialog,
  NativeDialogContent,
  NativeDialogDescription,
  NativeDialogHeader,
  NativeDialogTitle,
} from '@/components/ui/native-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Globe } from 'lucide-react';

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: string) => void;
}

const AddDomainModal = ({ isOpen, onClose, onAdd }: AddDomainModalProps) => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(domain.trim());
      setDomain('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDomain('');
    setIsLoading(false);
    onClose();
  };

  const isValidDomain = (domain: string) => {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
    return domainRegex.test(domain);
  };

  return (
    <NativeDialog open={isOpen} onOpenChange={handleClose}>
      <NativeDialogContent className="sm:max-w-md">
        <NativeDialogHeader>
          <NativeDialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Добавить новый домен</span>
          </NativeDialogTitle>
          <NativeDialogDescription>
            Введите имя домена для добавления в систему управления DNS
          </NativeDialogDescription>
        </NativeDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Имя домена</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="domain"
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value.toLowerCase())}
                className="pl-10"
                required
              />
            </div>
            {domain && !isValidDomain(domain) && (
              <p className="text-sm text-destructive">Пожалуйста, введите корректное имя домена</p>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !domain || !isValidDomain(domain)}
              className="flex-1"
            >
              {isLoading ? 'Добавление...' : 'Добавить домен'}
            </Button>
          </div>
        </form>
      </NativeDialogContent>
    </NativeDialog>
  );
};

export default AddDomainModal;
