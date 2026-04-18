
import React, { useState, useEffect } from 'react';
import { Loader2, ShoppingCart, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { formatMYR } from '@/lib/utils.js';
import { useAuth } from '@/context/AuthContext.jsx';

const PackagePurchaseModal = ({ open, onOpenChange, clientId }) => {
  const { currentUser } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (open) {
      fetchPackages();
    }
  }, [open]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('packages').getFullList({
        sort: 'price',
        $autoCancel: false
      });
      setPackages(records);
    } catch (err) {
      console.error('Error fetching packages:', err);
      toast.error('Failed to load available packages');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg) => {
    try {
      setProcessingId(pkg.id);
      
      const successUrl = `${window.location.origin}/client-portal/${clientId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}&serviceId=${pkg.id}&sessionsAdded=${pkg.sessions}&productName=${encodeURIComponent(pkg.packageName)}`;
      const cancelUrl = `${window.location.origin}/client-portal/${clientId}`;

      const payload = {
        amount: Math.round(pkg.price * 100),
        productName: `${pkg.sessions} Sessions Package - ${pkg.packageName}`,
        clientEmail: currentUser?.email || '',
        clientId: clientId,
        serviceId: pkg.id,
        sessionsAdded: pkg.sessions,
        successUrl,
        cancelUrl
      };

      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorDetail = 'Unknown error';
        try {
          const errorData = await response.json();
          errorDetail = errorData.error || errorData.message || JSON.stringify(errorData);
        } catch (e) {
          errorDetail = response.statusText;
        }
        throw new Error(`Server responded with ${response.status}: ${errorDetail}`);
      }

      const data = await response.json();
      
      if (!data || !data.url) {
        throw new Error('Checkout URL missing from response');
      }

      onOpenChange(false);
      window.open(data.url, '_blank');
      
    } catch (err) {
      console.error('Purchase error:', err);
      toast.error(`Failed to initiate checkout: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg sm:text-2xl font-bold">Purchase Sessions</DialogTitle>
          <DialogDescription className="text-xs sm:text-base">Select a package below to securely purchase more sessions via Stripe.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
            {packages.map(pkg => (
              <Card key={pkg.id} className="flex flex-col border-slate-200 hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-xl font-bold">{pkg.packageName}</CardTitle>
                  <CardDescription className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 sm:mt-2">
                    {formatMYR(pkg.price)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-2 sm:pb-4">
                  <ul className="space-y-1.5 sm:space-y-2">
                    <li className="flex items-center text-xs sm:text-sm text-slate-700">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 shrink-0" />
                      <span className="font-semibold">{pkg.sessions} Sessions</span>
                    </li>
                    {pkg.description && (
                      <li className="flex items-start text-xs sm:text-sm text-slate-600 mt-2">
                        <span className="leading-relaxed">{pkg.description}</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 sm:pt-3">
                  <Button 
                    className="w-full h-11 sm:h-10 text-sm" 
                    onClick={() => handlePurchase(pkg)}
                    disabled={processingId !== null}
                  >
                    {processingId === pkg.id ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4 mr-2" /> Buy Package</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm sm:text-base">
            No packages available for purchase right now.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackagePurchaseModal;
