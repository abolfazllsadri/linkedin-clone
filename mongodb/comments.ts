import type { User } from "@/lib/types";
import clientPromise from "@/mongodb/db";
import { getPostsCollection } from "@/mongodb/posts";
import { ObjectId } from "mongodb";

export interface CommentDocument {
  _id?: ObjectId;
  user: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCommentsCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME!);

  return db.collection<CommentDocument>("comments");
}

export async function deleteComment(
  postId: string,
  commentId: string,
  userId: string,
) {
  if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId))
    throw new Error("Invalid comment or post id");

  const client = await clientPromise;
  const session = client.startSession();

  const postObjectId = new ObjectId(postId);
  const commentObjectId = new ObjectId(commentId);

  const posts = await getPostsCollection();
  const comments = await getCommentsCollection();

  try {
    return await session.withTransaction(async () => {
      const comment = await comments.findOne(
        { _id: commentObjectId, "user.userId": userId },
        { session },
      );

      if (!comment) return null;

      const post = await posts.findOne(
        { _id: postObjectId, comments: commentObjectId },
        { projection: { _id: 1 }, session },
      );

      if (!post) return null;

      const deleted = await comments.findOneAndDelete(
        { _id: commentObjectId, "user.userId": userId },
        { session },
      );

      if (!deleted) return null;

      await posts.updateOne(
        { _id: postObjectId },
        {
          $pull: { comments: commentObjectId },
          $set: { updatedAt: new Date() },
        },
        { session },
      );

      return deleted;
    });
  } finally {
    await session.endSession();
  }
}

export async function getCommentsByPostId(postId: string) {
  if (!ObjectId.isValid(postId)) return null;

  const posts = await getPostsCollection();

  const post = await posts.findOne(
    { _id: new ObjectId(postId) },
    { projection: { comments: 1 } },
  );

  if (!post) return null;

  if (!post.comments?.length) return [];

  const comments = await getCommentsCollection();

  return comments
    .find({ _id: { $in: post.comments } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function commentOnPost(postId: string, user: User, text: string) {
  if (!ObjectId.isValid(postId))
    return {
      commentId: null,
      matchedCount: 0,
      modifiedCount: 0,
    };

  const client = await clientPromise;
  const session = client.startSession();

  const postObjectId = new ObjectId(postId);
  const commentId = new ObjectId();
  const now = new Date();

  const posts = await getPostsCollection();
  const comments = await getCommentsCollection();

  try {
    return await session.withTransaction(async () => {
      const post = await posts.findOne(
        { _id: postObjectId },
        { projection: { _id: 1 }, session },
      );

      if (!post)
        return {
          commentId: null,
          matchedCount: 0,
          modifiedCount: 0,
        };

      await comments.insertOne(
        {
          _id: commentId,
          user,
          text,
          createdAt: now,
          updatedAt: now,
        },
        { session },
      );

      const postResult = await posts.updateOne(
        { _id: postObjectId },
        {
          $push: { comments: commentId },
          $set: { updatedAt: now },
        },
        { session },
      );

      return {
        commentId,
        matchedCount: postResult.matchedCount,
        modifiedCount: postResult.modifiedCount,
      };
    });
  } finally {
    await session.endSession();
  }
}
