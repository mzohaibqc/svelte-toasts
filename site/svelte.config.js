import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
	  adapter: adapter({
		pages: "docs",
		assets: "docs",
	  }),
	  paths: {
		base: "/test",
	  },
	},
  };

export default config;
