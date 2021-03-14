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
      name: 'toasts',
      type: 'store object',
      description:
        'toasts store object that will be used in ToastContainer component to show toasts.',
      default: '-',
    },
    {
      name: 'placement',
      type: 'string',
      description: 'Set default placement of toasts',
      default: 'bottom-right',
    },
    {
      name: 'showProgress',
      type: 'boolean',
      description:
        'If set to "true" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of every toast.',
      default: false,
    },
    {
      name: 'theme',
      type: 'string',
      description:
        '"dark" and "light" themes are implemented for builtin Toast components but in case of your own Toast component, you can implement or leave this feature.',
      default: 'dark',
    },
    {
      name: 'type',
      type: 'string',
      description:
        'Four types of toasts are available i.e. success, info, error and warning.',
      default: 'info',
    },
    {
      name: 'duration',
      type: 'number',
      description:
        'Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast will not be auto removed but user can click on cross icon to remove it.',
      default: 3000,
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Width of toasts.',
      default: '320px',
    },
  ];
</script>

<div class="p-5 mb-20">
  <h1 class="text-3xl mb-5 outline-none">ToastsContainer</h1>

  <Table {columns} {data} class="my-5" />

  <p class="space-5">
    ToastContainer sets default options for toasts and handles toasts
    placement/position. There are 7 placements allowed i.e "bottom-right",
    "bottom-left", "top-right", "top-left", "top-center", 'bottom-center",
    "center-center".
  </p>
  <Code
    class="my-5"
    code={`
  import toasts, { ToastContainer, FlatToast }  from "svelte-toasts";

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
  </main>
    `}
  />

  <p>
    There are some default options that will be added to every toast's data but
    we can override those default options for all toasts. e.g.
  </p>
  <p>
    <Code
      class="my-5"
      code={`
    <ToastContainer
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
    </ToastContainer>
      `}
    />
  </p>
  <p>
    ToastContainer takes a default slot as a toast template. This must be a
    component which should accept "data" prop which contains all toast related
    data. "data" is object with following properties and other user specified
    extra properties.
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
    Read more about toast component props <Link
      class="text-blue-600 underline"
      to="/toast-component">here</Link
    >.
  </p>
</div>
