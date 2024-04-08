import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE);
async function upgrade() {
    try {
        const currency_code = process.env.npm_config_currency || 'PHP';
        const Currency = require('../models/appModels/Currency');
        const { currencyList } = require('../utils/currencyList');
        await Currency.insertMany(currencyList);
        const Invoice = require('../models/appModels/Invoice');
        await Invoice.updateMany({ removed: false }, { currency: currency_code });
        const Offer = require('../models/appModels/Offer');
        await Offer.updateMany({ removed: false }, { currency: currency_code });
        const Quote = require('../models/appModels/Quote');
        await Quote.updateMany({ removed: false }, { currency: currency_code });
        const Expense = require('../models/appModels/Expense');
        await Expense.updateMany({ removed: false }, { currency: currency_code });
        const Product = require('../models/appModels/Product');
        await Product.updateMany({ removed: false }, { currency: currency_code });
        const Payment = require('../models/appModels/Payment');
        await Payment.updateMany({ removed: false }, { currency: currency_code });
        console.log('🥳 Upgrade completed :Success!');
        process.exit();
    }
    catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        console.log(e);
        process.exit();
    }
}
upgrade();
//# sourceMappingURL=upgrade.js.map