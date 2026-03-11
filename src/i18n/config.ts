import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import yo from './locales/yo.json'
import ha from './locales/ha.json'
import ig from './locales/ig.json'

const resources = {
  en: { translation: en },
  yo: { translation: yo },
  ha: { translation: ha },
  ig: { translation: ig }
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n