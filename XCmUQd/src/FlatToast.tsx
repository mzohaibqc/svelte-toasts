import {SvelteComponentTyped} from 'svelte'
///<reference types="svelte" />
<></>;
import { onMount } from 'svelte';
import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';
function render() {

  
  
  

  /**
   * Default theme for all toasts
   * @type { Theme }
   */
   let theme = 'light';theme = __sveltets_any(theme);;

  /**
   * Default theme for all toasts
   * @type { ToastProps }
   */
   let data = {};data = __sveltets_any(data);;

  const progress = tweened(1, {
    duration: data.duration,
    easing: linear,
  })/*Ωignore_startΩ*/;let $progress = __sveltets_store_get(progress);/*Ωignore_endΩ*/;

  onMount(() => {
    progress.set(0, { duration: data.duration });
  });

  const onRemove = (e) => {
    e.stopPropagation();
    data.remove();
    if (typeof data.onRemove === 'function') data.onRemove();
  };
  const onClick = () => {
    if (typeof data.onClick === 'function') data.onClick();
  };
;
() => (<>

<div
  class={`st-toast flat ${data.theme || theme} ${data.type || 'info'}`}
  onclick={onClick}
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <slot name="icon">
    {(data.type === 'success') ? <>
      <svg
        class="st-toast-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          d="M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"
        />
        <path
          fill="none"
          d="M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"
          data-icon-path="inner-path"
          opacity="0"
        />
      </svg>
    </> : (data.type === 'info') ? <>
      <svg
        class="st-toast-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 32 32"
        aria-hidden="true"
        ><path
          d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z"
        /></svg
      >
    </> : (data.type === 'error') ? <>
      <svg
        class="st-toast-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        ><path
          d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"
        /><path
          d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"
          data-icon-path="inner-path"
          opacity="0"
        /></svg
      >
    </> : <>
      <svg
        class="st-toast-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        ><path
          d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1	s1,0.4,1,1S10.6,16,10,16z"
        /><path
          d="M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z"
          data-icon-path="inner-path"
          opacity="0"
        /></svg
      >
    </> }
  </slot>

  <div class="st-toast-details">
    {(data.title) ? <>
      <h3 class="st-toast-title">{data.title}</h3>
    </> : <></>}

    <p class="st-toast-description">{data.description}</p>
    <div class="st-toast-extra">
      <slot name="extra" />
    </div>
  </div>
  <button
    class="st-toast-close-btn"
    type="button"
    aria-label="close"
    onclick={onRemove}
  >
    <slot name="close-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="bx--toast-notification__close-icon"
        width="20"
        height="20"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path
          d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"
        />
      </svg>
    </slot>
  </button>
  {(data.showProgress) ? <>
    <progress
      style={`height: ${data.duration > 0 ? '4px' : 0}`}
      value={(__sveltets_store_get(progress), $progress)}
    />
  </> : <></>}
</div>


</>);
return { props: {theme: theme , data: data} as {
/**
   * Default theme for all toasts
   * @type { Theme }
   */theme?: typeof theme, 
/**
   * Default theme for all toasts
   * @type { ToastProps }
   */data?: typeof data}, slots: {'icon': {}, 'extra': {}, 'close-icon': {}}, getters: {}, events: {} }}

export default class FlatToast extends SvelteComponentTyped<FlatToastProps,FlatToastEvents,FlatToastSlots>{
};
const r = (__sveltets_with_any_event(render)) ();
const _FlatToastProps = r.props;
const _FlatToastEvents = r.events;
const _FlatToastSlots = r.slots;
export type FlatToastProps = typeof _FlatToastProps;
export type FlatToastEvents = typeof _FlatToastEvents;
export type FlatToastSlots = typeof _FlatToastSlots;
