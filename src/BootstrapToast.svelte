<script>
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
  class="st-toast bootstrap {data.theme || theme} {data.type || 'info'}"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  on:click={onClick}
>
  {#if data.title}
    <div class="st-toast-header">
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
      <strong class="st-toast-title">{data.title}</strong>
      <!-- <small class="text-muted">just now</small> -->
      <button
        data-notification-btn
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
    </div>
  {/if}
  <div class="st-toast-body" class:st-toast-no-title={!data.title}>
    {#if !data.title}
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
    {/if}
    <span class="st-toast-description">{data.description}</span>
    {#if !data.title}
      <button
        data-notification-btn
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
    {/if}
    <div class="st-toast-extra">
      <slot name="extra" />
    </div>
  </div>
</div>

<style>
  .st-toast {
    width: 100%;
    pointer-events: auto;
    cursor: pointer;
    z-index: 10000;
    max-width: 100%;
    font-size: 0.875rem;
    pointer-events: auto;
    background-color: rgba(255, 255, 255, 0.85);
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
  }
  .st-toast.success .st-toast-icon {
    fill: rgb(22, 163, 74);
    color: #fff;
  }
  .st-toast.info .st-toast-icon {
    fill: rgb(2, 132, 199);
    color: #fff;
  }
  .st-toast.error .st-toast-icon {
    fill: rgb(225, 29, 72);
    color: #fff;
  }
  .st-toast.warning .st-toast-icon {
    fill: rgb(202, 138, 4);
    color: #fff;
  }
  .st-toast.dark {
    color: #fff;
    background: #393939;
  }
  .st-toast.dark .st-toast-close-btn svg {
    fill: #fff;
  }
  .st-toast.dark .st-toast-close-btn:focus {
    border: solid 1px #fff;
    border-radius: 3px;
  }
  .st-toast.dark .st-toast-close-btn:focus:focus {
    border-color: #fff;
    outline: none;
  }
  .st-toast.dark.success .st-toast-icon {
    fill: rgb(22, 163, 74);
    color: #fff;
  }
  .st-toast.dark.success .st-toast-header {
    border-bottom: solid 1px #fff;
  }
  .st-toast.dark.info .st-toast-icon {
    fill: rgb(2, 132, 199);
    color: #fff;
  }
  .st-toast.dark.info .st-toast-header {
    border-bottom: solid 1px #fff;
  }
  .st-toast.dark.error .st-toast-icon {
    fill: rgb(225, 29, 72);
    color: #fff;
  }
  .st-toast.dark.error .st-toast-header {
    border-bottom: solid 1px #fff;
  }
  .st-toast.dark.warning .st-toast-icon {
    fill: rgb(202, 138, 4);
    color: #fff;
  }
  .st-toast.dark.warning .st-toast-header {
    border-bottom: solid 1px #fff;
  }
  .st-toast.light {
    color: #161616;
  }
  .st-toast.light .st-toast-close-btn svg {
    color: #161616;
  }
  .st-toast.light .st-toast-close-btn:focus {
    border: solid 1px #fff;
    border-radius: 3px;
  }
  .st-toast.light .st-toast-close-btn:focus:focus {
    border-color: #fff;
    outline: none;
  }
  .st-toast.light.success {
    border-color: rgb(22, 163, 74);
    background: rgba(22, 163, 74, 0.2);
  }
  .st-toast.light.success .st-toast-icon {
    fill: rgb(22, 163, 74);
    color: #fff;
  }
  .st-toast.light.success .st-toast-header {
    border-bottom: 1px solid rgb(22, 163, 74);
  }
  .st-toast.light.info {
    border-color: rgb(2, 132, 199);
    background: rgba(2, 132, 199, 0.2);
  }
  .st-toast.light.info .st-toast-icon {
    fill: rgb(2, 132, 199);
    color: #fff;
  }
  .st-toast.light.info .st-toast-header {
    border-bottom: 1px solid rgb(2, 132, 199);
  }
  .st-toast.light.error {
    border-color: rgb(225, 29, 72);
    background: rgba(225, 29, 72, 0.2);
  }
  .st-toast.light.error .st-toast-icon {
    fill: rgb(225, 29, 72);
    color: #fff;
  }
  .st-toast.light.error .st-toast-header {
    border-bottom: 1px solid rgb(225, 29, 72);
  }
  .st-toast.light.warning {
    border-color: rgb(202, 138, 4);
    background: rgba(202, 138, 4, 0.2);
  }
  .st-toast.light.warning .st-toast-icon {
    fill: rgb(202, 138, 4);
    color: #fff;
  }
  .st-toast.light.warning .st-toast-header {
    border-bottom: 1px solid rgb(202, 138, 4);
  }
  .st-toast-header {
    display: flex;
    align-items: center;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-clip: padding-box;
    border-top-left-radius: calc(0.25rem - 1px);
    border-top-right-radius: calc(0.25rem - 1px);
  }
  .st-toast-header .st-toast-title {
    flex: 1;
    text-align: left;
    margin-left: 0.5rem;
    outline: none;
  }
  .st-toast-header .st-toast-close-btn {
    margin-right: -0.375rem;
    margin-left: 0.75rem;
    background: transparent;
    border: 0;
  }
  .st-toast-body {
    position: relative;
    padding: 0.75rem 2rem 0.75rem 2rem;
    word-wrap: break-word;
    text-align: left;
  }
  .st-toast-body.st-toast-no-title {
    padding-left: 0.75rem;
  }
  .st-toast-body.st-toast-no-title .st-toast-icon {
    display: inline-block;
    position: relative;
    top: -1px;
  }
  .st-toast-body.st-toast-no-title .st-toast-description {
    margin-left: 0.5rem;
  }
  .st-toast-body .st-toast-close-btn {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .st-toast-body .st-toast-close-btn:focus {
    border-color: #fff;
  }
</style>
