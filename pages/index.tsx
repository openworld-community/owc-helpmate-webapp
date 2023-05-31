import { TelegramProvider, useTelegram } from '../contexts/TelegramProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const WebApp = () => {
  const { user, webApp } = useTelegram();
  const router = useRouter();

  console.log('tg user', user);
  useEffect(() => {
    router.push({
      pathname: '/role',
      query: { user: user?.id },
    });
  }, []);

  return <div></div>;
};

const WithTelegramProvider = () => {
  return (
    <TelegramProvider>
      <WebApp />
    </TelegramProvider>
  );
};

export default WithTelegramProvider;
