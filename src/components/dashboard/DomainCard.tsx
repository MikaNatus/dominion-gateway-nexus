
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Shield, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Settings,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  nsStatus: 'connected' | 'pending' | 'error';
  sslMode: 'proxy' | 'direct';
  sslStatus: 'active' | 'pending' | 'error';
  nsServers: string[];
  createdAt: string;
}

interface DomainCardProps {
  domain: Domain;
  onManage: (domain: Domain) => void;
}

const DomainCard = ({ domain, onManage }: DomainCardProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>{domain.name}</span>
          </CardTitle>
          {getStatusBadge(domain.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(domain.nsStatus)}`} />
            <span className="text-sm text-muted-foreground">NS Status</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {domain.sslStatus === 'active' ? (
              <ShieldCheck className="h-4 w-4 text-green-600" />
            ) : domain.sslStatus === 'pending' ? (
              <Shield className="h-4 w-4 text-yellow-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm text-muted-foreground">SSL: {domain.sslMode}</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Added: {new Date(domain.createdAt).toLocaleDateString()}
          </div>
        </div>

        {domain.nsStatus !== 'connected' && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium mb-2">NS Servers (copy to your domain registrar):</p>
            <div className="space-y-1">
              {domain.nsServers.map((ns, index) => (
                <div key={index} className="flex items-center justify-between bg-background rounded px-2 py-1">
                  <code className="text-sm">{ns}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(ns)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={() => onManage(domain)}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainCard;
