import Image from "next/image";

import getSession from "@/lib/session";
import Link from "next/link";

export default async function ChatRoomList({ room }: { room: any }) {
  const session = await getSession();

  return (
    <Link href={`/chats/${room.id}`} className="text-white">
      <div className="flex gap-3 border-b-[1px] border-solid border-gray-400 p-3">
        <Image
          width={50}
          height={50}
          className="size-12 rounded-full"
          src={
            room.users.filter((user: any) => user.id !== session.id)[0].avatar!
          }
          alt="other person image"
        />
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">
              {
                room.users.filter((user: any) => user.id !== session.id)[0]
                  .username
              }
            </span>
            <div className="flex gap-1 *:text-xs *:font-semibold *:text-gray-400">
              <span>{room.product.title}</span>
              <span>·</span>
              <span>2시간 전</span>
            </div>
          </div>
          <span className="">{room.messages[0].payload}</span>
        </div>
      </div>
    </Link>
  );
}
