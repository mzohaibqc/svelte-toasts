<script>
  import { toasts, ToastContainer, FlatToast, BootstrapToast } from "svelte-toasts";
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">Demo</h2>

  <form
    class="grid md:grid-cols-2 gap-3"
    on:submit|preventDefault={(e) => {
      const data = Object.fromEntries(new FormData(e.target));
      toasts.add({
        ...data,
        component: data.style == "flat" ? FlatToast : BootstrapToast,
        showProgress: data.hasOwnProperty("progress"),
        duration: data.duration * 1000,
      });
    }}
  >
    <div class="flex flex-col gap-3">
      <label>
        <p class="font-semibold text-sm mb-1">Title</p>
        <input value="Success" name="title" type="text" />
      </label>
      <label>
        <p class="font-semibold text-sm mb-1">Description</p>
        <input value="Form submitted successfully!" name="description" type="text" />
      </label>
      <label>
        <p class="font-semibold text-sm mb-1">Duration (seconds)</p>
        <input value="0" name="duration" type="number" />
      </label>
      <div class="grid grid-cols-3 gap-3">
        <button type="submit" class="bg-sky-100 hover:bg-sky-200 text-slate-600">Show Toast</button>
        <button class="bg-red-100 hover:bg-red-200 text-slate-600">Clear All</button>
        <button class="bg-red-100 hover:bg-red-200 text-slate-600">Clear Last</button>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <div>
        <p class="font-semibold">Style</p>
        <div class="flex gap-2">
          <div>
            <input type="radio" id="flat" name="style" value="flat" checked />
            <label for="flat">Flat</label>
          </div>
          <div>
            <input type="radio" id="bootstrap" name="style" value="bootstrap" />
            <label for="bootstrap">Bootstrap</label>
          </div>
        </div>

        <p class="font-semibold">Theme</p>
        <div class="flex gap-2">
          <div>
            <input type="radio" id="dark" name="theme" value="dark" checked />
            <label for="dark">Dark</label>
          </div>
          <div>
            <input type="radio" id="light" name="theme" value="light" />
            <label for="light">Light</label>
          </div>
        </div>

        <p class="font-semibold">Placement</p>
        <div class="grid grid-cols-3">
          <label>
            <input type="radio" name="placement" value="top-left" />
            <span>Top-Left</span>
          </label>
          <label>
            <input type="radio" name="placement" value="top-center" />
            <span>Top-Center</span>
          </label>
          <label>
            <input type="radio" name="placement" value="top-right" />
            <span>Top-Right</span>
          </label>

          <div />
          <label>
            <input type="radio" name="placement" value="center-center" />
            <span>Center-Center</span>
          </label>
          <div />

          <label>
            <input type="radio" name="placement" value="bottom-left" />
            <span>Bottom-Left</span>
          </label>
          <label>
            <input type="radio" name="placement" value="bottom-center" />
            <span>Bottom-Center</span>
          </label>
          <label>
            <input type="radio" name="placement" value="bottom-right" checked />
            <span>Bottom-Right</span>
          </label>
        </div>

        <p class="font-semibold">Type</p>
        <div class="flex gap-2">
          <label>
            <input type="radio" name="type" value="success" checked />
            <span>Success </span>
          </label>
          <label>
            <input type="radio" name="type" value="info" />
            <span>Info </span>
          </label>
          <label>
            <input type="radio" name="type" value="error" />
            <span>Error </span>
          </label>
          <label>
            <input type="radio" name="type" value="warning" />
            <span>Warning </span>
          </label>
        </div>

        <p class="font-semibold">Progress</p>
        <div>
          <label>
            <input type="checkbox" name="progress" />
            <span>Show </span>
          </label>
        </div>
      </div>
    </div>
  </form>
</div>

<ToastContainer placement="bottom-right" let:data>
  <FlatToast {data} />
</ToastContainer>

<style>
  label > span,
  label {
    white-space: nowrap;
  }
</style>
