import { useState } from 'react';

export const useDisclosure = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => {
		setIsOpen((prev) => !prev);
	};
	const open = () => {
		setIsOpen(true);
	};
	const close = () => {
		setIsOpen(false);
	};
	const changeOpenState = (open: boolean) => {
		setIsOpen(open);
	};

	return { isOpen, toggle, open, close, changeOpenState };
};
