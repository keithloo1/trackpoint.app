
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import SetCustomPriceModal from './SetCustomPriceModal.jsx';
import { formatMYR } from '@/lib/utils.js';

const ClientPricingManagement = () => {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [clientsRes, servicesRes] = await Promise.all([
        pb.collection('clients').getList(1, 100, { filter: `userId="${currentUser.id}"`, $autoCancel: false }),
        pb.collection('services').getList(1, 50, { filter: `owner="${currentUser.id}"`, $autoCancel: false })
      ]);
      setClients(clientsRes.items);
      setServices(servicesRes.items);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchPricing = useCallback(async (clientId) => {
    if (!clientId || !currentUser) return;
    try {
      const records = await pb.collection('client_pricing').getFullList({
        filter: `client_id="${clientId}" && owner="${currentUser.id}"`,
        $autoCancel: false
      });
      setPricing(records);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedClientId) {
      fetchPricing(selectedClientId);
    } else {
      setPricing([]);
    }
  }, [selectedClientId, fetchPricing]);

  const handleSetPrice = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client Pricing</h2>
        <p className="text-slate-500">Set custom pricing for specific clients.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="max-w-md mb-6">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Select Client</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.clientName || client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClientId ? (
            services.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Custom Price</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map(service => {
                    const customPricing = pricing.find(p => p.service_id === service.id);
                    return (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{formatMYR(service.base_price)}</TableCell>
                        <TableCell>
                          {customPricing ? (
                            <Badge variant="default" className="bg-primary">
                              {formatMYR(customPricing.custom_price)}
                            </Badge>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleSetPrice(service)}>
                            <DollarSign className="w-4 h-4 mr-1" /> Set Price
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-slate-500">No services available.</div>
            )
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Select a client to view and manage their custom pricing.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClient && selectedService && (
        <SetCustomPriceModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          service={selectedService}
          client={selectedClient}
          existingPricing={pricing.find(p => p.service_id === selectedService.id)}
          onSuccess={() => fetchPricing(selectedClientId)}
        />
      )}
    </div>
  );
};

export default ClientPricingManagement;
