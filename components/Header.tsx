import Logo from "@/components/Logo";
import Search from "@/components/Search";
import HeaderNav from "@/components/HeaderNav";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-2 py-2 sm:min-h-14 sm:flex-nowrap">
      <div className="order-1 shrink-0">
        <Logo />
      </div>

      <div className="order-3 w-full sm:order-2 sm:w-60 sm:shrink-0">
        <Search />
      </div>

      <nav className="order-2 ml-auto shrink-0 sm:order-3">
        <HeaderNav />
      </nav>
    </header>
  );
}
