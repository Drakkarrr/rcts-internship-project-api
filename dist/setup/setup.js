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
import { globSync } from 'glob';
import fs from 'fs';
import { generate as uniqueId } from 'shortid';
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
mongoose.connect(process.env.DATABASE);
function setupApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Admin = require('../models/coreModels/Admin');
            const AdminPassword = require('../models/coreModels/AdminPassword');
            const newAdminPassword = new AdminPassword();
            const salt = uniqueId();
            const passwordHash = newAdminPassword.generateHash(salt, 'admin123');
            const demoAdmin = {
                email: 'admin@demo.com',
                name: 'Admin',
                surname: 'Test',
                enabled: true,
                role: 'owner',
            };
            const result = yield new Admin(demoAdmin).save();
            const AdminPasswordData = {
                password: passwordHash,
                emailVerified: true,
                salt: salt,
                user: result._id,
            };
            yield new AdminPassword(AdminPasswordData).save();
            console.log('👍 Admin created : Done!');
            const Setting = require('../models/coreModels/Setting');
            const settingFiles = [];
            const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
            for (const filePath of settingsFiles) {
                const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                settingFiles.push(...file);
            }
            yield Setting.insertMany(settingFiles);
            console.log('👍 Settings created : Done!');
            const Currency = require('../models/appModels/Currency');
            const { currencyList } = require('../utils/currencyList');
            const PaymentMode = require('../models/appModels/PaymentMode');
            const Taxes = require('../models/appModels/Taxes');
            yield Currency.insertMany(currencyList);
            console.log('👍 Currency created : Done!');
            yield Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
            console.log('👍 Taxes created : Done!');
            yield PaymentMode.insertMany([
                {
                    name: 'Default Payment',
                    description: 'Default Payment Mode (Cash and Bank)',
                    isDefault: true,
                },
            ]);
            console.log('👍 PaymentMode created : Done!');
            console.log('🥳 Setup completed : Success!');
            process.exit();
        }
        catch (e) {
            console.log('\n🚫 Error! The Error info is below');
            console.log(e);
            process.exit();
        }
    });
}
setupApp();
