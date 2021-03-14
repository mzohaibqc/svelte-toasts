<img src="./site/public/images/logo.svg" alt="Logo" style="height: 100px; display:block; margin: 0 auto;" />

# Svelte-Toasts

A highly configurable toast/notification component with individual toast state management capabilities.

## Demo & Docs

https://mzohaibqc.github.io/svelte-toasts/

REPL: https://svelte.dev/repl/ff34bad88213493ab878c71497c01152?version=3.35.0

## <img src="./site/public/images/dynamic-toast.gif" alt="Dynamic Toast">

#### Flat Toast

<p float="left">
    <img src="./site/public/images/flat-dark.png" width="320px" alt="Light theme toasts">
    <img src="./site/public/images/flat-light.png" width="320px" alt="Dark theme toasts">
</p>

#### Bootstrap Toast

<p float="left">
    <img src="./site/public/images/bootstrap-dark.png" width="320px" alt="Light theme toasts">
    <img src="./site/public/images/bootstrap-light.png" width="320px" alt="Dark theme toasts">
</p>

## Install

> npm i svelte-toasts

or if you are using yarn

> yarn add svelte-toasts

## Getting Started

```javascript
<script>
  import { toasts, ToastContainer, FlatToast, BootstrapToast }  from "svelte-toasts";

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

    // toast.remove()

  };
</script>

<main class="flex flex-col container items-center mt-10">
	<h1 class="text-lg block text-center">Svelte Toasts</h1>
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer placement="bottom-right" let:data={data}>
    <FlatToast {data} /> <!-- Provider template for your toasts -->
  </ToastContainer>
</main>
```

Every `toast` object has following structure:

```javascript
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
```

Below is a detail description of every property.

<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-100"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prop </th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type </th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default </th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description </th></tr></thead> <tbody class="bg-white divide-y divide-gray-200"><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">title</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">string</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Title of toast</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">description</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">string</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Description/body of toast</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">remove</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Invoking remove method will remove the respective toast object from store/UI. e.g. toast1.remove()</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">update</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Invoke update method to update a specific toast values like title, description or duration etc. toast.update({ title; "Progress: 80%" })</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">onClick</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">() =&gt; {}</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">You can provide onClick callback which will be invoked when toast will be clicked (except toast close icon/button)</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">onRemove</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">() =&gt; {}</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">You can provide onRemove callback which will be invoked when toast will be auto removed or removed by clicking on cross icon/button.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">component</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">Svelte Component</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">You can provide your own toast component to render toast for a specific toast object</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">placement</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">string</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Set placement of current toast, it will override default placement set by ToastContainer</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">showProgress</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">boolean</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">If set to "true" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of current toast. It will override default value set by ToastContainer.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">theme</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">string</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">"dark" and "light" themes are implemented for builtin Toast components but in case of your own Toast component, you can implement or leave this feature. This will override default value set by ToastContainer if you are using builtin Toast components.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">type</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">string</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Four types of toasts are available i.e. success, info, error and warning. It will override toast type set by ToastContainer.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">duration</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">number</div></td><td class="px-6 py-4" style="min-width: 150px"><div class="text-sm text-gray-600 undefined">-</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast will not be auto removed but user can click on cross icon to remove it. It will override duration specified by ToastContainer.</div></td> </tr></tbody></table>

### Helper Methods

You can use helper functions to create toast with just message argument.

> toasts.success('Message body here'); // just 1 argument

> toasts.success('Message Title', 'Message body here'); // 2 arguments, title, description

> toasts.success('Message Title', 'Message body here', { duration: 5000 }); // 3 arguments, title, description and all other options object

Similarly,
toasts.info(), toasts.warning() and toasts.error()

## Docs

## Store

- [`ToastStore`](#ToastStore)

## Components

- [`BootstrapToast`](#bootstraptoast)
- [`FlatToast`](#flattoast)
- [`ToastContainer`](#toastcontainer)

---

## `ToastStore`

```javascript
import { toasts } from 'svelte-toasts';
```

Store `toasts` contains an array of toasts objects. It has following methods:

<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-100"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name </th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type </th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description </th></tr></thead> <tbody class="bg-white divide-y divide-gray-200"><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">add</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">This is key function to show toast. You can pass options and modify the generated toast. It will return toast object which you can use to modify or remove that specific toast programmatically, e.g. toast1.update({ title: 'New Title'})</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">removeAll</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">This function removes all toasts and clears store state to empty array</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">removeLast</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">This function removes one toast (if any) that was generated at the end</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">getById</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">This function returns toast data for given id. Every toast has a unique uid</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">setDefaults</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">This function sets default options so you don't need to pass those options again and again, e.g. theme, placement etc.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">success</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Show success/green toast.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">info</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Show info/blue toast.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">error</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Show error/red toast.</div></td> </tr><tr><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 text-bold">warning</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Function</div></td><td class="px-6 py-4" style=""><div class="text-sm text-gray-600 undefined">Show warning/orange toast.</div></td> </tr></tbody></table>

## `BootstrapToast`

```javascript
import { BootstrapToast } from 'svelte-toasts';
```

### Props

| Prop name | Kind             | Reactive | Type                                    | Default value        | Description                  |
| :-------- | :--------------- | :------- | :-------------------------------------- | -------------------- | ---------------------------- |
| theme     | <code>let</code> | No       | <code> [Theme](#theme)</code>           | <code>'light'</code> | Default theme for all toasts |
| data      | <code>let</code> | No       | <code> [ToastProps](#ToastProps)</code> | <code>{}</code>      | Default theme for all toasts |

### Slots

| Slot name  | Default | Props | Fallback                                                                                                                                                                                                                                                                                                                                                                   |
| :--------- | :------ | :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| close-icon | No      | --    | <code>&lt;svg<br /> xmlns="http://www.w3.org/2000/svg"<br /> class="bx--toast-notification\_\_close-icon"<br /> width="20"<br /> height="20"<br /> viewBox="0 0 32 32"<br /> aria-hidden="true"<br /> &gt;<br /> &lt;path<br /> d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"<br /> /&gt;<br /> &lt;/svg&gt;</code> |
| extra      | No      | --    | --                                                                                                                                                                                                                                                                                                                                                                         |
| icon       | No      | --    | <code>Svg icons based on type<code>                                                                                                                                                                                                                                                                                                                                        |

### Events

None.

## `FlatToast`

```javascript
import { FlatToast } from 'svelte-toasts';
```

### Props

| Prop name | Kind             | Reactive | Type                                     | Default value        | Description                  |
| :-------- | :--------------- | :------- | :--------------------------------------- | -------------------- | ---------------------------- |
| theme     | <code>let</code> | No       | <code> [Theme](#theme) </code>           | <code>'light'</code> | Default theme for all toasts |
| data      | <code>let</code> | No       | <code> [ToastProps](#ToastProps) </code> | <code>{}</code>      | Default theme for all toasts |

### Slots

| Slot name  | Default | Props | Fallback                                                                                                                                                                                                                                                                                                                                                                   |
| :--------- | :------ | :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| close-icon | No      | --    | <code>&lt;svg<br /> xmlns="http://www.w3.org/2000/svg"<br /> class="bx--toast-notification\_\_close-icon"<br /> width="20"<br /> height="20"<br /> viewBox="0 0 32 32"<br /> aria-hidden="true"<br /> &gt;<br /> &lt;path<br /> d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"<br /> /&gt;<br /> &lt;/svg&gt;</code> |
| extra      | No      | --    | --                                                                                                                                                                                                                                                                                                                                                                         |
| icon       | No      | --    | <code>Svg icons based on type<code>                                                                                                                                                                                                                                                                                                                                        |

### Events

None.

## `ToastContainer`

```javascript
import { ToastContainer } from 'svelte-toasts';
```

### Props

| Prop name    | Kind             | Reactive | Type                                   | Default value               | Description                                                            |
| :----------- | :--------------- | :------- | :------------------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| theme        | <code>let</code> | No       | <code> [Theme](#Theme) </code>         | <code>'dark'</code>         | Default theme for all toasts                                           |
| placement    | <code>let</code> | No       | <code> [Placement](#Placement) </code> | <code>'bottom-right'</code> | Default placement for all toasts                                       |
| type         | <code>let</code> | No       | <code> [ToastType](#ToastType) </code> | <code>'info'</code>         | Default type of all toasts                                             |
| showProgress | <code>let</code> | No       | <code> boolean </code>                 | <code>false</code>          | Show progress if showProgress is true and duration is greater then 0   |
| duration     | <code>let</code> | No       | <code> number </code>                  | <code>3000</code>           | Default duration for all toasts to auto close. 0 to disable auto close |
| width        | <code>let</code> | No       | <code> 'string' </code>                | <code>'320px'</code>        | Width of all toasts                                                    |

### Slots

| Slot name | Default | Props                                             | Fallback |
| :-------- | :------ | :------------------------------------------------ | :------- |
| --        | Yes     | <code>{ data: [ToastProps](#ToastProps) } </code> | --       |

### Events

None.

## Types

#### `Theme`

```ts
export type Theme = 'dark' | 'light';
```

#### `ToastType`

```ts
export type ToastType = 'success' | 'info' | 'error' | 'warning';
```

#### `Placement`

```ts
export type Placement =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-center'
  | 'center-center';
```

#### `ToastProps`

```ts
export interface ToastProps {
  uid: number;
  title?: string;
  description: string;
  duration: number;
  type: ToastType;
  theme?: Theme;
  placement: Placement;
  showProgress?: boolean;
  remove?: Function;
  update?: Function;
  onRemove?: Function;
  onClick?: Function;
}
```

#### `ToastStore`

```ts
export interface ToastStore extends Writable<ToastProps[]> {
  add(options: Partial<ToastProps>): ToastProps;
  success(options: Partial<ToastProps>): ToastProps;
  success(description: string): ToastProps;
  success(description: string, options: Partial<ToastProps>): ToastProps;
  success(
    title: string,
    description: string,
    options?: Partial<ToastProps>
  ): ToastProps;

  info(options: Partial<ToastProps>): ToastProps;
  info(description: string): ToastProps;
  info(description: string, options: Partial<ToastProps>): ToastProps;
  info(
    title: string,
    description: string,
    options?: Partial<ToastProps>
  ): ToastProps;

  error(options: Partial<ToastProps>): ToastProps;
  error(description: string): ToastProps;
  error(description: string, options: Partial<ToastProps>): ToastProps;
  error(
    title: string,
    description: string,
    options?: Partial<ToastProps>
  ): ToastProps;

  warning(options: Partial<ToastProps>): ToastProps;
  warning(description: string): ToastProps;
  warning(description: string, options: Partial<ToastProps>): ToastProps;
  warning(
    title: string,
    description: string,
    options?: Partial<ToastProps>
  ): ToastProps;

  getById(uid: number): ToastProps;
  clearAll(): void;
  clearLast(): void;
  setDefaults(options: Partial<ToastProps>): void;
}
```
