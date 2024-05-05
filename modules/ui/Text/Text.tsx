import clsx from 'clsx';
import { ReactNode } from 'react';

type TextProps = {
	children: ReactNode;
	variant?: string;
};

type ClassNames = {
	[key: string]: string;
};

const variants: ClassNames = {
	small: 'text-3xs',
	default: 'text-sm',
	title: 'text-5xl md:text-7xl tracking-widest',
	subtitle: 'text-xl  tracking-wide',
	danger: 'text-md text-red-500',
	green: 'text-md text-green-500',
};

export const Text = (props: TextProps) => {
	const { variant = 'default' } = props;

	const className = clsx('', { [variants[variant]]: props.variant });

	if (props.variant === 'mainInfo')
		return <h1 className={className}>{props.children}</h1>;
	return <h2 className={className}>{props.children}</h2>;
};
