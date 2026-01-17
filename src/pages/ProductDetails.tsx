import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Package, 
  ArrowRight, 
  Truck, 
  Shield, 
  RefreshCcw 
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, items, updateQuantity, getTotalItems } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_categories (name)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", product?.category_id)
        .eq("is_active", true)
        .neq("id", id)
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success("تمت الإضافة إلى السلة");
  };

  const getItemQuantity = () => {
    if (!product) return 0;
    const item = items.find((i) => i.id === product.id);
    return item?.quantity || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                <div className="h-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <Package className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-4">
              المنتج غير موجود
            </h1>
            <Button asChild>
              <Link to="/store">
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة للمتجر
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link to="/store" className="hover:text-primary transition-colors">
              المتجر
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden sticky top-24">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-32 w-32 text-muted-foreground" />
                  </div>
                )}
                {product.stock_quantity <= 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-4 right-4 text-lg px-4 py-2"
                  >
                    نفذ المخزون
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              {product.product_categories?.name && (
                <Badge variant="secondary" className="text-sm">
                  {product.product_categories.name}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {product.price} ج.م
                </span>
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
                    متبقي {product.stock_quantity} فقط
                  </Badge>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-lg text-muted-foreground">
                  <p className="leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-6 border-t border-border">
                {getItemQuantity() > 0 ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-muted rounded-lg p-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10"
                        onClick={() => updateQuantity(product.id, getItemQuantity() - 1)}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="w-12 text-center text-xl font-bold">
                        {getItemQuantity()}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10"
                        onClick={handleAddToCart}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button asChild size="lg" className="flex-1">
                      <Link to="/cart">
                        <ShoppingCart className="ml-2 h-5 w-5" />
                        عرض السلة ({getTotalItems()})
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="w-full text-lg h-14"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0}
                  >
                    <ShoppingCart className="ml-2 h-5 w-5" />
                    {product.stock_quantity <= 0 ? "نفذ المخزون" : "أضف إلى السلة"}
                  </Button>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-xl">
                  <Truck className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">توصيل سريع</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-xl">
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">ضمان الجودة</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-xl">
                  <RefreshCcw className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">استبدال سهل</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                منتجات مشابهة
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct: any) => (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        {relatedProduct.image_url ? (
                          <img
                            src={relatedProduct.image_url}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-foreground line-clamp-1">
                          {relatedProduct.name}
                        </h3>
                        <span className="text-primary font-bold">
                          {relatedProduct.price} ج.م
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetails;
