import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { generate as uniqueId } from 'shortid';
import Joi from 'joi';
import { globSync } from 'glob';
import fs from 'fs';

const setup = async (req: Request, res: Response): Promise<void> => {
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

    const result = await new Admin(accountOwnner).save();

    const AdminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };

    await new AdminPassword(AdminPasswordData).save();

    const settingData: any[] = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const settingsToUpdate: any = {
        rcts_app_email: email,
        rcts_app_company_email: email,
        rcts_app_timezone: timezone,
        rcts_app_country: country,
        rcts_app_language: language || 'en_us',
      };

      const newSettings = file.map((x: any) => {
        const settingValue = settingsToUpdate[x.settingKey];
        return settingValue ? { ...x, settingValue } : { ...x };
      });

      settingData.push(...newSettings);
    }

    await Setting.insertMany(settingData);

    const { currencyList } = require('@/utils/currencyList');

    await Currency.insertMany(currencyList);

    await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);

    await PaymentMode.insertMany([
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
  } catch (error: string | any) {
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export default setup;
