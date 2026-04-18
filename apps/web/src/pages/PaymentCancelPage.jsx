
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Payment Cancelled - TRACKPOINT.APP</title>
      </Helmet>
      
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
          <div className="h-2 w-full bg-yellow-400" />
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-yellow-50">
              <XCircle className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Cancelled</h2>
            <p className="text-slate-500 mt-3 text-balance font-medium leading-relaxed">
              Your checkout process was safely cancelled. No charges were made to your account.
            </p>
            
            <div className="w-full mt-10 space-y-3">
              <Button 
                onClick={() => navigate(-1)} 
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline" 
                className="w-full h-12 border-slate-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
