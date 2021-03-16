<script>
  import { Link } from 'svelte-navigator';
  import Code from '../components/Code.svelte';
  import Table from '../components/Table.svelte';

  let columns = [
    {
      header: 'Prop',
      dataIndex: 'name',
      class: 'text-bold',
    },
    {
      header: 'Type',
      dataIndex: 'type',
      width: '150px',
    },
    {
      header: 'Default',
      dataIndex: 'default',
      width: '150px',
    },
    {
      header: 'Description',
      dataIndex: 'description',
    },
  ];
  let data = [
    {
      name: 'title',
      type: 'string',
      description: 'Title of toast',
      default: '-',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description/body of toast',
      default: '-',
    },
    {
      name: 'remove',
      type: 'Function',
      description:
        'Invoking remove method will remove the respective toast object from store/UI. e.g. toast1.remove()',
      default: '-',
    },
    {
      name: 'update',
      type: 'Function',
      description:
        'Invoke update method to update a specific toast values like title, description or duration etc. toast.update({ title; "Progress: 80%" })',
      default: '-',
    },
    {
      name: 'onClick',
      type: 'Function',
      description:
        'You can provide onClick callback which will be invoked when toast will be clicked (except toast close icon/button)',
      default: '() => {}',
    },
    {
      name: 'onRemove',
      type: 'Function',
      description:
        'You can provide onRemove callback which will be invoked when toast will be auto removed or removed by clicking on cross icon/button.',
      default: '() => {}',
    },
    {
      name: 'component',
      type: 'Svelte Component',
      description:
        'You can provide your own toast component to render toast for a specific toast object',
      default: '-',
    },
    {
      name: 'placement',
      type: 'string',
      description:
        'Set placement of current toast, it will override default placement set by ToastContainer',
      default: '-',
    },
    {
      name: 'showProgress',
      type: 'boolean',
      description:
        'If set to "true" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of current toast. It will override default value set by ToastContainer.',
      default: '-',
    },
    {
      name: 'theme',
      type: 'string',
      description:
        '"dark" and "light" themes are implemented for builtin Toast components but in case of your own Toast component, you can implement or leave this feature. This will override default value set by ToastContainer if you are using builtin Toast components.',
      default: '-',
    },
    {
      name: 'type',
      type: 'string',
      description:
        'Four types of toasts are available i.e. success, info, error and warning. It will override toast type set by ToastContainer.',
      default: '-',
    },
    {
      name: 'duration',
      type: 'number',
      description:
        'Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast will not be auto removed but user can click on cross icon to remove it. It will override duration specified by ToastContainer.',
      default: '-',
    },
  ];
</script>

<div class="p-5 mb-20">
  <h1 class="text-3xl mb-5 outline-none">Toast</h1>
  <p class="space-5">
    A toast is shown based on a toast object in toasts store. When you call
    toasts.add(options) then a toast object is added in toasts store which then
    is shown by ToastContainer. A toast object looks like this.
  </p>
  <Code
    class="my-5"
    code={`
    {
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
    }
  `}
  />
  <p class="space-5">Below is a detail description of every property.</p>

  <Table {columns} {data} class="my-5" />

  <p class="space-5">There are two builtin toast components in this package.</p>

  <ul class="list-disc pl-8">
    <li>
      <Link class="text-blue-600 underline" to="/flat-toast">FlatToast</Link>
    </li>
    <li>
      <Link class="text-blue-600 underline" to="/bootstrap-toast"
        >BootstrapToast</Link
      >
    </li>
  </ul>
  <p>
    You can provide as default slot to ToastContainer to use that component for
    all toasts but if you want to use a different design/template for a specific
    toast, you can provide <b>component</b> property in toast options.
  </p>
  <p>
    <Code
      class="mt-5"
      lang="html"
      code={` 
  <script>`}
    />
    <Code
      code={`  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
  
  const showToast = () => {
    const toast = toasts.add({
      description: 'Message body',
      component: BootstrapToast, // this will override toast component provided by ToastContainer
    });
  };
`}
    />
    <Code
      class=""
      lang="html"
      code={` <script>

  <button on:click={showToast}>Show Toast</button>
  <ToastContainer let:data={data}>
    <FlatToast {data} /> <!-- default slot as toast component -->
  </ToastContainer>
  `}
    />
  </p>
</div>
