import { Button } from "@/components/ui/button";
import { Show, SignInButton } from "@clerk/nextjs";

type SignedOutProps = {
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
};

export default function SignedOut({ fontSize = "base" }: SignedOutProps) {
  return (
    <Show when="signed-out">
      <div className="space-y-2 self-center text-center">
        <p className={`font-medium ${fontSize ? `text-${fontSize}` : ""}`}>
          You&apos;re not signed in!
        </p>

        <SignInButton>
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    </Show>
  );
}
