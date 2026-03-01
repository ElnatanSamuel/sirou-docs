// Add this to your tailwind.config.js
module.exports = {
// ...
plugins: [
require('@tailwindcss/typography'),
],
theme: {
extend: {
colors: {
indigo: {
500: '#6366f1',
400: '#818cf8',
},
},
},
},
}
