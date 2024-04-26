import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
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

export default async function Products() {
  const initialProducts = await getCachedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="fixed bottom-24 right-8 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
