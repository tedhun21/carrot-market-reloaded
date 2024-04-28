import Image from "next/image";

import { PhotoIcon } from "@heroicons/react/24/solid";

import CloseButton from "@/components/close-button";
import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import LinkImage from "@/components/link-image";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));

  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
      <CloseButton />
      <div className="flex h-1/2 w-full max-w-screen-sm justify-center">
        {product?.photo ? (
          <div className="flex w-full">
            <LinkImage product={product} />
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  {product.user.avatar ? (
                    <div className="relative size-10 overflow-hidden rounded-full">
                      <Image
                        src={product.user.avatar}
                        fill
                        alt="avatar image"
                      />
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-red-500" />
                  )}
                  <span className="text-md font-semibold">
                    {product.user.username}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>{product.description}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>{product.title}</span>
                <span className="text-lg font-semibold">
                  {formatToWon(product.price)}원
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-700 text-neutral-200">
            <PhotoIcon className="h-28" />
          </div>
        )}
      </div>
    </div>
  );
}
