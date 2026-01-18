import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import AboutSection from "@/components/home/AboutSection";
import PopularProductsSection from "@/components/home/PopularProductsSection";
import BannersSection from "@/components/home/BannersSection";
import BestDealsSection from "@/components/home/BestDealsSection";
import CTASection from "@/components/home/CTASection";
import SuggestedForYouSection from "@/components/home/SuggestedForYouSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <BannersSection />
        <PopularProductsSection />
        <SuggestedForYouSection />
        <AboutSection />
        <BestDealsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;