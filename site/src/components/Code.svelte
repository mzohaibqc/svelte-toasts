<script>
  import Prism from 'prismjs';

  export let code = '';
  export let lang = 'javascript';
  $: html = Prism.highlight(code, Prism.languages[lang], lang);
</script>

<pre class="bg-gray-100 {$$restProps.class}">
  {@html html}
</pre>