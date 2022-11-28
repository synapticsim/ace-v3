/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Alexandria', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
        },
        container: {
            center: true,
        },
        extend: {
            colors: {
                midnight: {
                    900: '#0a0e1a',
                    800: '#151a29',
                    700: '#2a3347',
                    600: '#505d75',
                    500: '#606c82',
                    400: '#6f7a8f',
                    300: '#818a9c',
                    200: '#a5abb8',
                    100: '#dcdee3',
                },
            },
        },
    },
    safelist: [
        'rc-slider-rail',
        'rc-slider-track',
        'rc-slider-handle',
        'rc-slider-handle-dragging',
    ]
}
