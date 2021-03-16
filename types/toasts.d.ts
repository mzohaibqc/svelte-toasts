import { Writable } from 'svelte/store';
import { ToastProps } from './common';

export interface ToastStore extends Writable<ToastProps[]> {
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

const toasts: ToastStore;

export default toasts;
