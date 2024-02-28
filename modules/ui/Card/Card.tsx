import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
}

export const Card = (props: CardProps) => {
  return (
    <div className="border border-default-border py-4 px-24 bg-neutral-950 bg-opacity-40">{props.children}</div>
  )
}
