import { useClerk, useUser } from "@clerk/react";
import { Link } from "react-router-dom";

export function PublicLandingPage() {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn } = useUser();

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">Jottly</h1>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          Multilingual journaling for reading, listening, and language review.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {isSignedIn ? (
          <Link
            to="/journal"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Journal
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => openSignIn()}
            >
              Login
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => openSignUp()}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
