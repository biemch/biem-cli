import plugin from 'tailwindcss/plugin';

const rotate = plugin(({
	addUtilities,
}) => {
	const newUtilities = {
		'.rotate-isometric': {
			transform: 'rotateX(60deg) rotateZ(45deg)',
		},
	};

	addUtilities(newUtilities);
});

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [
		rotate,
	],
};
