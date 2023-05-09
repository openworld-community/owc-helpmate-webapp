import type { AppProps } from 'next/app';
import { TelegramProvider } from '../contexts/TelegramProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TelegramProvider>
      <Component {...pageProps} />
    </TelegramProvider>
  );
}

export default MyApp;
