"use client";

import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, Sparkles } from "lucide-react";
import { createStripePortal } from "@/actions/createStripePortal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function UpgradeButton({ compact = false }: { compact?: boolean }) {
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccount = () => {
    startTransition(async () => {
      const stripePortalUrl = await createStripePortal();
      router.push(stripePortalUrl);
    });
  };

  if (!hasActiveMembership && !loading)
    return (
      <Button
        asChild
        className={`bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl h-9 shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-sm ${
          compact ? "w-9 p-0" : "px-3.5 py-1.5 w-full"
        }`}
        title="Upgrade to Plus"
      >
        <Link href="/dashboard/upgrade">
          <Sparkles className="w-4 h-4 fill-white text-white" />
          {!compact && <span>Upgrade to Pro</span>}
        </Link>
      </Button>
    );

  if (loading)
    return (
      <Button
        className={`bg-purple-600/80 text-white rounded-xl h-9 flex items-center justify-center ${
          compact ? "w-9 p-0" : "px-3.5 py-1.5 w-full"
        }`}
      >
        <Loader2Icon className="animate-spin w-4 h-4" />
      </Button>
    );

  return (
    <Button
      onClick={handleAccount}
      disabled={isPending}
      className={`bg-purple-700 hover:bg-purple-800 text-white rounded-xl h-9 shadow-sm flex items-center justify-center gap-1.5 text-sm ${
        compact ? "w-9 p-0" : "px-3.5 py-1.5 w-full"
      }`}
      title="Pro Account Settings"
    >
      {isPending ? (
        <Loader2Icon className="animate-spin w-4 h-4" />
      ) : compact ? (
        <Sparkles className="w-4 h-4 fill-white text-white" />
      ) : (
        <p className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
          <span className="font-bold">PRO</span>
          <span>Account</span>
        </p>
      )}
    </Button>
  );
}
export default UpgradeButton;
