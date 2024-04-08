import pug from 'pug';
import fs from 'fs';
import moment from 'moment';
import pdf from 'html-pdf';
import { loadSettings } from '@/middlewares/settings';
import { getData } from '@/middlewares/serverData';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
const pugFiles = ['invoice', 'offer', 'quote', 'payment'];
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
exports.generatePdf = async (modelName, info, result, callback) => {
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
            const currentCurrency = currencyList.find((currency) => currency.currency_code.toLowerCase() == result.currency.toLowerCase());
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
                if (error)
                    throw new Error(error.message);
                if (callback)
                    callback();
            });
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export default exports;
//# sourceMappingURL=index.js.map