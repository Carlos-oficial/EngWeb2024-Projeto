'use client';

import { useEffect, useState } from 'react';

export default function Logo({
  size,
  color,
}: {
  size: string;
  color?: string;
}) {
  const [stateSize, setStateSize] = useState<string>(size);

  useEffect(() => {
    setStateSize(size);
  }, [size]);

  return (
    <div
      className={`flex ${stateSize === 'xl' ? 'flex-row space-x-2' : 'flex-col'} items-center justify-center select-none ${color && `text-${color}`}`}
    >
      <i className={`ph-duotone ph-graduation-cap text-${stateSize}`}></i>
      <p className={`text-${stateSize} font-bold font-[ClashDisplay-Bold]`}>
        UniShare
      </p>
      {stateSize === '7xl' && (
        <p className='font-[ClashDisplay-Regular]'>
          Empowering Learning Together
        </p>
      )}
    </div>
  );
}
