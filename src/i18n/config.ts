import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Inline translations to avoid import issues
const resources = {
  en: {
    translation: {
      "app": { "name": "Safe Haven", "tagline": "Report what happened" },
      "dashboard": {
        "choose_what_happened": "Choose what happened:",
        "need_help_now": "Need Help Right Now?",
        "get_help_now": "Get Help Now",
        "you_are_not_alone": "You are not alone",
        "help_available": "Help is available 24/7. Your safety matters.",
        "incident_types": {
          "violence_at_home": "Violence at home",
          "harm_to_child": "Harm to a child",
          "unwanted_touching": "Unwanted touching or harassment",
          "other_safety": "Other safety concern"
        },
        "report_this": "Report This"
      }
    }
  },
  yo: {
    translation: {
      "app": { "name": "Ibi Aabo", "tagline": "Sọ ohun ti o ṣẹlẹ" },
      "dashboard": {
        "choose_what_happened": "Yan ohun ti o ṣẹlẹ:",
        "need_help_now": "O nilo Iranlọwọ Nisisiyi?",
        "get_help_now": "Gba Iranlọwọ Nisisiyi",
        "you_are_not_alone": "O ko dawa",
        "help_available": "Iranlọwọ wa ni gbogbo igba. Aabo rẹ ṣe pataki.",
        "incident_types": {
          "violence_at_home": "Iwa ipa ni ile",
          "harm_to_child": "Ipalara si ọmọde",
          "unwanted_touching": "Ifọwọkan ti a ko fẹ tabi ipaniyan",
          "other_safety": "Iṣoro aabo miiran"
        },
        "report_this": "Sọ Eyi"
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n