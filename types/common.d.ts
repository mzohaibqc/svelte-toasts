type Theme = 'light' | 'dark';
export type ToastType = 'success' | 'info' | 'error' | 'warning';

export type Placement =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-center'
  | 'center-center';

export interface ToastProps {
  uid: number;
  title?: string;
  description: string;
  duration: number;
  type: ToastType;
  theme?: Theme;
  placement: Placement;
  showProgress?: boolean;
  remove?: Function;
  update?: Function;
  onRemove?: Function;
  onClick?: Function;
}
