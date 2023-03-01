import Head from "next/head";
import { GetStaticProps } from "next";
import styles from "./styles.module.scss";
import { createClient } from "../../services/prismic";
import Link from "next/link";


type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: String;
};

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });

  const response = await client.getAllByType("post");

  // console.log(JSON.stringify(response))

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });
  console.log(posts);

  return {
    props: {
      posts,
    },
  };
};
