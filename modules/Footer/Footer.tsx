import { Text } from '../ui/Text/Text';
import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { Link } from '../ui/Button/Link';
export const Footer = () => {
	return (
		<footer className="mt-12 flex w-full flex-row items-center justify-center space-x-6 border border-x-0 border-b-0 border-t-default-border bg-neutral-950 py-16 opacity-95">
			<Link href="https://github.com/dbartoszp/gothicdle">
				<Text>
					<FaGithub size={50} />
				</Text>
			</Link>
			<Link href="https://www.linkedin.com/in/bartosz-pomierny-b751aa274/">
				<Text>
					<FaLinkedin size={50} />
				</Text>
			</Link>
		</footer>
	);
};
