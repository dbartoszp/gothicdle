import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

export const Card = (props: CardProps) => {
  return (
    <div className='flex w-[90%] flex-col items-center border border-default-border bg-neutral-950 bg-opacity-60 px-20 py-4 text-center md:max-w-5xl md:py-10'>
      {props.children}
    </div>
  );
};
