import { TelegramProvider, useTelegram } from '../contexts/TelegramProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const WebApp = () => {
  const { user } = useTelegram();
  const { push } = useRouter();

  useEffect(() => {
    if (user?.id) {
      push({
        pathname: '/role',
        query: { user: user?.id },
      });
    } else {
      push({
        pathname: '/role',
        query: { user: 1234 },
      });
    }
  }, [user]);

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
