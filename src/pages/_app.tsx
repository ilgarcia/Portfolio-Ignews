import { AppProps } from "next/app";
import { Header } from "../components/Header/Header";
import { SessionProvider } from "next-auth/react";

import Link from "next/link";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../services/prismic";

import "../styles/global.scss";

const NextLinkShim = ({ href, children, locale, ...props }) => {
  return (
    <Link href={href} locale={locale}>
      <a {...props}>{children}</a>
    </Link>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <PrismicProvider
        linkResolver={linkResolver}
        internalLinkComponent={NextLinkShim}
      >
        <PrismicPreview repositoryName={repositoryName}>
          <Component {...pageProps} />
        </PrismicPreview>
      </PrismicProvider>
    </SessionProvider>
  );
}

export default MyApp;
