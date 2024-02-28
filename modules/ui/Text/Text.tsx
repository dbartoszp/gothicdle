import clsx from "clsx";
import { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  variant?: string;
};

type ClassNames = {
  [key: string]: string;
};

const variants: ClassNames = {
  default: "text-md",
  title: "text-3xl  tracking-widest",
  subtitle: "text-md tracking-wide text-light-blue",
  subtitleXL: "text-xl tracking-wide text-light-blue",
  description: "text-md text-light-blue-lighter",
  mainInfo: "text-md font-normal",
  danger: "text-md text-red-500",
  green: "text-md text-green-500",
};

export const Text = (props: TextProps) => {
  const { variant = "default" } = props;

  const className = clsx("", { [variants[variant]]: props.variant });

  if (props.variant === "mainInfo")
    return <h1 className={className}>{props.children}</h1>;
  return <h2 className={className}>{props.children}</h2>;
};
