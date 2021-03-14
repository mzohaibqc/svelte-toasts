declare module 'svelte-toasts' {
  import { Writable } from 'svelte/store';
  import { SvelteComponentTyped } from 'svelte';
  import { ToastProps } from './ToastContainer';
  import {
    Placement,
    Theme,
    ToastType,
    ToastProps,
  } from 'svelte-toasts/types/common';

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
    width?: 'string';
  }

  export class ToastContainer extends SvelteComponentTyped<
    ToastContainerProps,
    {},
    { default: { data: ToastProps } }
  > {}

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

  export class FlatToast extends SvelteComponentTyped<
    FlatToastProps,
    {},
    { ['close-icon']: {}; extra: {}; icon: {} }
  > {}

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

  export class BootstrapToast extends SvelteComponentTyped<
    BootstrapToastProps,
    {},
    { ['close-icon']: {}; extra: {}; icon: {} }
  > {}

  export interface ToastStore extends Writable<Toast[]> {
    add(options: Partial<ToastProps>): ToastProps;
    success(options: Partial<ToastProps>): ToastProps;
    success(description: string): ToastProps;
    success(description: string, options: Partial<ToastProps>): ToastProps;
    success(
      title: string,
      description: string,
      options?: Partial<ToastProps>
    ): ToastProps;

    info(options: Partial<ToastProps>): ToastProps;
    info(description: string): ToastProps;
    info(description: string, options: Partial<ToastProps>): ToastProps;
    info(
      title: string,
      description: string,
      options?: Partial<ToastProps>
    ): ToastProps;

    error(options: Partial<ToastProps>): ToastProps;
    error(description: string): ToastProps;
    error(description: string, options: Partial<ToastProps>): ToastProps;
    error(
      title: string,
      description: string,
      options?: Partial<ToastProps>
    ): ToastProps;

    warning(options: Partial<ToastProps>): ToastProps;
    warning(description: string): ToastProps;
    warning(description: string, options: Partial<ToastProps>): ToastProps;
    warning(
      title: string,
      description: string,
      options?: Partial<ToastProps>
    ): ToastProps;

    getById(uid: number): ToastProps;
    clearAll(): void;
    clearLast(): void;
    setDefaults(options: Partial<ToastProps>): void;
  }

  export const toasts: ToastStore;
}
// "prepare": "npm run build",
// "prepublishOnly": "npm run build",
