import { TelegramProvider, useTelegram } from '../contexts/TelegramProvider';
import CountryList from '../components/CountryList';

const WebApp = () => {
  const { user, webApp } = useTelegram();

  return (
    <div>
      <CountryList />
    </div>
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
