/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#079B43",
        accent: "#DC8621",
        blueuvs: '#0873B5',
        blackloader:'#00000033'
      },
      animation: {
        "jump-1": "jump-1 1s cubic-bezier(0.21, 0.98, 0.6, 0.99) infinite alternate",
        "jump-2": "jump-2 1s cubic-bezier(0.21, 0.98, 0.6, 0.99) infinite alternate",
        "jump-3": "jump-3 1s cubic-bezier(0.21, 0.98, 0.6, 0.99) infinite alternate",
      },
      keyframes: {
        "jump-1": {
          "0%, 70%": {
            boxShadow: "2px 2px 3px 2px rgba(0, 0, 0, 0.2)",
            transform: "scale(0)",
          },
          "100%": {
            boxShadow: "10px 10px 15px 0 rgba(0, 0, 0, 0.3)",
            transform: "scale(1)",
          },
        },
        "jump-2": {
          "0%, 40%": {
            boxShadow: "2px 2px 3px 2px rgba(0, 0, 0, 0.2)",
            transform: "scale(0)",
          },
          "100%": {
            boxShadow: "10px 10px 15px 0 rgba(0, 0, 0, 0.3)",
            transform: "scale(1)",
          },
        },
        "jump-3": {
          "0%, 10%": {
            boxShadow: "2px 2px 3px 2px rgba(0, 0, 0, 0.2)",
            transform: "scale(0)",
          },
          "100%": {
            boxShadow: "10px 10px 15px 0 rgba(0, 0, 0, 0.3)",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

