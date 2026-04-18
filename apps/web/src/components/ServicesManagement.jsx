
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import CreateServiceModal from './CreateServiceModal.jsx';
import EditServiceModal from './EditServiceModal.jsx';
import { formatMYR } from '@/lib/utils.js';

const ServicesManagement = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const records = await pb.collection('services').getList(1, 50, {
        filter: `owner="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setServices(records.items);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await pb.collection('services').delete(id, { $autoCancel: false });
        toast.success('Service deleted');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const openEdit = (service) => {
    setSelectedService(service);
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Services Management</h2>
          <p className="text-slate-500">Manage your studio's packages and services.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.sessions_count}</TableCell>
                    <TableCell>{formatMYR(service.base_price)}</TableCell>
                    <TableCell>
                      {service.discount_percentage > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {service.discount_percentage}% OFF
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                          <Pencil className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No services found</h3>
              <p className="text-slate-500 mt-1 mb-4">Create your first service to get started.</p>
              <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateServiceModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={fetchServices} />
      <EditServiceModal service={selectedService} open={isEditOpen} onOpenChange={setIsEditOpen} onSuccess={fetchServices} />
    </div>
  );
};

export default ServicesManagement;
