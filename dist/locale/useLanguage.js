var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readBySettingKey } from '@/middlewares/settings';
function getCurrentLanguage() {
    return __awaiter(this, void 0, void 0, function* () {
        const { settingValue } = yield readBySettingKey({ settingKey: 'language' });
        return settingValue;
    });
}
const getLabel = (lang, key) => {
    try {
        const lowerCaseKey = key
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/ /g, '_');
        if (lang[lowerCaseKey])
            return lang[lowerCaseKey];
        else {
            const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');
            const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map((word) => word[0].toUpperCase() + word.substring(1));
            const label = conversionOfAllFirstCharacterofEachWord.join(' ');
            return label;
        }
    }
    catch (error) {
        return 'No translate Found';
    }
};
const useSelector = (lang) => {
    const filePath = `./translation/${lang}`;
    const defaultfilePath = `./translation/en_us`;
    const currentTranslation = require(filePath);
    if (currentTranslation) {
        return currentTranslation;
    }
    else {
        const langFile = require(defaultfilePath);
        return langFile;
    }
};
const useLanguage = ({ selectedLang }) => {
    const lang = useSelector(selectedLang);
    const translate = (value) => {
        const text = getLabel(lang, value);
        return text;
    };
    return translate;
};
export default useLanguage;
