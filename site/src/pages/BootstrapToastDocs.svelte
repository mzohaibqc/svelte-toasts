<script>
  import { Link } from 'svelte-navigator';
  import Code from '../components/Code.svelte';
</script>

<div class="p-5 mb-20">
  <h1 class="text-3xl mb-5 outline-none">BootstrapToast</h1>
  <div class="flex flex-col md:flex-row">
    <div class="toast-component flex flex-col items-center">
      <h3>Dark Theme</h3>
      <img
        src="images/bootstrap-dark.png"
        width="320px"
        alt="Light theme toasts"
      />
    </div>
    <div class="toast-component flex flex-col items-center">
      <h3>Light Theme</h3>
      <img
        src="images/bootstrap-light.png"
        width="320px"
        alt="Dark theme toasts"
      />
    </div>
  </div>
  <p id="code" class="space-5 mt-5">
    BootstrapToast component takes "data" prop which is a toast object as
    described <Link class="text-blue-600 underline" to="/toast">here</Link>. You
    can use BootstrapToast like this.
  </p>
  <Code
    class="mt-5"
    lang="html"
    code={` 
  <script>`}
  />
  <Code
    code={`    import { toasts, ToastContainer, BootstrapToast }  from "svelte-toasts";
    
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
    code={`  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer let:data={data}>
    <BootstrapToast {data} /> <!-- default slot as toast component -->
  </ToastContainer>
  `}
  />

  <p id="slots" class="mt-5">
    BootstrapToast accepts following optional slots:
  </p>
  <Code
    class="my-5"
    code={`
  <slot name="icon"></slot>
  <slot name="extra"></slot>
  <slot name="close-icon">
  `}
  />
  <h3 id="icon-slot" class="text-xl mt-3">Icon Slot</h3>
  <p class="my-4">
    You can provide your own custom icon or any element to be shown as toast
    icon instead of predefined icons.
  </p>

  <Code
    class="my-5"
    code={`
  <BootstrapToast data={data}>
    <slot name="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </slot>
  </BootstrapToast>
  `}
  />

  <h3 id="extra-clot" class="text-xl mt-3">Extra Slot</h3>
  <p class="my-4">
    You can provide some extra content to be shown below toast message,
    something like timestamp, some link to other page etc.
  </p>

  <Code
    class="my-5"
    code={`
  <BootstrapToast data={data}>
    <slot name="extra">
      <span class="text-sm text-gray-300">08:15:30 AM</span>
    </slot>
  </BootstrapToast>
  `}
  />

  <h3 id="close-icon-slot" class="text-xl mt-3">Close Icon Slot</h3>
  <p class="my-4">
    By default, a cross icon is show inside close button but if you want to
    change this icon, you can provide your own icon or some text.
  </p>

  <Code
    class="my-5"
    code={`
  <BootstrapToast data={data}>
    <slot name="close-icon">
      <span class="text-sm text-gray-300">Close</span>
    </slot>
  </BootstrapToast>
  `}
  />
</div>
