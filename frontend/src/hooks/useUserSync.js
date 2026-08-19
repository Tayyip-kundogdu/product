/*
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api.js";

// the best way to implement this is by using webhooks
function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({ mutationFn: syncUser });

  useEffect(() => {
    if (isSignedIn && user && !isPending && !isSuccess) {
      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName,
        imageUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

  return { isSynced: isSuccess };
}

export default useUserSync;*/


import { useAuth, useUser } from "`@clerk/clerk-react`";
import { useMutation } from "`@tanstack/react-query`";
import { useEffect, useRef } from "react";
import { syncUser } from "../lib/api.js";

// The preferred production approach is Clerk webhooks.
function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const lastSyncedPayloadRef = useRef(null);

  const { mutate: syncUserMutation, isPending } = useMutation({
    mutationFn: syncUser,
  });

  useEffect(() => {
    if (!isSignedIn || !user || isPending) {
      return;
    }

    const userData = {
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName || user.firstName,
      imageUrl: user.imageUrl,
    };

    const syncKey = JSON.stringify({
      userId: user.id,
      ...userData,
    });

    if (lastSyncedPayloadRef.current === syncKey) {
      return;
    }

    syncUserMutation(userData, {
      onSuccess: () => {
        lastSyncedPayloadRef.current = syncKey;
      },
    });
  }, [isSignedIn, user, isPending, syncUserMutation]);

  return { isSynced: !isPending };
}

export default useUserSync;