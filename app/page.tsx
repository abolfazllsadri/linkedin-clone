import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import SignedOut from "@/components/SignedOut";
import UserInfo from "@/components/UserInfo";
import Widget from "@/components/Widget";
import { getAllPosts, getPostById } from "@/mongodb/posts";
import { Show } from "@clerk/nextjs";

export const revalidate = 0;

export default async function Home(props: PageProps<"/">) {
  let posts = await getAllPosts();
  const { postId } = await props.searchParams;

  if (postId) {
    const isPostExists = posts.some((post) => post._id === postId);

    if (!isPostExists) {
      const selectedPost = await getPostById(postId?.toString() ?? "");
      if (selectedPost) posts = [selectedPost, ...posts];
    }
  }

  return (
    <div className="mx-auto mt-5 grid w-full max-w-6xl grid-cols-1 gap-5 px-3 sm:px-4 lg:h-[calc(100vh-6rem)] lg:grid-cols-[220px_minmax(0,1fr)_280px]">
      {/* Left sidebar */}
      <aside className="hidden min-h-0 lg:block">
        <UserInfo posts={posts} />
      </aside>

      {/* Main feed */}
      <section className="flex min-h-0 min-w-0 scrollbar-thin flex-col px-2 lg:overflow-y-auto">
        <Show when="signed-in">
          <PostForm />

          <div className="mt-4 min-h-0 flex-1">
            <PostFeed posts={posts} selectedPostId={postId} />
          </div>
        </Show>

        <div className="mt-20 lg:hidden">
          <SignedOut fontSize="xl" />
        </div>
      </section>

      {/* Right sidebar */}
      <aside className="hidden min-h-0 lg:block">
        <Widget />
      </aside>
    </div>
  );
}
