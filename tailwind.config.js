/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html"],
    darkMode: 'class',
    theme: {
    extend: {
    fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
    },
    colors: {
        primary: '#2C5530',    
        secondary: '#8BA888',
        /* FIX: Darkened accent color for accessibility contrast (AA compliant on white) */  
        accent: '#8B5E34',     
        surface: '#F9FAFB',    
        dark: '#0F172A',
        error: '#EF4444',
    },
    boxShadow: {
        'soft': '0 20px 40px -15px rgba(0,0,0,0.1)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
    },
    animation: {
        'float': 'float 6s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'spin': 'spin 1s linear infinite',
        'swipe-hint': 'swipeHint 2s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
    },
    keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shake: { '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' }, '20%, 80%': { transform: 'translate3d(2px, 0, 0)' }, '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' }, '40%, 60%': { transform: 'translate3d(4px, 0, 0)' } },
        spin: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        swipeHint: { '0%, 100%': { transform: 'translateX(0)', opacity: '0.5' }, '50%': { transform: 'translateX(-20px)', opacity: '1' } }
    }
    }
    },
  plugins: [],
}