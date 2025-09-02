import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');
// If publishing to GitHub Pages under a repo, set the base to '/<repo-name>'
const base = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: true
  },
  kit: {
    adapter: adapter({
      pages: 'docs',
      assets: 'docs',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    paths: {
      base: dev ? '' : base
  }
  }
};

export default config;
