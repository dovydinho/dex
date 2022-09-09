import Head from 'next/head';
import '../styles/globals.css';

const Noop = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? Noop;

  const meta = {
    title: 'DEX - Web3 Application Demo',
    description: `Full-stack web3 project demo built by Dovydas Lapinskas. Please visit: https://dovydas.io for more details.`,
    type: 'website'
  };

  return (
    <Layout>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:url" content="https://dex.dovydas.io" />

        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Decentralized Exchange" />
        <meta property="og:description" content={meta.description} />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
