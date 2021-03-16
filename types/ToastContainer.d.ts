/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte';
import { Placement, Theme, ToastType, ToastProps } from './common';

export interface ToastContainerProps {
  /**
   * Default theme for all toasts
   * @default 'dark'
   */
  theme?: Theme;

  /**
   * Default placement for all toasts
   * @default 'bottom-right'
   */
  placement?: Placement;

  /**
   * Default type of all toasts
   * @default 'info'
   */
  type?: ToastType;

  /**
   * Show progress if showProgress is true and duration is greater then 0
   * @default false
   */
  showProgress?: boolean;

  /**
   * Default duration for all toasts to auto close. 0 to disable auto close
   * @default 3000
   */
  duration?: number;

  /**
   * Width of all toasts
   * @default '320px'
   */
  width?: string;
}

export default class ToastContainer extends SvelteComponentTyped<
  ToastContainerProps,
  {},
  { default: { data: ToastProps } }
> {}
