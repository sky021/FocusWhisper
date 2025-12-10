/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-bg': '#f5f5f7',
                'brand-accent': '#007aff',
            }
        },
    },
    plugins: [],
}
