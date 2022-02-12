<script>
  import { base } from "$app/paths";
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">Toasts Store</h2>

  <table>
    <thead>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
    </thead>
    <tbody>
      <tr>
        <td>add</td>
        <td>Function</td>
        <td>
          <div class="text-sm">
            This is key function to show toast. You can pass options and modify the generated toast. It will return
            toast object which you can use to modify or remove that specific toast programmatically, e.g.
            toast1.update(&lbrace; title: 'New Title' &rbrace;)
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div>removeAll</div>
        </td>
        <td>Function</td>
        <td>
          <div class="text-sm">This function removes all toasts and clears store state to empty array</div>
        </td>
      </tr>
      <tr>
        <td>removeLast</td>
        <td>Function</td>
        <td>
          <div class="text-sm">This function removes one toast (if any) that was generated at the end</div>
        </td>
      </tr>
      <tr>
        <td>getById</td>
        <td>Function</td>
        <td>
          <div class="text-sm">This function returns toast data for given id. Every toast has a unique uid</div>
        </td>
      </tr>
      <tr>
        <td>setDefaults</td>
        <td>Function</td>
        <td>
          <div class="text-sm">
            This function sets default options so you don't need to pass those options again and again, e.g. theme,
            placement etc.
          </div>
        </td>
      </tr>
      <tr>
        <td>success</td>
        <td>Function</td>
        <td>
          <div class="text-sm">Show success/green toast</div>
        </td>
      </tr>
      <tr>
        <td>info</td>
        <td>Function</td>
        <td>
          <div class="text-sm">Show info/blue toast</div>
        </td>
      </tr>
      <tr>
        <td>error</td>
        <td>Function</td>
        <td>
          <div class="text-sm">Show error/red toast</div>
        </td>
      </tr>
      <tr>
        <td>warning</td>
        <td>Function</td>
        <td>
          <div class="text-sm">Show warning/orange toast</div>
        </td>
      </tr>
    </tbody>
  </table>

  <p>You can import toasts store like this.</p>

  <pre>{`import { toasts } from 'svelte-toasts';

toasts.setDefaults({
    theme: 'light',
    placement: 'top-right',
    type: 'success',
    duration: 5000
});

const toast = toasts.add({
    title: 'Alert',
    description: 'Your changes will be lost!',
    duration: 0,
});

setTimeout(() => {
    toast.remove();
    // or
    // toasts.getById(toast.uid).remove();
}, 3000);

toasts.error('Something went wrong. Try again later.');`}</pre>

  <p>
    Since <b>toasts</b> is a store so you can use <b>$</b> syntax and you will get an array or toasts which you can loop
    through and implement how you want to show your toasts but most common cases can be handled by just using
    <a href={`${base}/toastcontainer`} class="text-sky-600 hover:underline">ToastContainer</a> component.
  </p>

  <pre>{`import { toasts, ToastContainer } from 'svelte-toasts';

<ToastContainer {toasts} placement="top-right" let:data>
    <FlatToast {data} />
    <!-- Or you can provide your own toast component -->
    <!-- <YourOwnComponent {data} /> -->
</ToastContainer>`}</pre>

  <p>
    Read more about <b>ToastContainer</b>
    <a href={`${base}/toastcontainer`} class="text-sky-600 hover:underline">here</a>.
  </p>
</div>
