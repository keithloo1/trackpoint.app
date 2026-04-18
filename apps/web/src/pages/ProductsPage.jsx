import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Store } from 'lucide-react';
import Header from '@/components/Header.jsx';
import ProductsList from '@/components/ProductsList.jsx';

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 overflow-x-hidden">
      <Helmet>
        <title>Store - TRACKPOINT</title>
      </Helmet>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center text-sm text-slate-500 mb-8 font-medium">
          <Link to="/" className="hover:text-primary flex items-center transition-colors">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <span className="text-slate-900 flex items-center">
            <Store className="w-4 h-4 mr-1" /> Store
          </span>
        </div>

        <div className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Studio Store</h1>
          <p className="text-lg text-slate-600 max-w-2xl text-balance leading-relaxed">
            Browse our collection of premium fitness packages, merchandise, and expert-recommended supplements to enhance your training journey.
          </p>
        </div>

        <ProductsList />
      </main>
    </div>
  );
};

export default ProductsPage;