import Link from "next/link";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

import { Prisma } from "@prisma/client";

import db from "@/lib/db";
import ProductList from "@/components/product-list";
import { PlusIcon } from "@heroicons/react/24/solid";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  console.log("hit!!!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Product",
};

// export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="fixed bottom-24 right-8 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
