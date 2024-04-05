var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE);
function upgrade() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currency_code = process.env.npm_config_currency || 'PHP';
            const Currency = require('../models/appModels/Currency');
            const { currencyList } = require('../utils/currencyList');
            yield Currency.insertMany(currencyList);
            const Invoice = require('../models/appModels/Invoice');
            yield Invoice.updateMany({ removed: false }, { currency: currency_code });
            const Offer = require('../models/appModels/Offer');
            yield Offer.updateMany({ removed: false }, { currency: currency_code });
            const Quote = require('../models/appModels/Quote');
            yield Quote.updateMany({ removed: false }, { currency: currency_code });
            const Expense = require('../models/appModels/Expense');
            yield Expense.updateMany({ removed: false }, { currency: currency_code });
            const Product = require('../models/appModels/Product');
            yield Product.updateMany({ removed: false }, { currency: currency_code });
            const Payment = require('../models/appModels/Payment');
            yield Payment.updateMany({ removed: false }, { currency: currency_code });
            console.log('🥳 Upgrade completed :Success!');
            process.exit();
        }
        catch (e) {
            console.log('\n🚫 Error! The Error info is below');
            console.log(e);
            process.exit();
        }
    });
}
upgrade();
