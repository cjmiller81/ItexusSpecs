import i18next from "i18next"

export const getIncorectPassword = () => i18next.t("incorectPassword", { ns: "errorMessages" })
export const getPasswordDoNotMatch = () => i18next.t("passwordDoNotMatch", { ns: "errorMessages" })
export const getMandatoryField = () => i18next.t("mandatoryField", { ns: "errorMessages" })
export const getInvalidPhoneField = () => i18next.t("invalidPhoneNumber", { ns: "errorMessages" })
export const getInvalidFormat = () => i18next.t("invalidFormat", { ns: "errorMessages" })
export const getUndefinedErrorMessage = () => i18next.t("somethingWentWrong", { ns: "errorMessages" })

export const getMaxLengthMessage = (max: number) => i18next.t("maxSymbols", { value: max, ns: "errorMessages" })
export const getMinLengthMessage = (min: number) => i18next.t("minSymbols", { value: min, ns: "errorMessages" })
