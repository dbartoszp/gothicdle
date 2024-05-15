'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const defaultGameState = {
  guesses: [],
  isCorrectlyGuessed: false,
};

export function RouteChangeListener() {
  const pathname = usePathname();

  useEffect(() => {
    console.log(`Route changed to: ${pathname}`);
    localStorage.setItem('gameStateEndless', JSON.stringify(defaultGameState));
  }, [pathname]);

  return <></>;
}
