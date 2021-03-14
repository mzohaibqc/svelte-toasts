/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte';
import { Theme, ToastProps } from 'svelte-toasts/types/common';

export interface BootstrapToastProps {
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

export default class BootstrapToast extends SvelteComponentTyped<
  BootstrapToastProps,
  {},
  { ['close-icon']: {}; extra: {}; icon: {} }
> {}
