
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ShoppingBag, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import PurchaseConfirmationModal from './PurchaseConfirmationModal.jsx';
import { formatMYR } from '@/lib/utils.js';

const ClientServicesPage = ({ client }) => {
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  const fetchData = useCallback(async () => {
    if (!client?.userId) return;
    try {
      setLoading(true);
      const [servicesRes, pricingRes] = await Promise.all([
        pb.collection('services').getFullList({ filter: `owner="${client.userId}"`, $autoCancel: false }),
        pb.collection('client_pricing').getFullList({ filter: `client_id="${client.id}"`, $autoCancel: false })
      ]);
      setServices(servicesRes);
      setPricing(pricingRes);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load available services');
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchaseClick = (service, price) => {
    setSelectedService(service);
    setFinalPrice(price);
    setIsPurchaseOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-dashed border-slate-300 mx-2 sm:mx-0">
        <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-slate-900">No services available</h3>
        <p className="text-sm sm:text-base text-slate-500 mt-1 px-4">Your studio hasn't added any services yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map(service => {
          const customPricing = pricing.find(p => p.service_id === service.id);
          const hasDiscount = service.discount_percentage > 0;
          const discountedPrice = service.base_price * (1 - service.discount_percentage / 100);
          
          let displayPrice = service.base_price;
          let isCustom = false;

          if (customPricing) {
            displayPrice = customPricing.custom_price;
            isCustom = true;
          } else if (hasDiscount) {
            displayPrice = discountedPrice;
          }

          return (
            <Card key={service.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-200 border-slate-200">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-between items-start gap-3 sm:gap-4">
                  <CardTitle className="text-lg sm:text-xl font-bold leading-tight">{service.name}</CardTitle>
                  {isCustom && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 shrink-0 text-xs">Special Rate</Badge>
                  )}
                  {!isCustom && hasDiscount && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 shrink-0 text-xs">
                      {service.discount_percentage}% OFF
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">{service.sessions_count} Sessions</p>
              </CardHeader>
              <CardContent className="flex-1 pb-3 sm:pb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{formatMYR(displayPrice)}</span>
                  {(!isCustom && hasDiscount) && (
                    <span className="text-xs sm:text-sm font-medium text-slate-400 line-through">{formatMYR(service.base_price)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="mt-auto pt-3 sm:pt-4">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors h-11 sm:h-10 text-sm" onClick={() => handlePurchaseClick(service, displayPrice)}>
                  Purchase Service
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <PurchaseConfirmationModal
        open={isPurchaseOpen}
        onOpenChange={setIsPurchaseOpen}
        service={selectedService}
        client={client}
        finalPrice={finalPrice}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default ClientServicesPage;
