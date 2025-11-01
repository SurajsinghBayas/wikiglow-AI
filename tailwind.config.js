module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        notes: '2px 2px 0 #000000'
      },
      fontFamily: {
        excon: ['Excon', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
        lexend: ['Lexend', 'ui-sans-serif', 'system-ui'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        roboto: ['Roboto', 'ui-sans-serif', 'system-ui'],
        opensans: ['"Open Sans"', 'ui-sans-serif', 'system-ui'],
        ibmplexsans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
        lora: ['Lora', 'serif'],
        merriweather: ['Merriweather', 'serif'],
        sourceserif: ['"Source Serif 4"', 'serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}
