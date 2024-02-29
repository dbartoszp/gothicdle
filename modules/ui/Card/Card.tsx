import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
}

export const Card = (props: CardProps) => {
  return (
    <div className="w-[90%] md:max-w-3xl border border-default-border md:py-10 py-4 px-20 text-center bg-neutral-950 bg-opacity-70 flex-col items-center flex">{props.children}</div>
  )
}
