<script>
  import { Link } from 'svelte-navigator';
  import Code from '../components/Code.svelte';
  import Table from '../components/Table.svelte';

  let columns = [
    {
      header: 'Name',
      dataIndex: 'name',
      class: 'text-bold',
    },
    {
      header: 'Type',
      dataIndex: 'type',
    },
    {
      header: 'Description',
      dataIndex: 'description',
    },
  ];
  let data = [
    {
      name: 'add',
      type: 'Function',
      description:
        "This is key function to show toast. You can pass options and modify the generated toast. It will return toast object which you can use to modify or remove that specific toast programmatically, e.g. toast1.update({ title: 'New Title'})",
    },
    {
      name: 'removeAll',
      type: 'Function',
      description:
        'This function removes all toasts and clears store state to empty array',
    },
    {
      name: 'removeLast',
      type: 'Function',
      description:
        'This function removes one toast (if any) that was generated at the end',
    },
    {
      name: 'getById',
      type: 'Function',
      description:
        'This function returns toast data for given id. Every toast has a unique uid',
    },
    {
      name: 'setDefaults',
      type: 'Function',
      description:
        "This function sets default options so you don't need to pass those options again and again, e.g. theme, placement etc.",
    },
    {
      name: 'success',
      type: 'Function',
      description: 'Show success/green toast.',
    },
    {
      name: 'info',
      type: 'Function',
      description: 'Show info/blue toast.',
    },
    {
      name: 'error',
      type: 'Function',
      description: 'Show error/red toast.',
    },
    {
      name: 'warning',
      type: 'Function',
      description: 'Show warning/orange toast.',
    },
  ];
</script>

<svelte:head>
  <title>Svelte Toasts: Store</title>
  <meta name="title" content="Svelte Toasts: Store" />
  <meta name="description" content="Svelte Toasts: Store docs" />
  <meta
    name="keywords"
    content="svelte, svelte-toasts,toasts,bootstrap-toast,flat-toast,store-toast"
  />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />
  <meta name="author" content="Zohaib Ijaz" />
</svelte:head>

<div class="p-5 mb-20">
  <h1 class="text-3xl mb-5 outline-none">Toasts Store</h1>

  <Table {columns} {data} class="my-5" />

  <p class="space-5">You can import toasts store like this.</p>
  <Code
    class="my-5"
    code={`
    import toasts from 'svelte-toasts';
  
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
  
    toasts.error('Something went wrong. Try again later.');
    `}
  />

  <p>
    Since <b><i>toasts</i></b> is a store so you can use <b>$</b> syntax and you
    will get an array or toasts which you can loop through and implement how you
    want to show your toasts but most common cases can be handled by just using <Link
      class="text-blue-600 underline"
      to="/toast-container">ToastContainer</Link
    > component.
  </p>
  <p>
    <Code
      class="my-5"
      code={`
      import toasts, { ToastContainer } from 'svelte-toasts';
    
      <ToastContainer {toasts} placement="top-right" let:data>
        <FlatToast {data} />
        <!-- Or you can provide your own toast component -->
        <!-- <YourOwnComponent {data} /> -->
      </ToastContainer>
      `}
    />
  </p>
  <p>
    Read more about <b>ToastContainer</b>
    <Link class="text-blue-600 underline" to="/toast-container">here</Link>.
  </p>
</div>
