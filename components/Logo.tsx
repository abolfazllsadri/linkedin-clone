import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  width?: number | `${number}`;
  height?: number | `${number}`;
};

export default function Logo({ width = 40, height = 40 }: LogoProps) {
  return (
    <Link href="/">
      <Image
        className="h-8 w-8 rounded-lg object-contain sm:h-10 sm:w-10"
        src="/logo.svg"
        width={width}
        height={height}
        alt="Linkedin logo"
        loading="eager"
      />
    </Link>
  );
}
