
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, PackageX } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { toast } from 'sonner';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi.js';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0QTNCOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index, basePath }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const displayVariant = useMemo(() => product.variants[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted, [displayVariant, hasSale]);
  const originalPrice = useMemo(() => hasSale ? displayVariant.price_formatted : null, [displayVariant, hasSale]);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants.length > 1) {
      navigate(`${basePath}/${product.id}`);
      return;
    }

    const defaultVariant = product.variants[0];

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity);
      toast.success(`${product.title} was added to your cart`);
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
    }
  }, [product, addToCart, navigate, basePath]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={`${basePath}/${product.id}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
          <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden flex items-center justify-center">
            <img
              src={product.image || placeholderImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-all duration-300" />
            {product.ribbon_text && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.ribbon_text}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              {hasSale && (
                <span className="line-through text-slate-400 font-medium">{originalPrice}</span>
              )}
              <span className={hasSale ? "text-red-600" : ""}>{displayPrice}</span>
            </div>
          </div>
          <div className="p-4 sm:p-5 flex flex-col flex-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate mb-1">{product.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">
              {product.subtitle || product.description?.replace(/<[^>]*>?/gm, '').substring(0, 80) || 'Premium product'}
            </p>
            <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-auto h-11 transition-all active:scale-[0.98]">
              <ShoppingCart className="mr-2 w-4 h-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsList = ({ basePath = "/product" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsWithQuantities = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsResponse = await getProducts();

        if (productsResponse.products.length === 0) {
          setProducts([]);
          return;
        }

        const productIds = productsResponse.products.map(product => product.id);

        const quantitiesResponse = await getProductQuantities({
          fields: 'inventory_quantity',
          product_ids: productIds
        });

        const variantQuantityMap = new Map();
        quantitiesResponse.variants.forEach(variant => {
          variantQuantityMap.set(variant.id, variant.inventory_quantity);
        });

        const productsWithQuantities = productsResponse.products.map(product => ({
          ...product,
          variants: product.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }))
        }));

        setProducts(productsWithQuantities);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithQuantities();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading store inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-2xl p-8 text-center max-w-2xl mx-auto border border-red-100">
        <p className="font-semibold text-lg">Failed to load products</p>
        <p className="text-red-500 mt-2">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 bg-white border-red-200 text-red-600 hover:bg-red-50">
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageX className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
        <p className="text-slate-500">We're updating our inventory. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} basePath={basePath} />
      ))}
    </div>
  );
};

export default ProductsList;
