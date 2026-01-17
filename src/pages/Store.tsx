import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Store = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem, items, getTotalItems } = useCart();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success("تمت الإضافة إلى السلة");
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">المتجر</h1>
              <p className="text-muted-foreground mt-2">
                تصفح منتجاتنا واختر ما يناسبك
              </p>
            </div>
            <Link to="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="ml-2 h-5 w-5" />
                السلة
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">التصنيفات</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                الكل
              </Button>
              {categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لا توجد منتجات
              </h3>
              <p className="text-muted-foreground">
                لم يتم إضافة منتجات في هذا التصنيف بعد
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <Card key={product.id} className="overflow-hidden group">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      {product.stock_quantity <= 0 && (
                        <Badge variant="destructive" className="absolute top-2 right-2">
                          نفذ المخزون
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {product.price} ج.م
                      </span>
                      {getItemQuantity(product.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => {
                              const item = items.find((i) => i.id === product.id);
                              if (item) {
                                useCart.getState().updateQuantity(product.id, item.quantity - 1);
                              }
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {getItemQuantity(product.id)}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleAddToCart(product)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity <= 0}
                        >
                          <Plus className="ml-1 h-4 w-4" />
                          إضافة
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Store;
