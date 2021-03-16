<script>
  import { Link } from 'svelte-navigator';
  import Code from '../components/Code.svelte';
</script>

<svelte:head>
  <title>Svelte Toasts: Custom Toast</title>
  <meta name="title" content="Svelte Toasts: Custom Toast" />
  <meta name="description" content="Svelte Toasts: Custom Toast docs" />
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
  <h1 class="text-3xl mb-5 outline-none">Custom Toast</h1>
  <p id="code" class="space-5 mt-5">
    If <Link class="text-blue-600 underline" to="/flat-toast">FlatToast</Link> or
    <Link class="text-blue-600 underline" to="/bootstrap-toast"
      >BootstrapToast</Link
    > do not fullfil your needs even after overriding styles, you can create and
    use your own toast component. ToastContainer has default slot which acts as Toast
    Component template. You can write inline markup or create a stand alone component
    which takes a "data" prop which is actually a toast object. You read about toast
    object <Link class="text-blue-600 underline" to="/toast">here</Link>
  </p>
  <h3 class="text-xl mt-3">Inline Template</h3>
  <Code
    class="mt-5"
    lang="html"
    code={` 
  <script>`}
  />
  <Code
    code={`    import { toasts, ToastContainer }  from "svelte-toasts";
    
    const showToast = () => {
      const toast = toasts.add({
        title: 'Hello'
        description: 'Message body',
      });
    };
  `}
  />
  <Code
    class=""
    lang="html"
    code={`  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer let:data={data}>
    <div class="my-toast {data.type}">
      <button on:click={data.remove}>Close</button>
      <p class="title">{data.title}</p>
      <hr>
      <p class="description">{data.description}</p>
      <div>
        Some other content here.
      </div>
    </div>
  </ToastContainer>
  `}
  />

  <h3 class="text-xl mt-3">Custom Toast Component</h3>
  <Code
    class="mt-5"
    lang="html"
    code={` 
  // MyToast.svelte
  <script>`}
  />
  <Code code={`    let data = {};`} />
  <Code
    class=""
    lang="html"
    code={`  <script>
  
  <div class="my-toast {data.type}">
    <button on:click={data.remove}>Close</button>
    <p class="title">{data.title}</p>
    <hr>
    <p class="description">{data.description}</p>
    <div>
      <slot>Some other content here.</slot>
    </div>
  </div>
  `}
  />

  <p>And now you can use that component as toast template</p>

  <Code
    class="mt-5"
    lang="html"
    code={` 
  <script>`}
  />
  <Code
    code={`    import { toasts, ToastContainer }  from "svelte-toasts";
    import MyToast from './MyToast.svelte';
    // import path might be different based on location of your component
    
    const showToast = () => {
      const toast = toasts.add({
        title: 'Hello'
        description: 'Message body',
      });
    };
  `}
  />
  <Code
    class=""
    lang="html"
    code={`  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer let:data={data}>
    <MyToast {data} />
  </ToastContainer>
  `}
  />
</div>
