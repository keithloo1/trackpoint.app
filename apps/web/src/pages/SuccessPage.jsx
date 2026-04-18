import React from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';

const SuccessPage = () => {
  const { clientId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const productName = searchParams.get('productName');

  const PortalTopBar = () => (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <span className="font-bold text-xl tracking-tight text-slate-900">
        TRACK<span className="text-primary">POINT</span>
      </span>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Helmet>
        <title>Payment Successful - TRACKPOINT</title>
      </Helmet>
      
      {clientId ? <PortalTopBar /> : <Header />}
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 md:p-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-lg text-balance leading-relaxed">
            Thank you for your purchase. Your transaction has been completed successfully and your order is confirmed.
            {productName && (
              <span className="block mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800 text-lg">
                {decodeURIComponent(productName)}
              </span>
            )}
          </p>
          
          {sessionId && (
            <div className="bg-slate-50 rounded-xl py-3 px-6 mb-10 w-full border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Order Reference</p>
              <p className="text-sm text-slate-700 font-mono break-all mt-1">{sessionId}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-auto">
            <Button asChild size="lg" className="h-14 px-8 text-base rounded-xl shadow-sm transition-all active:scale-[0.98]">
              <Link to={clientId ? `/client-portal/${clientId}` : "/dashboard"}>
                <Home className="w-5 h-5 mr-2" /> {clientId ? 'Back to Portal' : 'Go to Dashboard'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-xl bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]">
              <Link to={clientId ? `/client-portal/${clientId}?tab=shop` : "/"}>
                <ShoppingBag className="w-5 h-5 mr-2" /> Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuccessPage;