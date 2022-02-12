<script>
  import { base } from "$app/paths";
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">Toasts Store</h2>

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
          <div class="text-sm text-gray-600 font-bold">toasts</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">store object</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">-</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">
            toasts store object that will be used in ToastContainer component to show toasts.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-sm text-gray-600 font-bold">placement</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">string</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">bottom-right</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">Set default placement of toasts</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-sm text-gray-600 font-bold">showProgress</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">boolean</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">false</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">
            If set to "true" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of
            every toast.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-sm text-gray-600 font-bold">theme</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">string</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">dark</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">
            "dark" and "light" themes are implemented for builtin Toast components but in case of your own Toast
            component, you can implement or leave this feature.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-sm text-gray-600 font-bold">type</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">string</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">info</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">
            Four types of toasts are available i.e. success, info, error and warning.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-sm text-gray-600 font-bold">duration</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">number</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">3000</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">
            Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast
            will not be auto removed but user can click on cross icon to remove it.
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-sm text-gray-600 font-bold">width</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">number | string</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">320px</div>
        </td>
        <td>
          <div class="text-sm text-gray-600">Width of toasts.</div>
        </td>
      </tr>
    </tbody>
  </table>

  <p>
    ToastContainer sets default options for toasts and handles toasts placement/position. There are 7 placements allowed
    i.e "bottom-right", "bottom-left", "top-right", "top-left", "top-center", 'bottom-center", "center-center".
  </p>

  <pre>{`import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";

const showToast = () => {
  const toast = toasts.add({
    title: 'Message title',
    description: 'Message body',
    duration: 10000, // 0 or negative to avoid auto-remove
    placement: 'bottom-right',
    type: 'info',
    theme: 'dark',
    placement: 'bottom-right',
    type: 'success',
    theme,
    onClick: () => {},
    onRemove: () => {},
    // component: BootstrapToast, // allows to override toast component/template per toast
  });

};
</script>

<main class="flex flex-col container items-center mt-10">
  <h1 class="text-lg block text-center">Svelte Toasts</h1>
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer {toasts} let:data={data}>
    <FlatToast {data} />
  </ToastContainer>
</main>`}</pre>

  <p>
    There are some default options that will be added to every toast's data but we can override those default options
    for all toasts. e.g.
  </p>

  <pre>{`<ToastContainer
  placement="top-right"
  showProgress
  theme="light"
  type="success"
  duration={5000}
  width="350px"
  toasts={toasts}
  let:data={data}
>
  <FlatToast data={data} />
</ToastContainer>`}</pre>

  <p>
    ToastContainer takes a default slot as a toast template. This must be a component which should accept "data" prop
    which contains all toast related data. "data" is object with following properties and other user specified extra
    properties.
  </p>

  <ul class="list-disc pl-8">
    <li>title</li>
    <li>description</li>
    <li>remove</li>
    <li>update</li>
    <li>onClick</li>
    <li>onRemove</li>
    <li>component</li>
    <li>placement</li>
    <li>showProgress</li>
    <li>theme</li>
    <li>type</li>
    <li>duration</li>
  </ul>

  <p>
    Read more about toast component props
    <a href={`${base}/toast`} class="text-sky-600 hover:underline">here</a>.
  </p>
</div>
