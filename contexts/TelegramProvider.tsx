import Script from 'next/script';
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { ITelegramUser, IWebApp } from '../types/types';

export interface ITelegramContext {
  webApp?: IWebApp;
  user?: ITelegramUser;
}

export const TelegramContext = createContext<ITelegramContext>({});

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null);

  useEffect(() => {
    const app = (window as any).Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
    }
  }, []);

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          user: webApp.initDataUnsafe.user,
        }
      : {};
  }, [webApp]);

  return (
    <TelegramContext.Provider value={value}>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
