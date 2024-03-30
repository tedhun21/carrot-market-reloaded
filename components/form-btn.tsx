"use client";

import { useFormStatus } from "react-dom";

interface FomrButtonProps {
  text: string;
}

export default function FormButton({ text }: FomrButtonProps) {
  const { pending } = useFormStatus();
  console.log(pending);
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
