import pug from 'pug';
import fs from 'fs';
import moment from 'moment';
import pdf from 'html-pdf';
import { listAllSettings, loadSettings } from '@/middlewares/settings';
import { getData } from '@/middlewares/serverData';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

interface PdfInfo {
  filename: string;
  format: string;
  targetLocation: string;
}

interface Result {
  currency: string;
}

export const generatePdf = async (
  modelName: string,
  info: PdfInfo = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result: Result,
  callback?: () => void
): Promise<void> => {
  try {
    const { targetLocation } = info;

    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    if (pugFiles.includes(modelName.toLowerCase())) {
      const loadCurrency = async () => {
        const datas = await getData({
          model: 'Currency',
        });
        return datas;
      };

      const settings = await loadSettings();
      const selectedLang = settings['idurar_app_language'];
      const translate = useLanguage({ selectedLang });
      const currencyList = await loadCurrency();
      const currentCurrency = currencyList.find(
        (currency) => currency.currency_code.toLowerCase() == result.currency.toLowerCase()
      );
      const { moneyFormatter } = await useMoney({ settings: currentCurrency });
      const { dateFormat } = useDate({ settings });

      settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

      const htmlContent = pug.renderFile(`src/pdf/${modelName}.pug`, {
        model: result,
        settings,
        translate,
        dateFormat,
        moneyFormatter,
        moment: moment,
      });

      pdf
        .create(htmlContent, {
          format: info.format,
          orientation: 'portrait',
          border: '10mm',
        })
        .toFile(targetLocation, function (error) {
          if (error) throw new Error(error);
          if (callback) callback();
        });
    }
  } catch (error) {
    throw new Error(error);
  }
};
