import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Shield, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Settings,
  ArrowLeft,
  Plus,
  Trash2
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

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl: number;
}

interface DomainManagementProps {
  domain: Domain;
  onBack: () => void;
}

const DomainManagement = ({ domain, onBack }: DomainManagementProps) => {
  const [sslMode, setSslMode] = useState<'flexible' | 'full' | 'strict'>(domain.sslMode);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([
    { id: '1', type: 'A', name: '@', value: '192.168.1.1', ttl: 300 },
    { id: '2', type: 'CNAME', name: 'www', value: domain.name, ttl: 300 },
  ]);
  
  const [newRecord, setNewRecord] = useState({
    type: 'A' as DNSRecord['type'],
    name: '',
    value: '',
    ttl: 300
  });

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

  const handleSslModeChange = (value: string) => {
    setSslMode(value as 'flexible' | 'full' | 'strict');
  };

  const handleRecordTypeChange = (value: string) => {
    setNewRecord({ ...newRecord, type: value as DNSRecord['type'] });
  };

  const handleAddRecord = () => {
    if (newRecord.name && newRecord.value) {
      const record: DNSRecord = {
        id: Date.now().toString(),
        type: newRecord.type,
        name: newRecord.name,
        value: newRecord.value,
        ttl: newRecord.ttl
      };
      setDnsRecords([...dnsRecords, record]);
      setNewRecord({ type: 'A', name: '', value: '', ttl: 300 });
      toast.success('DNS record added successfully');
    }
  };

  const handleDeleteRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter(record => record.id !== id));
    toast.success('DNS record deleted');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Globe className="h-8 w-8" />
            <span>{domain.name}</span>
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            {getStatusBadge(domain.status)}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(domain.nsStatus)}`} />
              <span className="text-sm text-muted-foreground">NS Status: {domain.nsStatus}</span>
            </div>
            <div className="flex items-center space-x-2">
              {domain.sslStatus === 'active' ? (
                <ShieldCheck className="h-4 w-4 text-green-600" />
              ) : domain.sslStatus === 'pending' ? (
                <Shield className="h-4 w-4 text-yellow-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm text-muted-foreground">SSL: {sslMode}</span>
            </div>
          </div>
        </div>
      </div>

      {domain.nsStatus !== 'connected' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Action Required: Update Nameservers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To activate your domain, please update your nameservers at your domain registrar to:
            </p>
            <div className="space-y-2">
              {domain.nsServers.map((ns, index) => (
                <div key={index} className="flex items-center justify-between bg-muted rounded px-3 py-2">
                  <code className="text-sm font-mono">{ns}</code>
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
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dns">DNS Records</TabsTrigger>
          <TabsTrigger value="ssl">SSL/TLS</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Value</th>
                      <th className="text-left p-2">TTL</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="p-2">
                          <Badge variant="outline">{record.type}</Badge>
                        </td>
                        <td className="p-2 font-mono">{record.name}</td>
                        <td className="p-2 font-mono">{record.value}</td>
                        <td className="p-2">{record.ttl}s</td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add New Record</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <Label htmlFor="record-type">Type</Label>
                    <Select
                      value={newRecord.type}
                      onValueChange={handleRecordTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="AAAA">AAAA</SelectItem>
                        <SelectItem value="CNAME">CNAME</SelectItem>
                        <SelectItem value="MX">MX</SelectItem>
                        <SelectItem value="TXT">TXT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="record-name">Name</Label>
                    <Input
                      id="record-name"
                      value={newRecord.name}
                      onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                      placeholder="@, www, subdomain"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="record-value">Value</Label>
                    <Input
                      id="record-value"
                      value={newRecord.value}
                      onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                      placeholder="192.168.1.1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="record-ttl">TTL (seconds)</Label>
                    <Input
                      id="record-ttl"
                      type="number"
                      value={newRecord.ttl}
                      onChange={(e) => setNewRecord({ ...newRecord, ttl: parseInt(e.target.value) || 300 })}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={handleAddRecord} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SSL/TLS Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ssl-mode">SSL Mode</Label>
                <Select value={sslMode} onValueChange={handleSslModeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="strict">Full (Strict)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {sslMode === 'flexible' && 'Encrypts traffic between visitor and CloudDNS'}
                  {sslMode === 'full' && 'Encrypts end-to-end, using a self-signed certificate on the server'}
                  {sslMode === 'strict' && 'Encrypts end-to-end, requires a valid certificate on the server'}
                </p>
              </div>
              
              <Button onClick={handleSaveSettings}>
                Save SSL Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Domain Name</Label>
                  <Input value={domain.name} disabled />
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="pt-2">
                    {getStatusBadge(domain.status)}
                  </div>
                </div>
                <div>
                  <Label>Created</Label>
                  <Input value={new Date(domain.createdAt).toLocaleString()} disabled />
                </div>
                <div>
                  <Label>NS Status</Label>
                  <div className="pt-2">
                    <Badge className={
                      domain.nsStatus === 'connected' ? 'bg-green-100 text-green-800' :
                      domain.nsStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {domain.nsStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainManagement;
