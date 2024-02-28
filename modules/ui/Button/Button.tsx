import {
  BaseButton,
  ButtonVariantProps,
} from "@/modules/ui/Button/BaseButton/BaseButton";
import { forwardRef } from "react";

type ButtonProps = Omit<ButtonVariantProps, "as">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", ...rest }, ref) => {
    return (
      <BaseButton {...{ ...rest, variant }} as="button">
        {rest.children}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";
