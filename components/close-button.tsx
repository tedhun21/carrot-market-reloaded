"use client";

import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function CloseButton() {
  const router = useRouter();

  const onCloseClick = () => {
    router.back();
  };
  return (
    <button
      onClick={onCloseClick}
      className="absolute right-5 top-5 text-neutral-200"
    >
      <XMarkIcon className="size-10" />
    </button>
  );
}
