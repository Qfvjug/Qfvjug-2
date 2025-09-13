import React from 'react';

const Loading = ({ 
  size = 'default', 
  text = 'Lädt...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-muted rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        
        {/* Inner Ring */}
        <div className={`absolute inset-2 border-2 border-muted rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="absolute inset-0 border-2 border-transparent border-b-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
      
      {text && (
        <p className="text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner />
    </div>
  );
};

// Skeleton Loading Components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-muted rounded-lg p-4 space-y-3">
      <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-muted-foreground/20 rounded"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
        <div className="h-6 bg-muted-foreground/20 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const SkeletonVideo = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-muted rounded-lg overflow-hidden">
      <div className="aspect-video bg-muted-foreground/20"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted-foreground/20 rounded w-4/5"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-muted-foreground/20 rounded w-24"></div>
          <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index}
        className={`h-3 bg-muted-foreground/20 rounded ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

// Loading States for specific components
export const VideoGridLoading = ({ count = 8 }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonVideo key={index} />
    ))}
  </div>
);

export const NewsLoading = ({ count = 3 }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export const DownloadGridLoading = ({ count = 6 }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-muted rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted-foreground/20 rounded w-3/4"></div>
              <div className="flex space-x-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-16"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-12"></div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted-foreground/20 rounded"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-4/5"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-16 w-16 bg-muted-foreground/20 rounded"></div>
            <div className="h-16 w-16 bg-muted-foreground/20 rounded"></div>
            <div className="h-16 w-16 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-muted-foreground/20 rounded w-20"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-24"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-muted-foreground/20 rounded flex-1"></div>
            <div className="h-8 bg-muted-foreground/20 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Loading;

