import { useEffect } from 'react';
import { useTelegram } from '../contexts/TelegramProvider';

export interface MainButtonProps {
  text: string;
  progress?: boolean;
  disable?: boolean;
  onClick?: () => void;
}

export function MainButton(props: MainButtonProps) {
  const mainButton = useTelegram().webApp?.MainButton;

  if (!mainButton) return null;

  useEffect(() => {
    mainButton.setParams({
      color: '#34B547',
    });
  }, []);

  useEffect(() => {
    mainButton.setParams({
      text_color: '#FCFCFC',
    });
  }, []);

  useEffect(() => {
    mainButton.setText(props.text);
  }, []);

  useEffect(() => {
    if (mainButton.isActive && props.disable) {
      mainButton.disable();
    } else if (!mainButton.isActive && !props.disable) {
      mainButton.enable();
    }
  }, []);

  useEffect(() => {
    if (!mainButton.isProgressVisible && props.progress) {
      mainButton.showProgress(false);
    } else if (mainButton.isProgressVisible && !props.progress) {
      mainButton.hideProgress();
    }
  }, []);

  useEffect(() => {
    const click = props.onClick;
    if (!click) {
      return;
    }

    mainButton.onClick(click);
    return () => {
      mainButton.offClick(click);
    };
  }, []);

  useEffect(() => {
    mainButton.show();
    return () => {
      mainButton.hide();
    };
  }, []);

  return null;
}
