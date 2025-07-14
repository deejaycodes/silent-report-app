import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import en from './locales/en.json'
import yo from './locales/yo.json'
import ha from './locales/ha.json'
import ig from './locales/ig.json'

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: en
      },
      yo: {
        translation: yo
      },
      ha: {
        translation: ha
      },
      ig: {
        translation: ig
      }
    },
    lng: localStorage.getItem('language') || 'en', // default language
  })

export default i18n