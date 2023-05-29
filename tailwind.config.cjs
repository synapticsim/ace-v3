/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['"Space Grotesk Variable"', 'sans-serif'],
            mono: ['"JetBrains Mono Variable"', 'monospace']
        },
        container: {
            center: true,
        },
        extend: {
            colors: {
                silver: {
                    950: '#111217',
                    900: '#191920',
                    800: '#202028',
                    700: '#3B3B44',
                    600: '#565660',
                    500: '#71717C',
                    400: '#8D8D99',
                    300: '#A8A8B5',
                    200: '#C3C3D1',
                    100: '#DEDEED',
                    50: '#EFEFF9',
                },
                amethyst: {
                    950: '#35234F',
                    900: '#4A2E71',
                    800: '#5F3993',
                    700: '#7543B4',
                    600: '#8A4ED6',
                    500: '#9F59F8',
                    400: '#B47EFA',
                    300: '#CAA3FB',
                    200: '#D4B5FC',
                    100: '#DFC8FD',
                    50: '#EADAFD',
                },
            },
        },
    },
    safelist: [
        'rc-slider-rail',
        'rc-slider-track',
        'rc-slider-handle',
        'rc-slider-handle-dragging',
    ],
    plugins: [
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
};
