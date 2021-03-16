/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte';
import { Theme, ToastProps } from './common';

export interface FlatToastProps {
  /**
   * Default theme for all toasts
   * @default 'light'
   */
  theme?: Theme;

  /**
   * Default theme for all toasts
   * @default {}
   */
  data?: ToastProps;
}

export default class FlatToast extends SvelteComponentTyped<
  FlatToastProps,
  {},
  { ['close-icon']: {}; extra: {}; icon: {} }
> {}
