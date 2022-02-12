<script>
  import { base } from "$app/paths";
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">Custom Toast</h2>

  <p>
    If <a href={`${base}/flattoast`} class="text-sky-600 hover:underline">FlatToast</a> or
    <a href={`${base}/bootstraptoast`} class="text-sky-600 hover:underline">BootstrapToast</a> do not fullfil your needs even
    after overriding styles, you can create and use your own toast component. ToastContainer has default slot which acts
    as Toast Component template. You can write inline markup or create a stand alone component which takes a "data" prop
    which is actually a toast object. You read about toast object
    <a href={`${base}/toast`} class="text-sky-600 hover:underline">here</a>
  </p>

  <h2 class="text-xl">Inline Template</h2>

  <pre>{`<script>
  import { toasts, ToastContainer }  from "svelte-toasts";
  
  const showToast = () => {
    const toast = toasts.add({
      title: 'Hello',
      description: 'Message body',
    });
  };
</script>

<button on:click={showToast}>Show Toast</button>
<ToastContainer {toasts} let:data={data}>
  <div class="my-toast {data.type}">
    <button on:click={data.remove}>Close</button>
    <p class="title">{data.title}</p>
    <hr>
    <p class="description">{data.description}</p>
    <div>
      Some other content here.
    </div>
  </div>
</ToastContainer>`}</pre>

  <h2 class="text-xl">Custom Toast Component</h2>

  <pre>{`// MyToast.svelte
<script>
  export let data;
</script>

<div class="my-toast {data.type}">
  <button on:click={data.remove}>Close</button>
  <p class="title">{data.title}</p>
  <hr>
  <p class="description">{data.description}</p>
  <div>
    <slot>Some other content here.</slot>
  </div>
</div>`}</pre>

  <p>And now you can use that component as toast template</p>

  <pre>{`<script>
  import { toasts, ToastContainer } from "svelte-toasts";
  import MyToast from './MyToast.svelte';
  
  const showToast = () => {
    const toast = toasts.add({
      title: 'Hello',
      description: 'Message body',
    });
  };

<script>

<button on:click={showToast}>Show Toast</button>
<ToastContainer {toasts} let:data={data}>
  <MyToast {data} />
</ToastContainer>`}</pre>
</div>
