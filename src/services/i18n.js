import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    fallbackLng: "en",
    resources: {
        en: require("../locale/en/translate.json"),

        zh: require("../locale/zh/translate.json"),
    },
    defaultNS: "translations",
});

export default i18n;
