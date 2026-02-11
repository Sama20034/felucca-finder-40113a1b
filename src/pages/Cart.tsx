import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { t, isRTL } = useLanguage();
  
  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <div className="bg-secondary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              {t('yourCart')}
            </h1>
            <p className="text-secondary-foreground/80">
              {isRTL ? 'راجع منتجاتك وأكمل طلبك' : 'Review your items and complete your order'}
            </p>
          </div>
        </div>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {cartItems.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-card rounded-xl p-4 shadow-sm border border-border flex gap-4">
                      <img 
                        src={item.product.image_url} 
                        alt={isRTL ? item.product.name_ar : item.product.name} 
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {isRTL ? item.product.name_ar : item.product.name}
                        </h3>
                        {/* Display selected size and color */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          {item.selected_size && (
                            <span className="bg-muted px-2 py-0.5 rounded">
                              {isRTL ? 'المقاس:' : 'Size:'} {item.selected_size}
                            </span>
                          )}
                          {item.selected_color && (
                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                              {isRTL ? 'اللون:' : 'Color:'}
                              <span 
                                className="w-3 h-3 rounded-full border border-border inline-block" 
                                style={{ backgroundColor: item.selected_color.hex }}
                              />
                              {isRTL ? item.selected_color.name_ar : item.selected_color.name}
                            </span>
                          )}
                        </div>
                        <p className="text-primary font-bold">{item.product.price} {t('egp')}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock_quantity}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-foreground">{item.product.price * item.quantity} {t('egp')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
                    <h3 className="text-xl font-bold text-foreground mb-6">{t('orderSummary')}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('subtotal')}</span>
                        <span>{cartTotal} {t('egp')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('shipping')}</span>
                        <span>{shipping} {t('egp')}</span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between font-bold text-foreground text-lg">
                        <span>{t('total')}</span>
                        <span className="text-primary">{total.toFixed(2)} {t('egp')}</span>
                      </div>
                    </div>

                    <Link to="/checkout">
                      <Button variant="default" size="lg" className="w-full group mb-4">
                        {t('checkout')}
                        {isRTL 
                          ? <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                          : <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        }
                      </Button>
                    </Link>
                    
                    <Link to="/shop">
                      <Button variant="ghost" className="w-full">{t('continueShopping')}</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('cartEmpty')}</h2>
                <p className="text-muted-foreground mb-6">
                  {isRTL ? 'ابدأ التسوق وأضف منتجات لسلتك' : 'Start shopping and add items to your cart'}
                </p>
                <Link to="/shop">
                  <Button variant="default" size="lg">{t('shop')}</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
