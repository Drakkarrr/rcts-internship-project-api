import pug from 'pug';
import fs from 'fs';
import moment from 'moment';
import pdf from 'html-pdf';
import { listAllSettings, loadSettings } from '@/middlewares/settings';
import { getData } from '@/middlewares/serverData';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';

const pugFiles: string[] = ['invoice', 'offer', 'quote', 'payment'];

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

exports.generatePdf = async (
  modelName: string,
  info: { filename: string; format: string; targetLocation: string },
  result: any,
  callback?: () => void
) => {
  try {
    const { targetLocation } = info;

    // if PDF already exists, then delete it and create a new PDF
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    // render pdf html

    if (pugFiles.includes(modelName.toLowerCase())) {
      // Compile Pug template

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
        (currency: any) => currency.currency_code.toLowerCase() == result.currency.toLowerCase()
      );
      const { moneyFormatter } = await useMoney({ settings: currentCurrency } as any);
      const { dateFormat } = useDate({ settings } as any);

      settings.public_server_file = process.env.PUBLIC_SERVER_FILE as string;

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
          format: info.format as any,
          orientation: 'portrait',
          border: '10mm',
        })
        .toFile(targetLocation, function (error: Error) {
          if (error) throw new Error(error.message);
          if (callback) callback();
        });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default exports;
