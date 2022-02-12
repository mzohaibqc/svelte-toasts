<script>
  import { StarIconOutline } from "@codewithshin/svelte-heroicons";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import "../app.css";

  const links = [
    { url: "", name: "Demo" },
    { url: "/store", name: "Store" },
    { url: "/toastcontainer", name: "ToastContainer" },
    { url: "/toast", name: "Toast" },
    { url: "/flattoast", name: "FlatToast" },
    { url: "/bootstraptoast", name: "BootstrapToast" },
    { url: "/custom", name: "Custom Toast" },
  ];
</script>

<div class="grid h-screen grid-cols-[18rem_minmax(0,_1fr)] overflow-hidden">
  <div class="sidebar">
    <div class="p-4 flex items-center gap-3 bg-slate-50">
      <img src={`${base}/images/logo.svg`} alt="Logo" class="w-8 h-8" />
      <p>Svelte Toasts</p>
      <a class="ml-auto" href="https://github.com/mzohaibqc/svelte-toasts">
        <StarIconOutline className="text-slate-600 hover:text-yellow-400 h-5 w-5 transition" />
      </a>
    </div>
    {#each links as link}
      <a class:active={$page.url.pathname == `${base}${link.url}`} href={`${base}${link.url}`}>{link.name}</a>
    {/each}
  </div>
  <div class="p-4 overflow-y-auto">
    <slot />
  </div>
</div>
