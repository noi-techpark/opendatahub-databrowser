// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

import tailwindForms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius:{
        'sm-plus': '4px',
      },
      boxShadow: {
        'table-static-col': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
        '2xl': '1.625rem',
        '3xl': '2rem',
      },
      colors: {
        'hint-calm': '#2264E5',
        'hint-calm-secondary': '#ebf0fa',
        'hint-info': '#50742f',
        'hint-info-secondary': 'rgba(80, 116, 47, 0.1)',
        'hint-warning': '#aa5b00',
        'hint-warning-secondary': '#fdf2e6',
        'hint-error': '#d12953',
        'hint-error-secondary': '#faf0f3',
        error: '#ff0000',
        deprecated: '#D26D29',
        reference: '#2264E5',
        disabled: '#dcdde1',
        delete: '#dc2626',
        dialog: '#687182',
        lightgray: '#EAEBED',
        green: {
          400: '#50742f',
          500: '#476929',
          700: '#234009',
        },
        gray: {
          50: '#f4f8f9',
          100: '#f1f3f4',
          200: '#efefef',
          250: '#e3e4e7',
          300: '#dcdde1',
          400: '#e0e1e5',
          600: '#707c7e',
          700: '#494d50',
          900: '#3c4043',
        },
        pink: {
          400: '#FA00FF',
        },
      },
      spacing: {
        default: '80rem',
      },
    },
  },
  safelist: [
    'bg-alert-info',
    'text-alert-info',
    'bg-alert-warning',
    'text-alert-warning',
    'bg-alert-error',
    'text-alert-error',
  ],
  plugins: [tailwindForms],
};
