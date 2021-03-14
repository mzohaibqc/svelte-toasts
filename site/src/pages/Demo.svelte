<script>
  import { onDestroy } from 'svelte';
  import Button from './../components/Button.svelte';
  import {
    toasts,
    ToastContainer,
    FlatToast,
    BootstrapToast,
  } from 'svelte-toasts';

  let titleNode;

  let title = 'Success';
  let description = 'Form submitted successfully!';
  let duration = 0;
  let placement = 'bottom-right';
  let type = 'success';
  let theme = 'dark';
  let toastType = 'flat';
  let showProgress = false;
  let onClick = () => {
    console.log('Toast clicked');
  };
  let onRemove = () => {
    console.log('Toast removed');
  };

  const addToast = () => {
    if (description.trim()) {
      const toast = toasts.add({
        title,
        description,
        duration: duration * 1000,
        placement,
        type,
        theme,
        showProgress,
        onClick,
        onRemove,
        /*component: BootstrapToast*/
      });

      // const id = setInterval(() => {
      // 	progress += 10;
      // 	toast.update({ description: `Progress: ${progress}%`, type: progress === 100? 'success' : 'info'});
      // 	if (progress === 100) {
      // 		progress = -100;
      // 		clearInterval(id)

      // 	}
      // }, 1000);
    }
  };
  $: if (titleNode) {
    titleNode.focus();
  }

  onDestroy(() => {
    toasts.clearAll();
  });
</script>

<div
  class="flex flex-col container p-4 mx-auto items-center h-auto min-h-screen"
>
  <div class="mt-1">
    <h1 class="text-3xl text-left outline-none">Demo</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-left">
          <span class="text-gray-800 font-bold mt-4 block">Title</span>
          <input
            type="text"
            class="mt-1 block w-full"
            bind:value={title}
            bind:this={titleNode}
            placeholder=""
          />
        </label>
        <label class="block text-left">
          <span class="text-gray-800 font-bold mt-4 block">Description</span>
          <textarea
            class="mt-1 block w-full"
            rows="3"
            bind:value={description}
          />
        </label>
        <label class="block text-left">
          <span class="text-gray-800 font-bold mt-4 block"
            >Duration (seconds)</span
          >
          <input
            type="number"
            class="mt-1 block w-full"
            bind:value={duration}
            placeholder="duration in seconds"
          />
        </label>
        <div class="flex space-x-4 flex-row align-center mt-4">
          <Button autoFocus on:click={addToast}>Show Toast</Button>
          <!-- <button class="ring ring-blue-600 focus:ring-offset-1 ring-offset-blue-100 h-8 px-4 bg-blue-600 focus:bg-blue-600 border-0 focus:outline-none text-white" on:click={addToast}>Show Toast</button> -->
          <button
            class="ring ring-red-600 focus:ring-offset-1 ring-offset-red-100 h-8 px-4 bg-red-600 focus:bg-red-600 border-0 focus:outline-none text-white"
            on:click={toasts.clearAll}>Clear All</button
          >
          <button
            class="ring ring-red-600 focus:ring-offset-1 ring-offset-red-100 h-8 px-4 bg-red-600 focus:bg-red-600 border-0 focus:outline-none text-white"
            on:click={toasts.clearLast}>Clear Last</button
          >
        </div>
      </div>
      <div>
        <div class="block text-left">
          <div class="mt-2">
            <span class="text-gray-800 font-bold mt-4 block"
              >Toast Type / Design</span
            >
            <div>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={toastType}
                  name="toast-type"
                  value="flat"
                />
                <span class="ml-2">FLat</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={toastType}
                  name="toast-type"
                  value="bootstrap"
                />
                <span class="ml-2">Bootstrap</span>
              </label>
            </div>
          </div>
        </div>
        <div class="block text-left">
          <div class="mt-2">
            <span class="text-gray-800 font-bold mt-4 block">Theme</span>
            <div>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={theme}
                  name="theme"
                  value="dark"
                />
                <span class="ml-2">Dark</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={theme}
                  name="theme"
                  value="light"
                />
                <span class="ml-2">Light</span>
              </label>
            </div>
          </div>
        </div>
        <div class="block text-left">
          <div class="mt-2">
            <span class="text-gray-800 font-bold mt-4 block"
              >Placement/Position</span
            >
            <div>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="bottom-right"
                />
                <span class="ml-2">Bottom-Right</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="top-right"
                />
                <span class="ml-2">Top-Right</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="top-left"
                />
                <span class="ml-2">Top-Left</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="bottom-left"
                />
                <span class="ml-2">Bottom-Left</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="bottom-center"
                />
                <span class="ml-2">Bottom-Center</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="top-center"
                />
                <span class="ml-2">Top-Center</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={placement}
                  name="placement"
                  value="center-center"
                />
                <span class="ml-2">Center-Center</span>
              </label>
            </div>
          </div>
        </div>
        <div class="block text-left">
          <div class="mt-2">
            <span class="text-gray-800 font-bold mt-4 block">Type</span>
            <div>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={type}
                  name="type"
                  value="success"
                />
                <span class="ml-2">Success</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={type}
                  name="type"
                  value="info"
                />
                <span class="ml-2">Info</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={type}
                  name="type"
                  value="error"
                />
                <span class="ml-2">Error</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={type}
                  name="type"
                  value="warning"
                />
                <span class="ml-2">Warning</span>
              </label>
            </div>
          </div>
        </div>
        <div class="block text-left">
          <div class="mt-2">
            <span class="text-gray-800 font-bold mt-4 block"
              >Show Progress (only when duration is greater than 0)</span
            >
            <div>
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={showProgress}
                  name="show-progress"
                  value="flat"
                />
                <span class="ml-2">Show Progress</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ToastContainer placement="bottom-right" let:data>
    {#if toastType === 'bootstrap'}
      <BootstrapToast {data} />
    {:else}
      <FlatToast {data} />
    {/if}
  </ToastContainer>
</div>
