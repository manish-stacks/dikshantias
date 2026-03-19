'use client';

const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);

export const QuizSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <div className="h-11 bg-white border-b border-gray-200 px-5 flex items-center justify-between">
      <SkeletonPulse className="h-4 w-36" />
      <SkeletonPulse className="h-4 w-16 rounded-full" />
      <SkeletonPulse className="h-4 w-24" />
    </div>
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <SkeletonPulse className="h-5 w-2/3 mx-auto" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => <SkeletonPulse key={i} className="h-12 w-full" />)}
        </div>
      </div>
    </div>
  </div>
);