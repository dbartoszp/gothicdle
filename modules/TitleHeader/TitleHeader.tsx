'use client';
import { useState, useEffect } from 'react';
import { Text } from '@/modules/ui/Text/Text';
import { Modal } from '../ui/Modal/Modal';
import { useDisclosure } from '../ui/Modal/useDisclosure/useDisclosure';

export const TitleHeader = () => {
	const [timeRemaining, setTimeRemaining] = useState('');

	const calculateTimeRemaining = () => {
		const now = new Date();

		const midnightCET = new Date(now);

		midnightCET.setHours(24, 0, 0, 0);

		const timeDifference = midnightCET.getTime() - now.getTime();

		const hours = Math.floor(timeDifference / 1000 / 60 / 60);
		const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
		const seconds = Math.floor((timeDifference / 1000) % 60);

		setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
	};

	useEffect(() => {
		const timer = setInterval(calculateTimeRemaining, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="mb-4 flex flex-col space-y-4 text-center md:mb-2 md:mt-4">
			<Text variant="title">Gothicdle</Text>
			<Text variant="danger">Kolejna postac za: {timeRemaining}</Text>
			<Text variant="danger">(00:00 CET)</Text>
		</div>
	);
};
