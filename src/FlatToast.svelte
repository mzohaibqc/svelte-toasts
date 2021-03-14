<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  /**
   * Default theme for all toasts
   * @type { Theme }
   */
  export let theme = 'light';

  /**
   * Default theme for all toasts
   * @type { ToastProps }
   */
  export let data = {};

  const progress = tweened(1, {
    duration: data.duration,
    easing: linear,
  });

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
</script>

<div
  class="st-toast flat {data.theme || theme} {data.type || 'info'}"
  on:click={onClick}
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <slot name="icon">
    {#if data.type === 'success'}
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
    {:else if data.type === 'info'}
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
    {:else if data.type === 'error'}
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
    {:else}
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
    {/if}
  </slot>

  <div class="st-toast-details">
    {#if data.title}
      <h3 class="st-toast-title">{data.title}</h3>
    {/if}

    <p class="st-toast-description">{data.description}</p>
    <div class="st-toast-extra">
      <slot name="extra" />
    </div>
  </div>
  <button
    class="st-toast-close-btn"
    type="button"
    aria-label="close"
    on:click={onRemove}
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
  {#if data.showProgress}
    <progress
      style="height: {data.duration > 0 ? '4px' : 0}"
      value={$progress}
    />
  {/if}
</div>

<style>
  .st-toast {
    display: flex;
    pointer-events: auto;
    width: 320px;
    height: auto;
    padding-left: 0.875rem;
    color: #fff;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    cursor: pointer;
  }
  .st-toast .st-toast-icon {
    flex-shrink: 0;
    margin-right: 0.875rem;
    margin-top: 0.875rem;
  }
  .st-toast progress[value] {
    appearance: none;
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  .st-toast.dark {
    color: #fff;
    background: #393939;
  }
  .st-toast.dark progress[value]::-webkit-progress-bar {
    background-color: #393939;
  }
  .st-toast.dark .st-toast-close-btn svg {
    fill: #fff;
  }
  .st-toast.dark .st-toast-close-btn:focus {
    border: solid 1px #fff;
  }
  .st-toast.dark.success {
    border-left: 3px solid rgb(22, 163, 74);
  }
  .st-toast.dark.success .st-toast-icon {
    fill: rgb(22, 163, 74);
    color: #fff;
  }
  .st-toast.dark.success progress[value]::-webkit-progress-value {
    background-color: rgb(22, 163, 74);
  }
  .st-toast.dark.info {
    border-left: 3px solid rgb(2, 132, 199);
  }
  .st-toast.dark.info .st-toast-icon {
    fill: rgb(2, 132, 199);
    color: #fff;
  }
  .st-toast.dark.info progress[value]::-webkit-progress-value {
    background-color: rgb(2, 132, 199);
  }
  .st-toast.dark.error {
    border-left: 3px solid rgb(225, 29, 72);
  }
  .st-toast.dark.error .st-toast-icon {
    fill: rgb(225, 29, 72);
    color: #fff;
  }
  .st-toast.dark.error progress[value]::-webkit-progress-value {
    background-color: rgb(225, 29, 72);
  }
  .st-toast.dark.warning {
    border-left: 3px solid rgb(202, 138, 4);
  }
  .st-toast.dark.warning .st-toast-icon {
    fill: rgb(202, 138, 4);
    color: #fff;
  }
  .st-toast.dark.warning progress[value]::-webkit-progress-value {
    background-color: rgb(202, 138, 4);
  }
  .st-toast.light {
    color: #161616;
    fill: #161616;
  }
  .st-toast.light.success {
    border-left: 3px solid rgb(22, 163, 74);
    background: rgba(22, 163, 74, 0.2);
  }
  .st-toast.light.success progress {
    background: rgba(22, 163, 74, 0.2);
  }
  .st-toast.light.success progress[value]::-webkit-progress-bar {
    background-color: transparent;
  }
  .st-toast.light.success progress[value]::-webkit-progress-value {
    background-color: rgb(22, 163, 74);
  }
  .st-toast.light.success .st-toast-icon {
    fill: rgb(22, 163, 74);
  }
  .st-toast.light.success .st-toast-close-btn:focus {
    border: solid 1px rgb(22, 163, 74);
  }
  .st-toast.light.success::before {
    border-color: rgb(22, 163, 74);
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    filter: opacity(0.4);
    border-style: solid;
    border-width: 1px 1px 1px 0;
  }
  .st-toast.light.info {
    border-left: 3px solid rgb(2, 132, 199);
    background: rgba(2, 132, 199, 0.2);
  }
  .st-toast.light.info progress {
    background: rgba(2, 132, 199, 0.2);
  }
  .st-toast.light.info progress[value]::-webkit-progress-bar {
    background-color: transparent;
  }
  .st-toast.light.info progress[value]::-webkit-progress-value {
    background-color: rgb(2, 132, 199);
  }
  .st-toast.light.info .st-toast-icon {
    fill: rgb(2, 132, 199);
  }
  .st-toast.light.info .st-toast-close-btn:focus {
    border: solid 1px rgb(2, 132, 199);
  }
  .st-toast.light.info::before {
    border-color: rgb(2, 132, 199);
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    filter: opacity(0.4);
    border-style: solid;
    border-width: 1px 1px 1px 0;
  }
  .st-toast.light.error {
    border-left: 3px solid rgb(225, 29, 72);
    background: rgba(225, 29, 72, 0.2);
  }
  .st-toast.light.error progress {
    background: rgba(225, 29, 72, 0.2);
  }
  .st-toast.light.error progress[value]::-webkit-progress-bar {
    background-color: transparent;
  }
  .st-toast.light.error progress[value]::-webkit-progress-value {
    background-color: rgb(225, 29, 72);
  }
  .st-toast.light.error .st-toast-icon {
    fill: rgb(225, 29, 72);
  }
  .st-toast.light.error .st-toast-close-btn:focus {
    border: solid 1px rgb(225, 29, 72);
  }
  .st-toast.light.error::before {
    border-color: rgb(225, 29, 72);
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    filter: opacity(0.4);
    border-style: solid;
    border-width: 1px 1px 1px 0;
  }
  .st-toast.light.warning {
    border-left: 3px solid rgb(202, 138, 4);
    background: rgba(202, 138, 4, 0.2);
  }
  .st-toast.light.warning progress {
    background: rgba(202, 138, 4, 0.2);
  }
  .st-toast.light.warning progress[value]::-webkit-progress-bar {
    background-color: transparent;
  }
  .st-toast.light.warning progress[value]::-webkit-progress-value {
    background-color: rgb(202, 138, 4);
  }
  .st-toast.light.warning .st-toast-icon {
    fill: rgb(202, 138, 4);
  }
  .st-toast.light.warning .st-toast-close-btn:focus {
    border: solid 1px rgb(202, 138, 4);
  }
  .st-toast.light.warning::before {
    border-color: rgb(202, 138, 4);
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    filter: opacity(0.4);
    border-style: solid;
    border-width: 1px 1px 1px 0;
  }
  .st-toast-details {
    margin-top: 0.875rem;
    margin-right: 1rem;
    text-align: left;
    align-self: flex-start;
  }
  .st-toast-details .st-toast-title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.125rem;
    letter-spacing: 0.16px;
    font-weight: 600;
    word-break: break-word;
    margin: 0;
    outline: none;
  }
  .st-toast-details .st-toast-description {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.125rem;
    letter-spacing: 0.16px;
    margin-top: 0;
    margin-bottom: 1rem;
    word-break: break-word;
  }
  .st-toast-close-btn {
    outline: 2px solid transparent;
    outline-offset: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: auto;
    padding: 0;
    height: 3rem;
    width: 3rem;
    min-height: 3rem;
    min-width: 3rem;
    transition: outline 110ms, background-color 110ms;
  }
</style>
