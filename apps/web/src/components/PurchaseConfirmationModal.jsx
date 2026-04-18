
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/context/AuthContext.jsx';

const PurchaseConfirmationModal = ({ open, onOpenChange, service, client, finalPrice, onSuccess }) => {
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!service || !client) return;
    setIsProcessing(true);
    
    try {
      const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&clientId=${client.id}&serviceId=${service.id}&sessionsAdded=${service.sessions_count}&productName=${encodeURIComponent(service.name)}`;
      const cancelUrl = `${window.location.origin}/cancel`;

      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(finalPrice * 100), // convert to cents
          productName: service.name,
          clientEmail: currentUser?.email || '',
          clientId: client.id,
          serviceId: service.id,
          sessionsAdded: service.sessions_count,
          successUrl,
          cancelUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      // Open Stripe Checkout in new tab
      window.open(data.url, '_blank');
      
      onOpenChange(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout process.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            You are about to purchase this service securely via Stripe.
          </DialogDescription>
        </DialogHeader>
        
        {service && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="font-semibold text-slate-900 text-lg">{service.name}</h4>
              <p className="text-sm font-medium text-slate-500 mt-1">{service.sessions_count} Sessions</p>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-medium text-slate-700">Total Due:</span>
                <span className="text-2xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={isProcessing} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</> : 'Proceed to Checkout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseConfirmationModal;
