import { Web3Container } from '@components/ui/common';
import '../styles/globals.css';

const Noop = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? Noop;
  return (
    <Layout>
      {/* <Web3Container> */}
      <Component {...pageProps} />
      {/* </Web3Container> */}
    </Layout>
  );
}

export default MyApp;
