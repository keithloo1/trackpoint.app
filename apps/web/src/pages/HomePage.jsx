
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext.jsx';

const HomePage = () => {
  const { isAuthenticated, initialLoading } = useAuth();

  if (initialLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>TRACKPOINT.APP - Professional Session Management</title>
      </Helmet>
      
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-extrabold text-2xl tracking-tight text-primary" style={{ letterSpacing: '-0.02em' }}>
            TRACKPOINT.APP
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          The standard for fitness professionals
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl text-balance mb-6" style={{ letterSpacing: '-0.02em' }}>
          Manage client sessions with <span className="text-primary">zero friction.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance mb-10 leading-relaxed">
          Stop tracking packages on paper or messy spreadsheets. TRACKPOINT.APP gives you and your clients a clear, real-time view of remaining sessions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="text-base h-14 px-8 w-full sm:w-auto" asChild>
            <Link to="/signup">
              Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base h-14 px-8 w-full sm:w-auto bg-white" asChild>
            <Link to="/login">Login to Dashboard</Link>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl text-left">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Real-time Tracking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Deduct sessions instantly and keep an accurate history of every punch.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Client Portals</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Give clients a secure link to view their own remaining sessions anytime.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Automated Invoices</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Generate professional PDF invoices automatically when packages are renewed.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
