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
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
mongoose.connect(process.env.DATABASE);
function deleteData() {
    return __awaiter(this, void 0, void 0, function* () {
        const Admin = require('../models/coreModels/Admin');
        const AdminPassword = require('../models/coreModels/AdminPassword');
        const Setting = require('../models/coreModels/Setting');
        const Email = require('../models/coreModels/Email');
        const Currency = require('../models/appModels/Currency');
        yield Admin.deleteMany();
        yield AdminPassword.deleteMany();
        console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
        yield Setting.deleteMany();
        console.log('👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n');
        yield Currency.deleteMany();
        console.log('👍 Currency Deleted. To setup Currency data, run\n\n\t npm run setup\n\n');
        yield Email.deleteMany();
        console.log('👍 Email Deleted. To setup Email data, run\n\n\t npm run setup\n\n');
        process.exit();
    });
}
deleteData();
