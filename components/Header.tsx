import HeaderNav from "@/components/HeaderNav";
import Search from "@/components/Search";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="pb.2.5 mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between">
      <div className="mx-2 flex items-center gap-2">
        <Link href="/">
          <Image
            className="h-10 w-10 rounded-lg object-contain"
            src="/logo.svg"
            width={40}
            height={40}
            alt="Linkedin logo"
            loading="eager"
          />
        </Link>

        <Search />
      </div>

      <HeaderNav />
    </div>
  );
}
