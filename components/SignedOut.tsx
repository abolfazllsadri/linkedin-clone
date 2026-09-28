import { Button } from "@/components/ui/button";
import { Show, SignInButton } from "@clerk/nextjs";

export default function SignedOut() {
  return (
    <Show when="signed-out">
      <div className="space-y-2 self-center text-center">
        <p className="font-medium">You&apos;re not signed in!</p>

        <SignInButton>
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    </Show>
  );
}
