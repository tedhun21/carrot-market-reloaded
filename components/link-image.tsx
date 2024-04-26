"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LinkImage({ product }: { product: any }) {
  const router = useRouter();
  return (
    <button className="relative h-full w-2/3">
      <Image
        src={product.photo}
        alt="product image"
        fill
        className="object-cover"
      />
    </button>
  );
}
