
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import CancellationPolicySettings from './CancellationPolicySettings.jsx';
import { Building2, Bell, ShieldAlert } from 'lucide-react';

const settingsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  ownerEmail: z.string().email('Please enter a valid owner email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  receiptEmailEnabled: z.boolean(),
  receiptEmail: z.string().email('Please enter a valid receipt email').or(z.literal('')),
  emailNotificationsEnabled: z.boolean(),
  notificationEmail: z.string().email('Please enter a valid notification email').or(z.literal(''))
});

const SettingsModal = ({ open, onOpenChange }) => {
  const { settings, updateSettings } = useClientManagement();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: '',
      ownerEmail: '',
      phone: '',
      address: '',
      description: '',
      receiptEmailEnabled: false,
      receiptEmail: '',
      emailNotificationsEnabled: true,
      notificationEmail: ''
    }
  });

  const receiptEnabled = watch('receiptEmailEnabled');
  const notificationsEnabled = watch('emailNotificationsEnabled');

  useEffect(() => {
    if (open) {
      reset({ 
        businessName: settings.businessName || '',
        ownerEmail: settings.ownerEmail || '',
        phone: settings.phone || '',
        address: settings.address || '',
        description: settings.description || '',
        receiptEmailEnabled: settings.receiptEmailEnabled || false,
        receiptEmail: settings.receiptEmail || '',
        emailNotificationsEnabled: settings.emailNotificationsEnabled ?? true,
        notificationEmail: settings.notificationEmail || ''
      });
    }
  }, [open, settings, reset]);

  const onSubmit = async (data) => {
    await updateSettings(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl">Studio Settings</DialogTitle>
            <DialogDescription>
              Configure your studio details, notifications, and policies.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6 pt-4">
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Company</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="policies" className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden sm:inline">Policies</span>
              </TabsTrigger>
            </TabsList>

            <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="company" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    placeholder="e.g. FitPro Studio" 
                    {...register('businessName')}
                    className={errors.businessName ? 'border-destructive' : ''}
                  />
                  {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Primary Email</Label>
                    <Input 
                      id="ownerEmail" 
                      type="email"
                      placeholder="e.g. owner@studio.com" 
                      {...register('ownerEmail')}
                      className={errors.ownerEmail ? 'border-destructive' : ''}
                    />
                    {errors.ownerEmail && <p className="text-sm text-destructive">{errors.ownerEmail.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="e.g. +1 234 567 8900" 
                      {...register('phone')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Fitness Street, City, State" 
                    {...register('address')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Studio Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Brief description of your studio..." 
                    className="resize-none h-24"
                    {...register('description')}
                  />
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label className="text-base">Client Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automated emails for session deductions and additions.
                      </p>
                    </div>
                    <Controller
                      name="emailNotificationsEnabled"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {notificationsEnabled && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      <Label htmlFor="notificationEmail">Notification Sender Email</Label>
                      <Input 
                        id="notificationEmail" 
                        type="email"
                        placeholder="Defaults to owner email if empty" 
                        {...register('notificationEmail')}
                        className={errors.notificationEmail ? 'border-destructive' : ''}
                      />
                      {errors.notificationEmail && <p className="text-sm text-destructive">{errors.notificationEmail.message}</p>}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <Label className="text-base">Auto-Receipt Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Send a receipt automatically when a client pays.
                      </p>
                    </div>
                    <Controller
                      name="receiptEmailEnabled"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {receiptEnabled && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      <Label htmlFor="receiptEmail">Send Receipts To</Label>
                      <Input 
                        id="receiptEmail" 
                        type="email"
                        placeholder="Defaults to owner email if empty" 
                        {...register('receiptEmail')}
                        className={errors.receiptEmail ? 'border-destructive' : ''}
                      />
                      {errors.receiptEmail && <p className="text-sm text-destructive">{errors.receiptEmail.message}</p>}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-0">
                <CancellationPolicySettings />
              </TabsContent>
            </form>
          </Tabs>
        </div>

        <div className="p-6 pt-0">
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" form="settings-form" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
