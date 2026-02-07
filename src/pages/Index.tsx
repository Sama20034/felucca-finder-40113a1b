import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BeautyHero from "@/components/home/BeautyHero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutBrand from "@/components/home/AboutBrand";
import BeautyTestimonials from "@/components/home/BeautyTestimonials";
import BeautyCTA from "@/components/home/BeautyCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BeautyHero />
        <FeaturedProducts />
        <AboutBrand />
        <BeautyTestimonials />
        <BeautyCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;