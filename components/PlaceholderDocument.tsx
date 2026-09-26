"use client";

import { FrownIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";

function PlaceholderDocument() {
  const { isOverFileLimit } = useSubscription();
  const router = useRouter();

  const handleClick = () => {
    // Check if user is FREE tier and if theyre over the file limit, push to the upgrade page
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/dashboard/upload");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-2xl bg-purple-50/40 border-2 border-dashed border-purple-200 hover:border-purple-500 hover:bg-purple-50 hover:shadow-md text-purple-600 transition-all duration-200 group"
    >
      {isOverFileLimit ? (
        <FrownIcon className="h-14 w-14 text-amber-500 mb-3" />
      ) : (
        <PlusCircleIcon className="h-14 w-14 text-purple-500 group-hover:scale-110 transition-transform mb-3" />
      )}

      <p className="font-bold text-sm text-gray-700 group-hover:text-purple-700">
        {isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}
      </p>
      <span className="text-xs text-gray-400 mt-1">PDF up to 10MB</span>
    </Button>
  );
}
export default PlaceholderDocument;
