import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Crown, Gem } from 'lucide-react';

interface CustomerTierProgressProps {
  loyaltyPoints: number;
  totalSpent?: number;
}

// Tier thresholds based on total points earned
const TIER_THRESHOLDS = {
  silver: 0,
  gold: 1000,
  diamond: 5000,
};

export function CustomerTierProgress({ loyaltyPoints, totalSpent = 0 }: CustomerTierProgressProps) {
  const { language } = useLanguage();
  
  // Determine current tier based on points
  const getCurrentTier = () => {
    if (loyaltyPoints >= TIER_THRESHOLDS.diamond) return 'diamond';
    if (loyaltyPoints >= TIER_THRESHOLDS.gold) return 'gold';
    return 'silver';
  };

  const currentTier = getCurrentTier();

  // Get tier info
  const getTierInfo = (tier: string) => {
    const tiers = {
      silver: {
        name: language === 'ar' ? 'فضي' : 'Silver',
        icon: Star,
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/20',
        threshold: TIER_THRESHOLDS.silver,
      },
      gold: {
        name: language === 'ar' ? 'ذهبي' : 'Gold',
        icon: Crown,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/20',
        threshold: TIER_THRESHOLDS.gold,
      },
      diamond: {
        name: language === 'ar' ? 'ماسي' : 'Diamond',
        icon: Gem,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-400/20',
        threshold: TIER_THRESHOLDS.diamond,
      },
    };
    return tiers[tier as keyof typeof tiers];
  };

  const tierInfo = getTierInfo(currentTier);
  const TierIcon = tierInfo.icon;

  // Calculate progress to next tier
  const getProgressToNextTier = () => {
    if (currentTier === 'diamond') {
      return { progress: 100, nextTier: null, pointsNeeded: 0 };
    }

    const nextTier = currentTier === 'silver' ? 'gold' : 'diamond';
    const nextTierInfo = getTierInfo(nextTier);
    const currentTierThreshold = tierInfo.threshold;
    const nextTierThreshold = nextTierInfo.threshold;
    
    const pointsInCurrentTier = loyaltyPoints - currentTierThreshold;
    const pointsNeededForNextTier = nextTierThreshold - currentTierThreshold;
    const progress = Math.min((pointsInCurrentTier / pointsNeededForNextTier) * 100, 100);
    const pointsNeeded = nextTierThreshold - loyaltyPoints;

    return { progress, nextTier: nextTierInfo, pointsNeeded };
  };

  const { progress, nextTier, pointsNeeded } = getProgressToNextTier();

  return (
    <div className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
      {/* Current Tier Display */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${tierInfo.bgColor}`}>
          <TierIcon className={`h-5 w-5 ${tierInfo.color}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${tierInfo.color}`}>
              {tierInfo.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {language === 'ar' ? 'عضوية' : 'Member'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {loyaltyPoints.toLocaleString()} {language === 'ar' ? 'نقطة' : 'points'}
          </div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {nextTier && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className={tierInfo.color}>{tierInfo.name}</span>
            <span>
              {pointsNeeded.toLocaleString()} {language === 'ar' ? 'نقطة للترقية' : 'points to upgrade'}
            </span>
            <span className={nextTier.color}>{nextTier.name}</span>
          </div>
        </div>
      )}

      {/* Diamond tier message */}
      {currentTier === 'diamond' && (
        <div className="text-xs text-center text-cyan-400 mt-2">
          {language === 'ar' ? '🎉 أنت في أعلى مستوى!' : '🎉 You are at the highest tier!'}
        </div>
      )}
    </div>
  );
}
