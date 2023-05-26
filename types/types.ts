export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: string;
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
  };
  MainButton: MainButton;
  HapticFeedback: any;
  close(): void;
  ready(): void;
}

interface MainButton {
  /**
   * Current button text. Set to CONTINUE by default.
   */
  text: string;
  /**
   * 	Current button color. Set to themeParams.button_color by default.
   */
  color: string;
  /**
   * Current button text color. Set to themeParams.button_text_color by default.
   */
  textColor: string;
  /**
   * Shows whether the button is visible. Set to false by default.
   */
  isVisible: boolean;
  /**
   * Shows whether the button is active. Set to true by default.
   */
  isActive: boolean;
  isProgressVisible: boolean;
  /**
   * A method to set the button text.
   */
  setText(text: string): MainButton;
  /**
   * A method that sets the button press event handler.
   * An alias for Telegram.WebApp.onEvent('mainButtonClicked', callback)
   */
  onClick(callback: Function): MainButton;
  /**
   * A method that removes the button press event handler.
   * An alias for Telegram.WebApp.offEvent('mainButtonClicked', callback)
   */
  offClick(callback: Function): MainButton;
  /**
   * A method to make the button visible.
   */
  show(): MainButton;
  /**
   * A method to hide the button.
   */
  hide(): MainButton;
  /**
   * A method to enable the button.
   */
  enable(): MainButton;
  /**
   * A method to disable the button.
   */
  disable(): MainButton;
  /**
   * A method to show a loading indicator on the button.
   */
  showProgress(leaveActive: boolean): MainButton;
  hideProgress(): MainButton;
  /**
   * A method to set the button parameters.
   */
  setParams(params: MainButtonParams): MainButton;
}
interface MainButtonParams {
  /**
   * Button text.
   */
  text?: string;
  /**
   * Button color.
   */
  color?: string;
  /**
   * Button text color.
   */
  text_color?: string;
  /**
   * Enable the button.
   */
  is_active?: boolean;
  /**
   * Show the button.
   */
  is_visible?: boolean;
}
