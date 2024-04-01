import { readBySettingKey } from '@/middlewares/settings';

interface Language {
  [key: string]: string;
}

interface Translation {
  [key: string]: Language;
}

async function getCurrentLanguage(): Promise<string> {
  const { settingValue } = await readBySettingKey({ settingKey: 'language' });
  return settingValue;
}

const getLabel = (lang: Language, key: string): string => {
  try {
    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    if (lang[lowerCaseKey]) return lang[lowerCaseKey];
    else {
      const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');

      const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
        (word) => word[0].toUpperCase() + word.substring(1)
      );

      const label = conversionOfAllFirstCharacterofEachWord.join(' ');

      return label;
    }
  } catch (error) {
    return 'No translate Found';
  }
};

const useSelector = (lang: string): Translation => {
  const filePath = `./translation/${lang}`;
  const defaultfilePath = `./translation/en_us`;

  const currentTranslation = require(filePath) as Translation;

  if (currentTranslation) {
    return currentTranslation;
  } else {
    const langFile = require(defaultfilePath) as Translation;
    return langFile;
  }
};

const useLanguage = ({ selectedLang }: { selectedLang: string }) => {
  const lang = useSelector(selectedLang);
  const translate = (value: string): string => {
    const text = getLabel(lang as any, value);
    return text;
  };
  return translate;
};

export default useLanguage;
