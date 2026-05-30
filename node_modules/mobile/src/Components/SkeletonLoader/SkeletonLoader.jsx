import React from 'react';

export const SkeletonLoader = () => (
  <div className="flex flex-col bg-[#16213e]/40 border border-white/5 rounded-2xl overflow-hidden p-3 gap-3">
    <div className="w-full aspect-square rounded-xl shimmer bg-white/5" />
    <div className="h-3 w-4/5 rounded shimmer bg-white/5" />
    <div className="h-3 w-2/5 rounded shimmer bg-white/5" />
    <div className="flex justify-between items-center mt-1">
      <div className="h-4 w-14 rounded shimmer bg-white/5" />
      <div className="w-8 h-8 rounded-full shimmer bg-white/5" />
    </div>
  </div>
);

export default SkeletonLoader;
