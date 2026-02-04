import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean; // For above-the-fold images
  aspectRatio?: string; // e.g., "16/9", "1/1", "3/4"
  objectFit?: 'cover' | 'contain' | 'fill';
  draggable?: boolean;
  onLoad?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  draggable = true,
  onLoad
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const aspectStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', containerClassName)}
      style={aspectStyle}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0 w-full h-full animate-pulse"
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={draggable}
          onLoad={handleLoad}
          className={cn(
            'transition-opacity duration-500',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
