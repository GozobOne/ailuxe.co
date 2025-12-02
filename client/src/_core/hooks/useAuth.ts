import { useUser, useClerk } from "@clerk/clerk-react";
import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const logout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [signOut]);

  const state = useMemo(() => {
    // Transform Clerk user to match our existing user structure
    const user = clerkUser ? {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      name: clerkUser.fullName || clerkUser.firstName || "User",
      avatar: clerkUser.imageUrl,
      role: clerkUser.publicMetadata?.role as string || "user",
    } : null;

    // Store user info in localStorage for compatibility
    if (user) {
      localStorage.setItem(
        "manus-runtime-user-info",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("manus-runtime-user-info");
    }

    return {
      user,
      loading: !isLoaded,
      error: null,
      isAuthenticated: isSignedIn || false,
    };
  }, [clerkUser, isLoaded, isSignedIn]);

  return {
    ...state,
    refresh: () => {
      // Clerk handles refresh automatically
      return Promise.resolve();
    },
    logout,
  };
}
