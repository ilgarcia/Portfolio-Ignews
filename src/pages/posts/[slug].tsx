import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { createClient } from "../../services/prismic";
import * as prismicH from "@prismicio/helpers";
import Head from "next/head";

import styles from "./post.module.scss";

interface postProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: postProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}}/>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  previewData,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  console.log(session)

  if (!session?.activeSubscription) {
    return {
      redirect:{
        destination: `/posts/preview/${slug}`,
        permanent: false,
      }
    }
  }

  const client = createClient({ previewData });
  const response = await client.getByUID("post", String(slug));

  const post = {
    slug,
    title: response.data.title,
    content: prismicH.asHTML(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};

