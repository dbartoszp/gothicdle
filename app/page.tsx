'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Footer } from '@/modules/Footer/Footer';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { useGetCurrentCorrectCharacter } from '@/modules/characters/hooks/useGetCurrentCorrectCharacter/useGetCurrentCorrectCharacter';
import { useSetNextNewCurrentCorrectCharacter } from '@/modules/characters/hooks/useSetNextNewCurrentCorrectCharacter/useSetNextNewCurrentCorrectCharacter';
import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';

export default function Home() {
	const [timeUntilMidnight, setTimeUntilMidnight] = useState('');
	const currentCorrectCharacter = useGetCurrentCorrectCharacter();
	const setNextCorrectCharacter = useSetNextNewCurrentCorrectCharacter();

	const calculateTimeUntilMidnight = (currentDateTime: string): string => {
		const timeString = currentDateTime.split('T')[1].split('+')[0];
		const [currentHours, currentMinutes, currentSeconds] = timeString
			.split(':')
			.map(Number);

		let remainingHours = 23 - currentHours;
		let remainingMinutes = 59 - currentMinutes;
		let remainingSeconds = 59 - currentSeconds;

		if (remainingSeconds < 0) {
			remainingMinutes -= 1;
			remainingSeconds += 60;
		}

		if (remainingMinutes < 0) {
			remainingHours -= 1;
			remainingMinutes += 60;
		}

		if (remainingHours < 0) {
			remainingHours = 0;
		}

		return `${remainingHours} godzin ${remainingMinutes} minut`;
	};

	const handleNextNewCharacter = useCallback(() => {
		setNextCorrectCharacter.mutate();
	}, [setNextCorrectCharacter]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					'http://worldclockapi.com/api/json/cet/now'
				);
				const data = await response.json();
				const currentDateTime = data.currentDateTime;
				const remainingTime =
					calculateTimeUntilMidnight(currentDateTime);

				if (remainingTime === '0 godzin 0 minut') {
					handleNextNewCharacter();
				}

				setTimeUntilMidnight(remainingTime);
			} catch (error) {
				console.error(
					'Failed to fetch data from World Clock API:',
					error
				);
				setTimeUntilMidnight('Error fetching data');
			}
		};

		fetchData();

		const intervalId = setInterval(fetchData, 60000);

		return () => {
			clearInterval(intervalId);
		};
	}, [handleNextNewCharacter]);

	if (!currentCorrectCharacter.isSuccess) {
		return <Text>ERROR</Text>;
	}

	const currentCorrectCharacterData = currentCorrectCharacter.data;

	return (
		<>
			<main className="flex min-h-screen flex-col items-center space-y-12 pt-12">
				<Button onClick={handleNextNewCharacter}>
					charId: {currentCorrectCharacterData.characterId}
				</Button>
				<Text variant="danger">
					Kolejna postać za: {timeUntilMidnight}
				</Text>
				<TitleHeader />
				{currentCorrectCharacterData && (
					<MainGameCard
						correctCharacterId={
							currentCorrectCharacterData.characterId
						}
					/>
				)}
				<Instructions />
			</main>
			<Footer />
		</>
	);
}
