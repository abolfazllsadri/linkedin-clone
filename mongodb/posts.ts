import type { Post, User } from "@/lib/types";
import { ObjectId } from "mongodb";
import clientPromise from "@/mongodb/db";
import { getCommentsCollection } from "@/mongodb/comments";

interface PostDocument {
  _id?: ObjectId;
  user: User;
  text: string;
  imageUrl?: string;
  imagePublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
  comments: ObjectId[];
  likes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentDocument {
  _id: ObjectId;
  user: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostDocumentWithComments extends Omit<PostDocument, "comments"> {
  _id: ObjectId;
  comments: CommentDocument[];
}

function toPlainPost(doc: PostDocumentWithComments): Post {
  return {
    _id: doc._id.toString(),
    user: doc.user,
    text: doc.text,
    imageUrl: doc.imageUrl,
    imagePublicId: doc.imagePublicId,
    videoUrl: doc.videoUrl,
    videoPublicId: doc.videoPublicId,
    comments: doc.comments.map((comment) => ({
      _id: comment._id.toString(),
      user: comment.user,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })),
    likes: doc.likes ?? [],
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getPostsCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME!);

  return db.collection<PostDocument>("posts");
}

export async function createPost(post: Omit<PostDocument, "_id">) {
  const posts = await getPostsCollection();
  const result = await posts.insertOne(post);
  return result.insertedId;
}

export async function getAllPosts(limit = 20): Promise<Post[]> {
  const posts = await getPostsCollection();

  const docs = await posts
    .aggregate<PostDocumentWithComments>([
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          let: { commentIds: "$comments" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$commentIds"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "comments",
        },
      },
    ])
    .toArray();

  return docs.map(toPlainPost);
}

export async function getPostById(postId: string) {
  if (!ObjectId.isValid(postId)) return null;

  const posts = await getPostsCollection();

  const docs = await posts
    .aggregate<PostDocumentWithComments>([
      { $match: { _id: new ObjectId(postId) } },
      {
        $lookup: {
          from: "comments",
          let: { commentIds: "$comments" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$commentIds"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "comments",
        },
      },
    ])
    .toArray();

  if (!docs.length) return null;

  return toPlainPost(docs[0]);
}

export async function deletePost(postId: string, userId: string) {
  if (!ObjectId.isValid(postId)) throw new Error("Invalid post id");

  const posts = await getPostsCollection();
  const comments = await getCommentsCollection();

  const deletedPost = await posts.findOneAndDelete({
    _id: new ObjectId(postId),
    "user.userId": userId,
  });

  if (!deletedPost) return null;

  if (deletedPost.comments.length > 0)
    await comments.deleteMany({ _id: { $in: deletedPost.comments } });

  return deletedPost;
}

export async function likePost(postId: string, userId: string) {
  const posts = await getPostsCollection();

  const result = await posts.findOneAndUpdate(
    { _id: new ObjectId(postId) },
    {
      $addToSet: {
        likes: userId,
      },
      $set: {
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  return result;
}

export async function unlikePost(postId: string, userId: string) {
  const posts = await getPostsCollection();

  const result = await posts.findOneAndUpdate(
    { _id: new ObjectId(postId) },
    {
      $pull: { likes: userId },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  return result;
}

export async function getSearchPosts(
  query: string,
  limit = 5,
): Promise<Post[]> {
  const posts = await getPostsCollection();

  const regex = new RegExp(escapeRegex(query), "i");

  const docs = await posts
    .aggregate<PostDocumentWithComments>([
      { $match: { text: { $regex: regex } } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          let: { commentIds: "$comments" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$commentIds"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "comments",
        },
      },
    ])
    .toArray();

  return docs.map(toPlainPost);
}
