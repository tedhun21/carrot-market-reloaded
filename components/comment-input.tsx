"use client";

import { commentPost } from "@/app/posts/[id]/actions";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function CommnetInput({ postId }: { postId: number }) {
  const [comment, setComment] = useState("");
  const handleComment = async () => {
    if (comment !== "") {
      await commentPost({ postId, payload: comment });
      setComment("");
    }
  };
  return (
    <div className="fixed bottom-4 flex w-full max-w-screen-sm gap-5">
      <input
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
        className="flex-1 rounded-md border-none bg-transparent ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500"
        placeholder="Please Comment on this post."
      />
      <button onClick={handleComment}>
        <ArrowUpCircleIcon className="size-10 text-orange-500" />
      </button>
    </div>
  );
}
