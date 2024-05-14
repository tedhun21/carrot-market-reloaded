import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

import { UserIcon } from "@heroicons/react/24/solid";

import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import getSession from "@/lib/session";

async function getIsOwner(userId: number) {
  // const session = await getSession();
  // if (session.id) {
  //   return session.id === userId;
  // }
  return false;
}

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

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: { title: true },
  });
  return product;
}

async function checkExistingChatRoom({
  ownerId,
  customerId,
  productId,
}: {
  ownerId: number;
  customerId: number;
  productId: number;
}) {
  const existingRoom = await db.chatRoom.findMany({
    where: {
      users: {
        every: {
          id: {
            in: [ownerId, customerId],
          },
        },
      },
      product: { id: productId },
    },
    select: { id: true },
  });

  if (Boolean(existingRoom.length)) {
    return {
      exists: Boolean(existingRoom.length),
      existingRoomId: existingRoom[0].id,
    };
  } else {
    return { exists: Boolean(existingRoom.length) };
  }
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return { title: product?.title };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
  };

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();

    // chat room 정보에 해당하는 있는지
    if (product.userId && session.id) {
      const { exists, existingRoomId } = await checkExistingChatRoom({
        ownerId: product.userId,
        customerId: session.id,
        productId: +params.id,
      });

      if (exists) {
        redirect(`/chats/${existingRoomId}`);
      } else if (!exists) {
        const room = await db.chatRoom.create({
          data: {
            users: {
              connect: [{ id: product.userId }, { id: session.id }],
            },
            product: {
              connect: { id: product.id },
            },
          },
          select: { id: true },
        });
        redirect(`/chats/${room.id}`);
      }
    }
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon className="size-10" />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 flex w-full max-w-screen-sm items-center justify-between bg-neutral-800 p-5 pb-10">
        <span className="text-lg font-semibold">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            <button className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white">
              Revalidate title cache
            </button>
          </form>
        ) : null}
        <form action={createChatRoom}>
          <button className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}
