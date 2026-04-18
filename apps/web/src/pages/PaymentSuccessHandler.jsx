
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import { Helmet } from 'react-helmet';

const PaymentSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [details, setDetails] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const urlClientId = searchParams.get('clientId');
      const serviceId = searchParams.get('serviceId');
      const sessionsAdded = parseInt(searchParams.get('sessionsAdded'), 10) || 0;
      const serviceName = searchParams.get('productName') || 'Service Package';

      if (urlClientId) {
        setClientId(urlClientId);
      }

      if (!sessionId || !urlClientId || !serviceId) {
        setStatus('error');
        setErrorMessage('Missing required payment verification parameters.');
        return;
      }

      try {
        // 1. Verify with backend
        const response = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
        if (!response.ok) throw new Error('Failed to verify session with Stripe');
        
        const data = await response.json();
        
        if (data.payment_status !== 'paid') {
          setStatus('error');
          setErrorMessage('Payment was not completed. Please try again.');
          return;
        }

        // 2. Check if purchase record already exists to prevent duplicate processing
        const existingPurchases = await pb.collection('purchases').getFullList({
          filter: `stripeSessionId="${sessionId}"`,
          $autoCancel: false
        });

        if (existingPurchases.length === 0) {
          const amountPaid = data.amountTotal / 100;
          
          // 3. Create purchase record
          await pb.collection('purchases').create({
            client_id: urlClientId,
            service_id: serviceId,
            price_paid: amountPaid,
            purchase_date: new Date().toISOString().split('T')[0],
            sessions_remaining: sessionsAdded,
            owner: currentUser?.id || '',
            stripeSessionId: sessionId
          }, { $autoCancel: false });

          // Note: We deliberately DO NOT manually add sessionsRemaining to the client record here.
          // The Stripe webhook creates a 'payments' record, which triggers the 'update-sessions-on-payment' 
          // PocketBase hook to safely handle the session increment on the backend.
          // Modifying it here would cause a duplicate addition.
        }

        setDetails({
          amount: data.amountTotal / 100,
          email: data.customerEmail,
          sessions: sessionsAdded,
          serviceName
        });
        setStatus('success');

      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setErrorMessage('An error occurred while verifying your payment. If you were charged, please contact support.');
      }
    };

    if (currentUser) {
      verifyPayment();
    } else {
      // If not strictly authenticated in this context, attempt to verify anyway if we have the session ID
      // since the webhook also processes it. But user needs to be logged in to access dashboard.
      verifyPayment();
    }
  }, [searchParams, currentUser]);

  const handleReturn = () => {
    if (clientId) {
      navigate(`/client-portal/${clientId}?payment_success=true`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <Helmet>
        <title>Payment Status - TRACKPOINT.APP</title>
      </Helmet>
      
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
          <div className={`h-2 w-full ${status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-primary'}`} />
          <CardContent className="p-5 sm:p-8 text-center">
            {status === 'verifying' && (
              <div className="flex flex-col items-center py-6 sm:py-8">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Verifying Payment</h2>
                <p className="text-sm sm:text-base text-slate-500 mt-2 text-balance">Please wait while we confirm your transaction securely with Stripe.</p>
              </div>
            )}

            {status === 'success' && details && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-8 ring-green-50">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Payment Successful!</h2>
                <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">Your package has been successfully renewed.</p>
                
                <div className="w-full bg-slate-50 rounded-xl p-4 sm:p-5 mt-6 sm:mt-8 mb-6 sm:mb-8 border border-slate-100 text-left space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-xs sm:text-sm font-medium text-slate-500">Service</span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 text-right max-w-[60%] truncate">{details.serviceName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-xs sm:text-sm font-medium text-slate-500">Sessions Added</span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900">+{details.sessions}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs sm:text-sm font-medium text-slate-500">Total Paid</span>
                    <span className="font-bold text-base sm:text-lg text-slate-900">${details.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 bg-blue-50 text-blue-700 px-3 sm:px-4 py-3 rounded-lg w-full">
                  <Receipt className="w-4 h-4 mr-2 shrink-0" />
                  <span className="text-left text-balance">A detailed receipt has been sent to <strong className="break-all">{details.email}</strong>.</span>
                </div>

                <Button className="w-full h-11 sm:h-12 text-base sm:text-lg font-medium rounded-xl" onClick={handleReturn}>
                  Return to Portal
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-8 ring-red-50">
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Verification Failed</h2>
                <p className="text-sm sm:text-base text-red-500 mt-3 text-balance font-medium">{errorMessage}</p>
                <div className="mt-6 sm:mt-8 space-y-3 w-full">
                  <Button onClick={handleReturn} className="w-full h-11 sm:h-12 rounded-xl" variant="default">
                    Return to Portal
                  </Button>
                  <Button onClick={() => navigate(-1)} className="w-full h-11 sm:h-12 rounded-xl" variant="outline">
                    Go Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessHandler;
