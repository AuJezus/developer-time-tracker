import CatImage from "@/public/cat-sad.gif";
import Image from "next/image";

function NotFoundPage() {
  return (
    <div className="my-auto mx-auto flex flex-col items-center gap-8">
      <p className="text-lg text-red-500">404 error</p>
      <h1 className="text-3xl">Could not find what you were looking for :(</h1>
      <Image src={CatImage} alt="Cat filing his nails" />
    </div>
  );
}

export default NotFoundPage;
