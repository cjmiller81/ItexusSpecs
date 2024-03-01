import i18n from "../libs/i18n/i18n"

export const getIncorectPassword = () => i18n.t("incorectPassword", { ns: "errorMessages" })
export const getPasswordDoNotMatch = () => i18n.t("passwordDoNotMatch", { ns: "errorMessages" })
export const getMandatoryField = () => i18n.t("mandatoryField", { ns: "errorMessages" })
export const getInvalidPhoneField = () => i18n.t("invalidPhoneNumber", { ns: "errorMessages" })
export const getUndefinedErrorMessage = () => i18n.t("SomethingWentWrong", { ns: "errorMessages" })
export const CustomRequiredMessages = () => getMandatoryField()

export const getMaxLengthMessage = (max: number) => i18n.t("maxSymbols", { value: max, ns: "errorMessages" })
export const getMinLengthMessage = (min: number) => i18n.t("minSymbols", { value: min, ns: "errorMessages" })
