import { MouseEvent, ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type BaseButtonProps = LinkVariantProps | ButtonVariantProps;

type BaseProps = {
	disabled?: boolean;
	children: ReactNode;
	size?: keyof typeof sizes;
	variant?: string;
	rounded?: boolean;
};

export type LinkVariantProps = {
	as: 'a';
	href: string;
	onClick?: (e?: MouseEvent<HTMLAnchorElement>) => void;
} & BaseProps;
export type ButtonVariantProps = {
	as: 'button';
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
} & BaseProps;

type Sizes = {
	sm: string;
	md: string;
	lg: string;
};

type ClassNames = {
	[key: string]: string;
};

const sizes: Sizes = {
	sm: 'px-2.5 py-1.5',
	md: 'px-3.5 py-2',
	lg: 'px-6 py-3',
};

const variants: ClassNames = {
	primary:
		'bg-neutral-950 opacity-80 border border-default-border hover:bg-neutral-800',
	green: 'bg-green-700  enabled:hover:bg-green-600  ',
	danger: 'bg-red-700 text-red-100 enabled:hover:bg-red-600  border border-red-50',
	link: 'bg-neutral-950 opacity-80 border border-default-border hover:bg-neutral-800',
	linkIcon: 'bg-neutral-950 opacity-80 hover:bg-neutral-800',
};
export const BaseButton = (props: BaseButtonProps) => {
	const { variant = 'primary', size = 'md', rounded = false } = props;
	const className = clsx('transition-all duration-300', {
		[variants[variant]]: props.variant,
		[sizes[size]]: props.size,
		'rounded-xl': rounded,
	});
	if (props.as === 'a') {
		return (
			<Link
				href={props.href}
				className={className}
				rel="noopener noreferrer"
				target="_blank"
			>
				{props.children}
			</Link>
		);
	}
	return (
		<button {...props} className={className}>
			{props.children}
		</button>
	);
};
