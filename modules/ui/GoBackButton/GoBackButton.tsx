'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';

export const GoBackButton = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div>
      <Button size='md' onClick={handleGoBack}>
        Powrot do menu
      </Button>
    </div>
  );
};
