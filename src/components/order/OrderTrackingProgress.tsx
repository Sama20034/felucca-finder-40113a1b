import { Check, Package, Truck, Home, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderTrackingProgressProps {
  status: string;
  compact?: boolean;
}

const OrderTrackingProgress = ({ status, compact = false }: OrderTrackingProgressProps) => {
  const { t, isRTL } = useLanguage();

  const steps = [
    { key: 'pending', icon: Clock, label: t('orderPending') },
    { key: 'processing', icon: Package, label: t('orderProcessing') },
    { key: 'shipped', icon: Truck, label: t('orderShipped') },
    { key: 'delivered', icon: Home, label: t('orderDelivered') },
  ];

  const isCancelled = status === 'cancelled';
  
  const getStepIndex = () => {
    const index = steps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
  };

  const currentIndex = getStepIndex();

  if (isCancelled) {
    return (
      <div className={`flex items-center justify-center gap-2 ${compact ? 'py-2' : 'py-4'}`}>
        <div className="bg-destructive/10 text-destructive rounded-full p-3">
          <XCircle className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
        </div>
        <span className={`font-medium text-destructive ${compact ? 'text-sm' : 'text-base'}`}>
          {t('orderCancelled')}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full ${compact ? 'py-2' : 'py-4'}`}>
      <div className={`flex items-center justify-between relative ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full mx-8" />
        
        {/* Progress Line Active */}
        <div 
          className="absolute top-5 h-1 bg-primary rounded-full transition-all duration-500 mx-8"
          style={{ 
            [isRTL ? 'right' : 'left']: '2rem',
            width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 4rem)` 
          }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div 
              key={step.key} 
              className={`flex flex-col items-center z-10 ${compact ? 'gap-1' : 'gap-2'}`}
            >
              <div 
                className={`
                  rounded-full flex items-center justify-center transition-all duration-300
                  ${compact ? 'w-8 h-8' : 'w-10 h-10'}
                  ${isCompleted 
                    ? 'bg-primary text-primary-foreground shadow-pink' 
                    : 'bg-muted text-muted-foreground'
                  }
                  ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                `}
              >
                {isCompleted && index < currentIndex ? (
                  <Check className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                ) : (
                  <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                )}
              </div>
              {!compact && (
                <span 
                  className={`
                    text-xs font-medium text-center max-w-[80px]
                    ${isCompleted ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackingProgress;
