import { revalidatePath } from "next/cache";

async function getData() {
  const data = await fetch(
    "https://nomad-movies.nomadcoders.workers.dev/movies",
  );
}

export default async function Extras() {
  const action = async () => {
    "use server";
    revalidatePath("/extras");
  };
  await getData();
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-rubick text-6xl">Extras!</h1>
      <h2 className="font-roboto">So much more to learn!</h2>
      <form action={action}>
        <button>revalidate</button>
      </form>
    </div>
  );
}
