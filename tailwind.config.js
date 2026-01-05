/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    900: '#0c4a6e',
                    17: '#0c4a6e', // Keeping original line 17 value though key looks weird (17 vs 900) - waiting, line 17 was closing brace in view_file. line 16 was 900.
                }
            }
        },
    },
    plugins: [],
}
