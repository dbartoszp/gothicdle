import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  type?: 'flex-col' | 'flex-row';
  size?: 'md' | 'lg';
  extraClasses?: string;
};

export const Card = ({
  children,
  type = 'flex-col',
  size = 'md',
  extraClasses = '',
}: CardProps) => {
  const sizeClasses =
    size === 'lg'
      ? 'w-[95vw] md:max-w-7xl px-4 md:px-12 py-12 gap-x-6 gap-y-6'
      : 'w-[90%] sm:w-auto md:max-w-5xl px-20 py-8 md:py-10';

  return (
    <div
      className={`flex ${type} items-center border-2 border-default-border bg-neutral-950 bg-opacity-60 text-center ${sizeClasses} ${extraClasses}`}
    >
      {children}
    </div>
  );
};
