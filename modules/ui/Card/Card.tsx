import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
}

export const Card = (props: CardProps) => {
  return (
    <div className="w-[90%] md:max-w-xl border border-default-border py-4 px-20 text-center bg-neutral-950 bg-opacity-40">{props.children}</div>
  )
}
