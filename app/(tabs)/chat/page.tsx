import db from "@/lib/db";
import getSession from "@/lib/session";
import ChatRoomList from "@/components/chat-room-list";
import { unstable_cache as nextCache } from "next/cache";

const getCachedChatRooms = nextCache(getMyChatRooms, ["chat-rooms"], {
  tags: ["chat-rooms"],
});

async function getMyChatRooms() {
  const session = await getSession();
  const chatRooms = await db.chatRoom.findMany({
    where: { users: { some: { id: { equals: session.id } } } },
    include: {
      product: { select: { title: true, price: true } },
      users: { select: { id: true, username: true, avatar: true } },
      messages: { take: 1, orderBy: { created_at: "desc" } },
    },
  });

  return chatRooms;
}

export default async function Chat() {
  const chatRooms = await getCachedChatRooms();

  return (
    <div>
      <h1 className="border-b-2 border-solid p-2 text-4xl text-white">Chat</h1>
      <div>
        {chatRooms.map((room) => (
          <ChatRoomList key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
