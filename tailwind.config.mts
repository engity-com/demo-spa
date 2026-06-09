import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	plugins: [tailwindcssAnimate],
};

export default config;
