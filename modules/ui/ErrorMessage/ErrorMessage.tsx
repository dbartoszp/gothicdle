import { Card } from '../Card/Card';
import { Text } from '../Text/Text';

type ErrorMessageProps = {
	message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
	return (
		<div className="flex justify-center items-center">
			<Text variant="danger">{message}</Text>
		</div>
	);
};
