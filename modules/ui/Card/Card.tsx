import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  type?: 'flex-col' | 'flex-row';
};

export const Card = ({ children, type = 'flex-col' }: CardProps) => {
  return (
    <div
      className={`flex ${type} w-[90%] items-center border-2 border-default-border bg-neutral-950 bg-opacity-60 px-20 py-8 text-center sm:w-auto md:max-w-5xl md:py-10`}
    >
      {children}
    </div>
  );
};
