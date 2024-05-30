import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import enLocale from "../../../public/locales/en/translation.json"

const resources = {
  en: enLocale,
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    returnEmptyString: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    defaultNS: ["common", "login"],
    resources,
  })

export default i18n
