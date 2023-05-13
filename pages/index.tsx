import { TelegramProvider, useTelegram } from '../contexts/TelegramProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const WebApp = () => {
  const { user, webApp } = useTelegram();
  const { push } = useRouter();
  useEffect(() => {
    console.log(user, webApp);

    push(`/profile?user=${user?.id}`)
  }, []);

  return (
    <div></div>
  );
};

const WithTelegramProvider = () => {
  return (
    <TelegramProvider>
      <WebApp />
    </TelegramProvider>
  );
};

export default WithTelegramProvider;