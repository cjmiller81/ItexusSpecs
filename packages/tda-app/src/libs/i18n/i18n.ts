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
    returnEmptyString: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    defaultNS: ["common", "login"],
    resources,
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      const message = `Missing translation key [${key}] for [${lng}/${ns}], fallbackValue: ${fallbackValue}`
      console.warn(message)
      return fallbackValue
    },
  })

export default i18n
