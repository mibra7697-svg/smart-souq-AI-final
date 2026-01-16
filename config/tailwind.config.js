/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*/.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // تم تحديث الهيكل لضمان عدم حدوث خطأ Destructuring
        primary: {
          DEFAULT: '#3b82f6',
          main: '#3b82f6',    // بعض القوالب تبحث عن كلمة main
          primary: '#3b82f6', // وبعضها يبحث عن تكرار الكلمة primary بالداخل
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // إضافة secondary كاحتياط لأن الخطأ قد ينتقل إليه لاحقاً
        secondary: {
          DEFAULT: '#ffffff',
          main: '#ffffff',
        }
      },
      fontFamily: {
        arabic: ['"Noto Sans Arabic"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      screens: {
        'xs': '475px',
      }
    },
  },
  plugins: [],
  // تأكد من أن نسخة Tailwind لديك تدعم هذه الخصائص مباشرة
  // إذا استمر الخطأ، يفضل تعطيل rtl مؤقتاً للتجربة
  darkMode: 'class',
}
