import {SvelteComponentTyped} from 'svelte'
///<reference types="svelte" />
<></>;
import { fly, fade } from 'svelte/transition';
import { onMount } from 'svelte';
import { flip } from 'svelte/animate';
import toasts from './toasts';
function render() {

  
  
  
  /*Ωignore_startΩ*/;let $toasts = __sveltets_store_get(toasts);/*Ωignore_endΩ*/

  /**
   * @typedef {'success' | 'info' | 'error' | 'warning'} ToastType
   * @typedef {'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center' | 'center-center'} Placement
   * @typedef {{
      key: string;
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
    }} ToastProps
   */

  /**
   * Default theme for all toasts
   * @type { Theme }
   */
   let theme = 'dark';theme = __sveltets_any(theme);;

  /**
   * Default placement for all toasts
   * @type { Placement }
   */
   let placement = 'bottom-right';placement = __sveltets_any(placement);;

  /**
   * Default type of all toasts
   * @type { ToastType }
   */
   let type = 'info';type = __sveltets_any(type);;

  /**
   * Show progress if showProgress is true and duration is greater then 0
   * @type { boolean }
   */
   let showProgress = false;showProgress = __sveltets_any(showProgress);;
  /**
   * Default duration for all toasts to auto close. 0 to disable auto close
   * @type { number }
   */
   let duration = 3000;duration = __sveltets_any(duration);;
  /**
   * Width of all toasts
   * @type { string }
   */
   let width = '320px';width = __sveltets_any(width);;

  /**
   * Default slot which is Toast component/template which will get toast data
   * @slot {{ data: ToastProps }}
   */

  const placements = [
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left',
    'top-center',
    'bottom-center',
    'center-center',
  ];
  const flyMap = {
    'bottom-right': 400,
    'top-right': -400,
    'bottom-left': 400,
    'top-left': -400,
    'bottom-center': 400,
    'top-center': -400,
    'center-center': -800,
  };
  onMount(() => {
    toasts.setDefaults({
      placement,
      showProgress,
      theme,
      duration,
      type,
    });
  });
;
() => (<>

{__sveltets_each(placements, (placement) => <>
  <div class={`toast-container ${placement}`} style={`width: ${width}`}>
    <ul>
      {__sveltets_each((__sveltets_store_get(toasts), $toasts)
        .filter((n) => n.placement === placement)
        .reverse(), (toast) => (toast.key) && <>
        <li
          {...__sveltets_ensureAnimation(flip(__sveltets_mapElementTag('li'),__sveltets_AnimationMove,{}))}
          {...__sveltets_ensureTransition(fly(__sveltets_mapElementTag('li'),({ y: flyMap[toast.placement], duration: 1000 })))}
          {...__sveltets_ensureTransition(fade(__sveltets_mapElementTag('li'),({ duration: 500 })))}
        >
          {(toast.component) ? <>
            <sveltecomponent this={toast.component} data={toast} />
          </> : <>
            <slot data={toast} />
          </> }
        </li>
      </>)}
    </ul>
  </div>
</>)}


</>);
return { props: {theme: theme , placement: placement , type: type , showProgress: showProgress , duration: duration , width: width} as {
/**
   * Default theme for all toasts
   * @type { Theme }
   */theme?: typeof theme, 
/**
   * Default placement for all toasts
   * @type { Placement }
   */placement?: typeof placement, 
/**
   * Default type of all toasts
   * @type { ToastType }
   */type?: typeof type, 
/**
   * Show progress if showProgress is true and duration is greater then 0
   * @type { boolean }
   */showProgress?: typeof showProgress, 
/**
   * Default duration for all toasts to auto close. 0 to disable auto close
   * @type { number }
   */duration?: typeof duration, 
/**
   * Width of all toasts
   * @type { string }
   */width?: typeof width}, slots: {'default': {data:__sveltets_unwrapArr($toasts
        .filter((n) => n.placement === __sveltets_unwrapArr(placements))
        .reverse())}}, getters: {}, events: {} }}

export default class ToastContainer extends SvelteComponentTyped<ToastContainerProps,ToastContainerEvents,ToastContainerSlots>{
};
const r = (__sveltets_with_any_event(render)) ();
const _ToastContainerProps = r.props;
const _ToastContainerEvents = r.events;
const _ToastContainerSlots = r.slots;
export type ToastContainerProps = typeof _ToastContainerProps;
export type ToastContainerEvents = typeof _ToastContainerEvents;
export type ToastContainerSlots = typeof _ToastContainerSlots;
