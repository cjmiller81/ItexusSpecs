import i18n from "i18next";

export function getTranslator(ns: string) {
  return (key: string, options?: object) => i18n.t(key, { ns: ns, ...options });
}
