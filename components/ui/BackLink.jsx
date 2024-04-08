import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

function BackLink(props) {
  return (
    <Link
      {...props}
      className="absolute flex gap-2 text-muted-foreground items-center text-sm hover:text-primary-foreground transition-colors"
    >
      <BiArrowBack /> {props.children}
    </Link>
  );
}

export default BackLink;
