export type ActionResult = {
  success: boolean;
  message: string;
};

export type User = {
  userId: string;
  userImage: string;
  firstName: string;
  lastName: string;
};

export type Post = {
  _id: string;
  user: User;
  text: string;
  imageUrl?: string;
  imagePublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
  comments: Comment[];
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  _id: string;
  user: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};
