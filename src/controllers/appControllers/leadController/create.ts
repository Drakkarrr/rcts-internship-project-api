import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

const People = mongoose.model('People');
const Company = mongoose.model('Company');

interface ReqBody {
  type: string;
  people?: string;
  company?: string;
  name?: string;
  removed?: boolean;
}

const create = async (Model: Model<any>, req: Request, res: Response) => {
  const reqBody: ReqBody = req.body;

  try {
    if (reqBody.type === 'people') {
      if (!reqBody.people) {
        return res.status(403).json({
          success: false,
          message: 'Please select a people',
        });
      } else {
        const { firstname, lastname } = await People.findOne({
          _id: reqBody.people,
          removed: false,
        }).exec();
        reqBody.name = `${firstname} ${lastname}`;
        reqBody.company = null as any;
      }
    } else {
      if (!reqBody.company) {
        return res.status(403).json({
          success: false,
          message: 'Please select a company',
        });
      } else {
        const { name } = await Company.findOne({
          _id: reqBody.company,
          removed: false,
        }).exec();
        reqBody.name = name;
        reqBody.people = null as any;
      }
    }

    reqBody.removed = false;
    const result = await new Model(reqBody).save();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model',
    });
  } catch (error: string | any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export default create;
