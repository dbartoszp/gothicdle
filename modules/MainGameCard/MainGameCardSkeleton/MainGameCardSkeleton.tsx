import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { Instructions } from '../Instructions/Instructions';
import { Footer } from '@/modules/Footer/Footer';
import Skeleton from 'react-loading-skeleton';
import { Card } from '@/modules/ui/Card/Card';

export const MainGameCardSkeleton = () => {
	return (
		<>
			<main className="flex min-h-screen flex-col items-center space-y-12 pt-12">
				<TitleHeader />
				<Card>
					<Skeleton width={300} height={100} />
				</Card>
				<Instructions />
			</main>
			<Footer />
		</>
	);
};
