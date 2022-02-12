<script>
  import { base } from "$app/paths";
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">BootstrapToast</h2>

  <div class="grid grid-cols-2 gap-3 max-w-xl">
    <div class="text-center">
      <p>Dark Theme</p>
      <img src={`${base}/images/bootstrap-dark.png`} alt="Dark" />
    </div>
    <div class="text-center">
      <p>Light Theme</p>
      <img src={`${base}/images/bootstrap-light.png`} alt="Light" />
    </div>
  </div>

  <p>
    BootstrapToast component takes "data" prop which is a toast object as described
    <a href={`${base}/toast`} class="text-sky-600 hover:underline">here</a>. You can use BootstrapToast like this.
  </p>

  <pre>{`<script>
  import { toasts, ToastContainer, BootstrapToast }  from "svelte-toasts";
  
  const showToast = () => {
    const toast = toasts.add({
      description: 'Message body',
      component: BootstrapToast, // this will override toast component provided by ToastContainer
    });
  };

</script>

<button on:click={showToast}>Show Toast</button>
<ToastContainer {toasts} let:data={data}>
  <BootstrapToast {data} /> <!-- default slot as toast component -->
</ToastContainer>`}</pre>

  <p>BootstrapToast accepts following optional slots:</p>

  <pre>{`<slot name="icon"></slot>
<slot name="extra"></slot>
<slot name="close-icon"></slot>`}</pre>

<h3 class="text-xl">Icon Slot</h3>
<p>You can provide your own custom icon or any element to be shown as toast icon instead of predefined icons.</p>
<pre>{`<BootstrapToast data={data}>
  <slot name="icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  </slot>
</BootstrapToast>`}</pre>

<h3 class="text-xl">Extra Slot</h3>
<p>You can provide some extra content to be shown below toast message, something like timestamp, some link to other page etc.</p>
<pre>{`<BootstrapToast data={data}>
  <slot name="extra">
    <span class="text-sm text-gray-300">08:15:30 AM</span>
  </slot>
</BootstrapToast>`}</pre>

<h3 class="text-xl">Close Icon Slot</h3>
<p>By default, a cross icon is show inside close button but if you want to change this icon, you can provide your own icon or some text.</p>
<pre>{`<BootstrapToast data={data}>
  <slot name="close-icon">
    <span class="text-sm text-gray-300">Close</span>
  </slot>
</BootstrapToast>`}</pre>

</div>
