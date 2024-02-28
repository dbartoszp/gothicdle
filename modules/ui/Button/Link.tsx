import {
  BaseButton,
  LinkVariantProps,
} from "@/modules/ui/Button/BaseButton/BaseButton";

type LinkProps = Omit<LinkVariantProps, "as">;

export function Link({ variant = "link", ...rest }: LinkProps) {
  return (
    <BaseButton {...{ ...rest, variant }} as="a">
      {rest.children}
    </BaseButton>
  );
}
