import Skeleton from 'react-loading-skeleton';

export const GuessResultsSkeleton = () => {
	return (
		<div className="border border-default-border">
			<Skeleton height={90} width={300} />
		</div>
	);
};
