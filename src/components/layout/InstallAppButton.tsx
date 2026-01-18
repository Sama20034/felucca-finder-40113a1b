import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast({
        title: "App Installed!",
        description: "Pink Wish has been added to your home screen.",
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show instructions for iOS or when prompt is not available
      toast({
        title: "Install App",
        description: "On iPhone: Tap Share → Add to Home Screen. On Android: Tap Menu → Install App.",
      });
      return;
    }

    setIsInstalling(true);
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error("Install prompt error:", error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <Button
        disabled
        className="bg-green-500 text-white hover:bg-green-500 cursor-default"
      >
        <Check className="w-5 h-5 mr-2" />
        App Installed
      </Button>
    );
  }

  return (
    <Button
      onClick={handleInstallClick}
      disabled={isInstalling}
      className="bg-gradient-to-r from-primary to-rose-500 text-white hover:from-primary/90 hover:to-rose-500/90 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
    >
      <Download className={`w-5 h-5 mr-2 ${isInstalling ? "animate-bounce" : ""}`} />
      {isInstalling ? "Installing..." : "Download App"}
    </Button>
  );
};

export default InstallAppButton;
