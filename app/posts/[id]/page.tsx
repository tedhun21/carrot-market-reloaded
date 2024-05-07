import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

import { EyeIcon } from "@heroicons/react/24/solid";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import LikeButton from "@/components/like-button";
import CommentInput from "@/components/comment-input";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-title"],
  revalidate: 60,
});

async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: { postId },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}

function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

async function getPostComments(postId: number) {
  try {
    const comments = await db.comment.findMany({
      where: { post: { id: postId } },
      orderBy: { id: "desc" },
      select: {
        id: true,
        payload: true,
        user: { select: { username: true, avatar: true } },
      },
    });
    return comments;
  } catch (e) {}
}

function getCachedComments(postId: number) {
  const cachedOperation = nextCache(getPostComments, ["post-comments"], {
    tags: [`comments-${postId}`],
  });
  return cachedOperation(postId);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const comments = await getCachedComments(id);

  return (
    <div className="flex flex-col gap-2 p-5 text-white">
      <div>
        <div className="mb-2 flex items-center gap-4">
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col items-start gap-5">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>

      <div className="h-1 w-full bg-gray-100" />

      <div className="pt-4">
        {Array.isArray(comments) && comments.length > 0
          ? comments.map((comment: any) => (
              <div key={comment.id}>
                <div className="flex items-center gap-1">
                  {comment.user.avatar ? (
                    <div>
                      <Image
                        width={20}
                        height={20}
                        className="size-5 rounded-full"
                        src={comment.user.avatar}
                        alt={`${comment.user.username} avatar`}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <span>{comment.user.username}</span>
                </div>
                <span>{comment.payload}</span>
              </div>
            ))
          : null}
      </div>
      <CommentInput postId={id} />
    </div>
  );
}
