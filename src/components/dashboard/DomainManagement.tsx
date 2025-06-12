
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  ShieldCheck,
  Server,
  Copy,
  RefreshCw,
  Settings,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  nsStatus: 'connected' | 'pending' | 'error';
  sslMode: 'flexible' | 'full' | 'strict';
  sslStatus: 'active' | 'pending' | 'error';
  nsServers: string[];
  createdAt: string;
}

interface DomainManagementProps {
  domain: Domain;
  onBack: () => void;
  onUpdate: (domain: Domain) => void;
}

const DomainManagement = ({ domain, onBack, onUpdate }: DomainManagementProps) => {
  const [sslMode, setSslMode] = useState(domain.sslMode);
  const [isUpdating, setIsUpdating] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleUpdateSSL = async () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      onUpdate({ ...domain, sslMode });
      toast.success('SSL settings updated');
      setIsUpdating(false);
    }, 1000);
  };

  const refreshStatus = () => {
    toast.info('Checking domain status...');
    // Simulate status check
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'connected': return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Domains
        </Button>
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{domain.name}</h1>
          {getStatusBadge(domain.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>NS Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {getStatusBadge(domain.nsStatus)}
              <Button variant="outline" size="sm" onClick={refreshStatus}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>SSL Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {domain.sslStatus === 'active' ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              {getStatusBadge(domain.sslStatus)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Age</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Added: {new Date(domain.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dns">DNS Settings</TabsTrigger>
          <TabsTrigger value="ssl">SSL Configuration</TabsTrigger>
          <TabsTrigger value="records">DNS Records</TabsTrigger>
        </TabsList>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nameservers</CardTitle>
              <CardDescription>
                Update your domain's nameservers at your registrar to point to these servers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domain.nsStatus !== 'connected' && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Action Required</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please update your nameservers at your domain registrar to activate DNS management.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                {domain.nsServers.map((ns, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                    <code className="text-sm font-mono">{ns}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ns)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SSL/TLS Configuration</CardTitle>
              <CardDescription>
                Configure how SSL certificates are handled for your domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ssl-mode">SSL Mode</Label>
                <Select value={sslMode} onValueChange={setSslMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">
                      Flexible - Encrypt connection between visitor and our servers
                    </SelectItem>
                    <SelectItem value="full">
                      Full - Encrypt end-to-end (certificate on origin server)
                    </SelectItem>
                    <SelectItem value="strict">
                      Full (Strict) - Encrypt end-to-end with valid certificate
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleUpdateSSL} 
                disabled={isUpdating || sslMode === domain.sslMode}
              >
                {isUpdating ? 'Updating...' : 'Update SSL Settings'}
              </Button>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Let's Encrypt Integration</h4>
                <p className="text-sm text-blue-700">
                  SSL certificates are automatically provisioned and renewed using Let's Encrypt 
                  when your domain is properly configured.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Records</CardTitle>
              <CardDescription>
                Manage A, CNAME, MX, and other DNS records for your domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  DNS records management will be available once nameservers are connected
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainManagement;
