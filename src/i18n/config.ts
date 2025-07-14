import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Inline translations to avoid import issues
const resources = {
  en: {
    translation: {
      "app": { "name": "Safe Haven", "tagline": "Report what happened" },
      "landing": {
        "hero_description": "A secure platform for anonymous reporting and getting the support you need",
        "report_anonymously": "Report Anonymously",
        "ngo_section": "For NGO Organizations",
        "ngo_description": "Manage incidents, support victims, coordinate responses",
        "login": "Login",
        "register": "Register NGO"
      },
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
      },
      "report": {
        "title": "Submit Report",
        "anonymous_secure": "Anonymous & Secure",
        "anonymous_notice": "Your report is completely anonymous unless you choose to provide contact information below.",
        "tell_what_happened": "Tell us what happened *",
        "description_placeholder": "Tell us what happened in your own words. You can write as much or as little as you want...",
        "description_help": "Share what happened, when it happened, and where it happened. Use simple words and write however feels natural to you.",
        "categorize_optional": "Help us categorize this (Optional)",
        "category_placeholder": "Choose category if you want",
        "category_help": "This helps us connect you with the right people, but you can skip this if you want.",
        "submit_report": "Submit Report",
        "submitting": "Submitting Report..."
      }
    }
  },
  yo: {
    translation: {
      "app": { "name": "Ibi Aabo", "tagline": "Sọ ohun ti o ṣẹlẹ" },
      "landing": {
        "hero_description": "Eto to ni aabo fun sísọ awọn iṣẹlẹ laimi fi orukọ han",
        "report_anonymously": "Sọ Laimi Orukọ",
        "ngo_section": "Fun Awọn Ajo Egbe",
        "ngo_description": "Ṣakoso awọn iṣẹlẹ, ran awọn olufaragba lọwọ",
        "login": "Wọle",
        "register": "Forukọsilẹ Ajo"
      },
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
      },
      "report": {
        "title": "Fi Ijabọ Silẹ",
        "anonymous_secure": "Laimi Orukọ ati Aabo",
        "anonymous_notice": "Ijabọ rẹ jẹ laimi orukọ patapata ayafi ti o ba yan lati fun ni alaye olubasọrọ.",
        "tell_what_happened": "Sọ fun wa ohun ti o ṣẹlẹ *",
        "description_placeholder": "Sọ fun wa ohun ti o ṣẹlẹ ni ọrọ tirẹ. O le kọ pupọ tabi diẹ bi o ti fẹ...",
        "description_help": "Sọ ohun ti o ṣẹlẹ, igba ti o ṣẹlẹ, ati ibi ti o ṣẹlẹ. Lo awọn ọrọ rọrun.",
        "categorize_optional": "Ran wa lọwọ lati to eyi sinu ẹka (Ti o ba fẹ)",
        "category_placeholder": "Yan ẹka ti o ba fẹ",
        "category_help": "Eyi ṣe iranlọwọ fun wa lati so ọ pọ mọ awọn eniyan to tọ, ṣugbọn o le fo eyi silẹ.",
        "submit_report": "Fi Ijabọ Silẹ",
        "submitting": "Nfi Ijabọ Silẹ..."
      }
    }
  },
  ha: {
    translation: {
      "app": { "name": "Gidan Aminci", "tagline": "Bayyana abin da ya faru" },
      "landing": {
        "hero_description": "Tsarin amintaccen bayar da rahoto ba tare da bayyana sunan ba da samun tallafi",
        "report_anonymously": "Bayar da Rahoto Ba Tare da Sunan",
        "ngo_section": "Ga Kungiyoyin Agaji",
        "ngo_description": "Sarrafa al'amura, taimaka wa wadanda suka sha wahala",
        "login": "Shiga",
        "register": "Yi Rajistar Kungiya"
      },
      "dashboard": {
        "choose_what_happened": "Zaɓi abin da ya faru:",
        "need_help_now": "Kuna Bukatar Taimako Yanzu?",
        "get_help_now": "Samun Taimako Yanzu",
        "you_are_not_alone": "Ba ku kadai ba",
        "help_available": "Ana samun taimako koyaushe. Amincin ku yana da muhimmanci.",
        "incident_types": {
          "violence_at_home": "Tashin hankali a gida",
          "harm_to_child": "Cutar da yaro",
          "unwanted_touching": "Taɓawa da ba a so ko zalunci",
          "other_safety": "Wani matsalar aminci"
        },
        "report_this": "Bayar da Rahoton Wannan"
      }
    }
  },
  ig: {
    translation: {
      "app": { "name": "Ebe Nchekwa", "tagline": "Kọwa ihe mere" },
      "landing": {
        "hero_description": "Usoro nchekwa maka ikposa ihe mere na-amaghi onye na inweta nkwado",
        "report_anonymously": "Kpọsa Na-amaghi Onye",
        "ngo_section": "Maka Nzukọ Onyinye",
        "ngo_description": "Jikwaa ihe mere, nyere ndị merụrụ ahụ aka",
        "login": "Banye",
        "register": "Debanye Nzukọ"
      },
      "dashboard": {
        "choose_what_happened": "Họrọ ihe mere:",
        "need_help_now": "Ị Chọrọ Enyemaka Ugbu a?",
        "get_help_now": "Nweta Enyemaka Ugbu a",
        "you_are_not_alone": "Ị nọghị naanị gị",
        "help_available": "Enyemaka dị mgbe niile. Nchekwa gị dị mkpa.",
        "incident_types": {
          "violence_at_home": "Ime ihe ike n'ụlọ",
          "harm_to_child": "Imerụ nwata ahụ",
          "unwanted_touching": "Imetụ aka na-achọghị ma ọ bụ mmekpa ahụ",
          "other_safety": "Nsogbu nchekwa ọzọ"
        },
        "report_this": "Kpọsa Nke a"
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