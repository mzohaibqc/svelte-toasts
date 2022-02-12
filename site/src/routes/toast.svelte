<script>
  import { base } from "$app/paths";
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">Toast</h2>

  <p>
    A toast is shown based on a toast object in toasts store. When you call toasts.add(options) then a toast object is
    added in toasts store which then is shown by ToastContainer. A toast object looks like this.
  </p>

  <pre>{`{
  title: "Welcome",
  description: "Thanks for trying svelte-toasts!",
  uid: 1615153277482,
  placement: "bottom-right",
  type: "success",
  theme: "dark",
  duration: 0,
  remove: () => { /* implementation */ },
  update: () => { /* implementation */ },
  onClick: () => { console.log("Toast clicked"); }
  onRemove: () => { console.log("Toast removed"); },
  // and whatever properties that you want to add when calling toasts.add(options)
}`}</pre>

  <p>Below is a detail description of every property.</p>

  <table>
    <thead>
      <tr>
        <th>Prop </th>
        <th>Type </th>
        <th>Default </th>
        <th>Description </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="font-semibold">title</div>
        </td>
        <td>
          <div>string</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>Title of toast</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">description</div>
        </td>
        <td>
          <div>string</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>Description/body of toast</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">remove</div>
        </td>
        <td>
          <div>Function</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>Invoking remove method will remove the respective toast object from store/UI. e.g. toast1.remove()</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">update</div>
        </td>
        <td>
          <div>Function</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>
            Invoke update method to update a specific toast values like title, description or duration etc.
            toast.update(&lbrace; title; "Progress: 80%" &rbrace;)
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">onClick</div>
        </td>
        <td>
          <div>Function</div>
        </td>
        <td>
          <div>() =&gt; &lbrace;&rbrace;</div>
        </td>
        <td>
          <div>
            You can provide onClick callback which will be invoked when toast will be clicked (except toast close
            icon/button)
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">onRemove</div>
        </td>
        <td>
          <div>Function</div>
        </td>
        <td>
          <div>() =&gt; &lbrace;&rbrace;</div>
        </td>
        <td>
          <div>
            You can provide onRemove callback which will be invoked when toast will be auto removed or removed by
            clicking on cross icon/button.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">component</div>
        </td>
        <td>
          <div>Svelte Component</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>You can provide your own toast component to render toast for a specific toast object</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">placement</div>
        </td>
        <td>
          <div>string</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>Set placement of current toast, it will override default placement set by ToastContainer</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">showProgress</div>
        </td>
        <td>
          <div>boolean</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>
            If set to "true" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of
            current toast. It will override default value set by ToastContainer.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">theme</div>
        </td>
        <td>
          <div>string</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>
            "dark" and "light" themes are implemented for builtin Toast components but in case of your own Toast
            component, you can implement or leave this feature. This will override default value set by ToastContainer
            if you are using builtin Toast components.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">type</div>
        </td>
        <td>
          <div>string</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>
            Four types of toasts are available i.e. success, info, error and warning. It will override toast type set by
            ToastContainer.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="font-semibold">duration</div>
        </td>
        <td>
          <div>number</div>
        </td>
        <td>
          <div>-</div>
        </td>
        <td>
          <div>
            Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast
            will not be auto removed but user can click on cross icon to remove it. It will override duration specified
            by ToastContainer.
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <p>There are two builtin toast components in this package.</p>

  <ul class="list-disc pl-8">
    <li><a href={`${base}/flattoast`} class="text-sky-600 hover:underline">FlatToast</a></li>
    <li><a href={`${base}/bootstraptoast`} class="text-sky-600 hover:underline">BootstrapToast</a></li>
  </ul>

  <p>
    You can provide as default slot to ToastContainer to use that component for all toasts but if you want to use a
    different design/template for a specific toast, you can provide <b>component</b> property in toast options.
  </p>

  <pre>{`<script>
  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
  
  const showToast = () => {
    const toast = toasts.add({
      description: 'Message body',
      component: BootstrapToast, // this will override toast component provided by ToastContainer
    });
  };
</script>
  
<button on:click={showToast}>Show Toast</button>
<ToastContainer {toasts} let:data={data}>
  <FlatToast {data} /> <!-- default slot as toast component -->
</ToastContainer>`}</pre>
</div>
