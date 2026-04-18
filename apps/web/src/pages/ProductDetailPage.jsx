
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { toast } from 'sonner';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, Home, Store } from 'lucide-react';
import Header from '@/components/Header.jsx';
import ShoppingCartSidebar from '@/components/ShoppingCart.jsx';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0QTNCOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id, clientId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToCart, cartItems } = useCart();
  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast.success(`Added ${quantity} x ${product.title} to your cart`);
      } catch (error) {
        toast.error(error.message || "Failed to add to cart");
      }
    }
  }, [product, selectedVariant, quantity, addToCart]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);

    if (variant.image_url && product?.images?.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [product?.images]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await getProduct(id);

        try {
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: [fetchedProduct.id]
          });

          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(variant => {
            variantQuantityMap.set(variant.id, variant.inventory_quantity);
          });

          const productWithQuantities = {
            ...fetchedProduct,
            variants: fetchedProduct.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          };

          setProduct(productWithQuantities);

          if (productWithQuantities.variants && productWithQuantities.variants.length > 0) {
            setSelectedVariant(productWithQuantities.variants[0]);
          }
        } catch (quantityError) {
          throw quantityError;
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const PortalTopBar = () => (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link to={`/client-portal/${clientId}?tab=shop`} className="flex items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portal
      </Link>
      <div className="flex items-center gap-4">
        <span className="font-bold tracking-tight text-slate-900 hidden sm:block">
          TRACK<span className="text-primary">POINT</span>
        </span>
        <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative text-slate-600 hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10">
          <ShoppingCart className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-white">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {clientId ? <PortalTopBar /> : <Header />}
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        {clientId ? <PortalTopBar /> : <Header />}
        <main className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <XCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <Button asChild>
              <Link to={clientId ? `/client-portal/${clientId}?tab=shop` : "/"}>Return to Store</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  const currentImage = product.images[currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 overflow-x-hidden">
      <Helmet>
        <title>{product.title} - Store</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>
      
      {clientId ? <PortalTopBar /> : <Header />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center text-sm text-slate-500 mb-8 font-medium">
          <Link to={clientId ? `/client-portal/${clientId}` : "/"} className="hover:text-primary flex items-center transition-colors">
            <Home className="w-4 h-4 mr-1" /> {clientId ? 'Portal' : 'Home'}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <Link to={clientId ? `/client-portal/${clientId}?tab=shop` : "/"} className="hover:text-primary flex items-center transition-colors">
            <Store className="w-4 h-4 mr-1" /> Shop
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
          <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 lg:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-slate-50 aspect-[4/3] md:aspect-square flex items-center justify-center border border-slate-100 shadow-sm group">
              <img
                src={!currentImage?.url ? placeholderImage : currentImage.url}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 shadow-md p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 shadow-md p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                  {product.ribbon_text}
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 ${
                      index === currentImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={!image.url ? placeholderImage : image.url}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{product.title}</h1>
            {product.subtitle && <p className="text-lg text-slate-500 mb-6 font-medium">{product.subtitle}</p>}

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-extrabold text-primary tracking-tight">{price}</span>
              {selectedVariant?.sale_price_in_cents && (
                <span className="text-xl text-slate-400 line-through font-medium">{originalPrice}</span>
              )}
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.variants.length > 1 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Select Option</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      onClick={() => handleVariantSelect(variant)}
                      className={`h-11 px-5 transition-all ${
                        selectedVariant?.id === variant.id 
                          ? 'bg-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-14 p-1 w-full sm:w-auto">
                <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="rounded-lg h-full w-12 text-slate-600 hover:text-slate-900 hover:bg-slate-200"><Minus size={18} /></Button>
                <span className="w-16 text-center text-slate-900 font-bold text-lg">{quantity}</span>
                <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="rounded-lg h-full w-12 text-slate-600 hover:text-slate-900 hover:bg-slate-200"><Plus size={18} /></Button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full sm:flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all active:scale-[0.98]" 
                disabled={!canAddToCart || !product.purchasable}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              {isStockManaged && canAddToCart && product.purchasable && (
                <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <CheckCircle size={18} /> {availableStock} items available in stock
                </p>
              )}

              {isStockManaged && !canAddToCart && product.purchasable && (
                 <p className="text-sm font-medium text-amber-600 flex items-center gap-2">
                  <XCircle size={18} /> Only {availableStock} items left in stock
                </p>
              )}

              {!product.purchasable && (
                  <p className="text-sm font-medium text-red-500 flex items-center gap-2">
                    <XCircle size={18} /> Currently unavailable for purchase
                  </p>
              )}
            </div>
            
            {product.additional_info?.length > 0 && (
              <div className="mt-8 space-y-6 pt-6 border-t border-slate-100">
                {product.additional_info
                  .sort((a, b) => a.order - b.order)
                  .map((info) => (
                    <div key={info.id}>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">{info.title}</h3>
                      <div className="prose prose-sm prose-slate text-slate-600 max-w-none" dangerouslySetInnerHTML={{ __html: info.description }} />
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <ShoppingCartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </div>
  );
}

export default ProductDetailPage;
