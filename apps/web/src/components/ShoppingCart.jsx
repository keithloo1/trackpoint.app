
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi.js';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const location = useLocation();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Add some products before checking out.');
      return;
    }

    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      // Determine correct success and cancel URLs based on whether we are in the client portal
      const match = location.pathname.match(/\/client-portal\/([^/]+)/);
      const clientId = match ? match[1] : null;

      const productNames = cartItems.map(i => i.product.title).join(', ');

      const successUrl = clientId 
        ? `${window.location.origin}/client-portal/${clientId}/success?session_id={CHECKOUT_SESSION_ID}&productName=${encodeURIComponent(productNames)}`
        : `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&productName=${encodeURIComponent(productNames)}`;
        
      const cancelUrl = clientId
        ? `${window.location.origin}/client-portal`
        : window.location.href;

      const { url } = await initializeCheckout({ items, successUrl, cancelUrl });

      clearCart();
      
      // Use window.open for mobile compatibility (bypasses iframe restrictions)
      window.open(url, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem initializing checkout. Please try again.');
    }
  }, [cartItems, clearCart, location.pathname]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="h-full w-full max-w-md bg-white text-slate-900 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6" /> Shopping Cart
              </h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-grow p-5 sm:p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCartIcon size={32} className="text-slate-400" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">Your cart is empty</p>
                  <p className="text-sm mt-1 mb-6">Looks like you haven't added anything yet.</p>
                  <Button onClick={() => setIsCartOpen(false)} variant="outline" className="w-full border-slate-300">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-4 bg-white border border-slate-200 p-3 sm:p-4 rounded-xl shadow-sm">
                    <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                      <img src={item.product.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0QTNCOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K"} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-slate-900 truncate text-sm sm:text-base">{item.product.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 truncate mb-1">{item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                      <p className="text-sm sm:text-base text-primary font-extrabold">
                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <Button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-slate-900 rounded-l-lg rounded-r-none hover:bg-slate-200">-</Button>
                        <span className="w-8 text-center text-sm font-medium text-slate-900">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-slate-900 rounded-r-lg rounded-l-none hover:bg-slate-200">+</Button>
                      </div>
                      <button onClick={() => removeFromCart(item.variant.id)} className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline px-1 py-1">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-end mb-6 text-slate-900">
                  <span className="text-base font-medium text-slate-600">Subtotal</span>
                  <span className="text-2xl font-extrabold tracking-tight">{getCartTotal()}</span>
                </div>
                <Button onClick={handleCheckout} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-sm">
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
