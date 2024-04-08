import dotenv from 'dotenv';
import { globSync } from 'glob';
import fs from 'fs';
import { generate as uniqueId } from 'shortid';
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
mongoose.connect(process.env.DATABASE);
async function setupApp() {
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
        const result = await new Admin(demoAdmin).save();
        const AdminPasswordData = {
            password: passwordHash,
            emailVerified: true,
            salt: salt,
            user: result._id,
        };
        await new AdminPassword(AdminPasswordData).save();
        console.log('👍 Admin created : Done!');
        const Setting = require('../models/coreModels/Setting');
        const settingFiles = [];
        const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
        for (const filePath of settingsFiles) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            settingFiles.push(...file);
        }
        await Setting.insertMany(settingFiles);
        console.log('👍 Settings created : Done!');
        const Currency = require('../models/appModels/Currency');
        const { currencyList } = require('../utils/currencyList');
        const PaymentMode = require('../models/appModels/PaymentMode');
        const Taxes = require('../models/appModels/Taxes');
        await Currency.insertMany(currencyList);
        console.log('👍 Currency created : Done!');
        await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
        console.log('👍 Taxes created : Done!');
        await PaymentMode.insertMany([
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
}
setupApp();
//# sourceMappingURL=setup.js.map