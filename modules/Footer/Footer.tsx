import { Text } from "../ui/Text/Text"
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "../ui/Button/Link";
export const Footer = () => {
  return (
    <footer className="w-full bg-neutral-950 opacity-80 py-16 border-b-0 border-x-0 border border-t-default-border flex flex-row space-x-6 items-center justify-center">
        <Link href="https://github.com/dbartoszp">
        <Text><FaGithub size={50}/></Text>
        </Link>
        <Link href="https://www.linkedin.com/in/bartosz-pomierny-b751aa274/">
        <Text><FaLinkedin size={50}/></Text>
        </Link>
    </footer>
  )
}
