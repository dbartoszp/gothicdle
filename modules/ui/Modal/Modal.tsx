'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { HiXMark } from 'react-icons/hi2';
import { Text } from '../Text/Text';

type ModalProps = {
	children: ReactNode;
	openText: string;
	title: string;
	description?: string;
	openVariant?: string;
	onOpen?: () => void;
	onClose?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export const Modal = ({
	children,
	openText,
	title,
	description,
	openVariant = 'secondary',
	onOpen,
	onClose,
	open,
	onOpenChange,
}: ModalProps) => {
	const handleOpen = () => {
		if (!onOpen) return;
		onOpen();
	};
	const handleClose = () => {
		if (!onClose) return;
		onClose();
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger asChild>
				<Button size="sm" variant={openVariant} onClick={handleOpen}>
					<Text variant="small">{openText}</Text>
				</Button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-neutral-950 opacity-50" />
				<Dialog.Content className="border border-default-border fixed left-1/2 top-1/2 max-h-[80vh] w-11/12 -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-neutral-950 px-10 pb-10 pt-4 shadow-md md:w-7/12 lg:w-5/12">
					<Dialog.Title className="flex w-full justify-between text-2xl font-semibold">
						{title}
						<div>
							<Button size="sm" onClick={handleClose}>
								<HiXMark />
							</Button>
						</div>
					</Dialog.Title>
					<Dialog.Description>{description}</Dialog.Description>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
