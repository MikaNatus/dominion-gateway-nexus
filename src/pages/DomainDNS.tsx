import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Server, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl: number;
}

const DomainDNS = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'premium' as 'free' | 'premium',
  };

  const domainName = 'example.com'; // Mock domain name

  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([
    { id: '1', type: 'A', name: '@', value: '192.168.1.1', ttl: 300 },
    { id: '2', type: 'CNAME', name: 'www', value: 'example.com', ttl: 300 },
  ]);

  const [newRecord, setNewRecord] = useState({
    type: 'A' as DNSRecord['type'],
    name: '',
    value: '',
    ttl: 300
  });

  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.value) {
      toast.error('Заполните все поля');
      return;
    }
    
    const record: DNSRecord = {
      id: Date.now().toString(),
      ...newRecord
    };
    setDnsRecords([...dnsRecords, record]);
    setNewRecord({ type: 'A', name: '', value: '', ttl: 300 });
    toast.success('DNS запись добавлена');
  };

  const handleEditRecord = (record: DNSRecord) => {
    setEditingRecord(record);
  };

  const handleSaveEdit = () => {
    if (!editingRecord || !editingRecord.name || !editingRecord.value) {
      toast.error('Заполните все поля');
      return;
    }

    setDnsRecords(dnsRecords.map(record => 
      record.id === editingRecord.id ? editingRecord : record
    ));
    setEditingRecord(null);
    toast.success('DNS запись обновлена');
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter(record => record.id !== id));
    toast.success('DNS запись удалена');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onSettingsClick={() => {}}
        onSubscriptionClick={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/domain/${domainId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к управлению доменом
            </Button>
            <div>
              <h1 className="text-2xl font-bold">DNS записи - {domainName}</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>DNS записи</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing DNS Records */}
              <div className="space-y-2">
                {dnsRecords.map((record) => (
                  <div key={record.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    {editingRecord?.id === record.id ? (
                      // Edit mode
                      <>
                        <Select 
                          value={editingRecord.type} 
                          onValueChange={(value: DNSRecord['type']) => 
                            setEditingRecord({...editingRecord, type: value})
                          }
                        >
                          <SelectTrigger className="w-20">
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
                        <Input
                          value={editingRecord.name}
                          onChange={(e) => setEditingRecord({...editingRecord, name: e.target.value})}
                          className="w-32"
                          placeholder="Имя"
                        />
                        <Input
                          value={editingRecord.value}
                          onChange={(e) => setEditingRecord({...editingRecord, value: e.target.value})}
                          className="flex-1"
                          placeholder="Значение"
                        />
                        <Input
                          type="number"
                          value={editingRecord.ttl}
                          onChange={(e) => setEditingRecord({...editingRecord, ttl: parseInt(e.target.value)})}
                          className="w-20"
                          placeholder="TTL"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            Сохранить
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            Отмена
                          </Button>
                        </div>
                      </>
                    ) : (
                      // View mode
                      <>
                        <Badge variant="outline">{record.type}</Badge>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <span className="font-mono text-sm">{record.name}</span>
                          <span className="font-mono text-sm truncate">{record.value}</span>
                          <span className="text-sm text-muted-foreground">TTL: {record.ttl}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleEditRecord(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteRecord(record.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Record */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Добавить новую запись</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <Select value={newRecord.type} onValueChange={(value: DNSRecord['type']) => setNewRecord({...newRecord, type: value})}>
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
                  <Input
                    placeholder="Имя"
                    value={newRecord.name}
                    onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                  />
                  <Input
                    placeholder="Значение"
                    value={newRecord.value}
                    onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="TTL"
                      value={newRecord.ttl}
                      onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value)})}
                      className="w-20"
                    />
                    <Button onClick={handleAddRecord}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DomainDNS;
