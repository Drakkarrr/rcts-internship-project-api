var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import { generate as uniqueId } from 'shortid';
import Joi from 'joi';
import { globSync } from 'glob';
import fs from 'fs';
const setup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Admin = mongoose.model('Admin');
        const AdminPassword = mongoose.model('AdminPassword');
        const Setting = mongoose.model('Setting');
        const Currency = mongoose.model('Currency');
        const PaymentMode = mongoose.model('PaymentMode');
        const Taxes = mongoose.model('Taxes');
        const newAdminPassword = new AdminPassword();
        const { name, email, password, language, timezone, country, config = {} } = req.body;
        const objectSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string()
                .email({ tlds: { allow: true } })
                .required(),
            password: Joi.string().required(),
        });
        const { error, value } = objectSchema.validate({ name, email, password });
        if (error) {
            res.status(409).json({
                success: false,
                result: null,
                error: error,
                message: 'Invalid/Missing credentials.',
                errorMessage: error.message,
            });
            return;
        }
        const salt = uniqueId();
        const passwordHash = newAdminPassword.generateHash(salt, password);
        const accountOwnner = {
            email,
            name,
            role: 'owner',
        };
        const result = yield new Admin(accountOwnner).save();
        const AdminPasswordData = {
            password: passwordHash,
            emailVerified: true,
            salt: salt,
            user: result._id,
        };
        yield new AdminPassword(AdminPasswordData).save();
        const settingData = [];
        const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
        for (const filePath of settingsFiles) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const settingsToUpdate = {
                rcts_app_email: email,
                rcts_app_company_email: email,
                rcts_app_timezone: timezone,
                rcts_app_country: country,
                rcts_app_language: language || 'en_us',
            };
            const newSettings = file.map((x) => {
                const settingValue = settingsToUpdate[x.settingKey];
                return settingValue ? Object.assign(Object.assign({}, x), { settingValue }) : Object.assign({}, x);
            });
            settingData.push(...newSettings);
        }
        yield Setting.insertMany(settingData);
        const { currencyList } = require('@/utils/currencyList');
        yield Currency.insertMany(currencyList);
        yield Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
        yield PaymentMode.insertMany([
            {
                name: 'Default Payment',
                description: 'Default Payment Mode (Cash and Bank Transfer)',
                isDefault: true,
            },
        ]);
        res.status(200).json({
            success: true,
            result: {},
            message: 'Successfully RCTS App Setup',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            result: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
export default setup;
