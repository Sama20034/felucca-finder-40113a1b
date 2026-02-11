import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // Redirect to Shopify product page using the id as handle
    if (id) {
      navigate(`/shopify-product/${id}`, { replace: true });
    } else {
      navigate('/shop', { replace: true });
    }
  }, [id, navigate]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
