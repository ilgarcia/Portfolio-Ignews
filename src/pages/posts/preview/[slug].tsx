import { GetStaticProps } from "next";
import { createClient } from "../../../services/prismic";
import * as prismicH from "@prismicio/helpers";
import Head from "next/head";

import styles from "../post.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Router from "next/router";

interface postPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: postPreviewProps) {
  const { data } = useSession();

  useEffect(()=> {
    if (data?.activeSubscription){
      Router.push(`/posts/${post.slug}`)
      return;
    }
  },[data])

  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{__html: post.content}}/>
          <div className={styles.continueReading}>

          Wanna continue reading?
            <Link href="/">
              <a> Subscribe now 🤗</a>
            </Link>
          
          </div>
        </article>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}) => {
  const { slug } = params;

  const client = createClient({ previewData });
  const response = await client.getByUID("post", String(slug));

  const post = {
    slug,
    title: response.data.title,
    content: prismicH.asHTML(response.data.content.splice(0, 3)),
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
    redirect: 60 * 30 // 30 minutes
  };
};

