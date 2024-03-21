import { Request, Response } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import { loadSettings } from '@/middlewares/settings';
import { checkCurrency } from '@/utils/currency';

const Model = mongoose.model('Quote');

interface QuoteSummary {
  status: string;
  count: number;
  percentage: number;
  total_amount: number;
}

const summary = async (req: Request, res: Response) => {
  let defaultType = 'month';

  const { type, currency } = req.query;

  const settings = await loadSettings();

  const currentCurrency = currency
    ? (currency as string).toUpperCase()
    : (settings['default_currency_code'] as string).toUpperCase();

  if (type) {
    if (['week', 'month', 'year'].includes(type as string)) {
      defaultType = type as string;
    } else {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }
  }

  const currentDate = moment();
  let startDate = currentDate.clone().startOf(defaultType as moment.unitOfTime.StartOf | any);
  let endDate = currentDate.clone().endOf(defaultType as moment.unitOfTime.StartOf | any);

  const statuses = ['draft', 'pending', 'sent', 'expired', 'declined', 'accepted'];

  const result = await Model.aggregate<QuoteSummary>([
    {
      $match: {
        removed: false,
        currency: currentCurrency,
        // date: {
        //   $gte: startDate.toDate(),
        //   $lte: endDate.toDate(),
        // },
      },
    },
    {
      $group: {
        _id: '$status',
        count: {
          $sum: 1,
        },
        total_amount: {
          $sum: '$total',
        },
      },
    },
    {
      $group: {
        _id: null,
        total_count: {
          $sum: '$count',
        },
        results: {
          $push: '$$ROOT',
        },
      },
    },
    {
      $unwind: '$results',
    },
    {
      $project: {
        _id: 0,
        status: '$results._id',
        count: '$results.count',
        percentage: {
          $round: [{ $multiply: [{ $divide: ['$results.count', '$total_count'] }, 100] }, 0],
        },
        total_amount: '$results.total_amount',
      },
    },
    {
      $sort: {
        status: 1,
      },
    },
  ]);

  statuses.forEach((status) => {
    const found = result.find((item) => item.status === status);
    if (!found) {
      result.push({
        status,
        count: 0,
        percentage: 0,
        total_amount: 0,
      });
    }
  });

  const total = result.reduce((acc, item) => acc + item.total_amount, 0);

  const finalResult = {
    total,
    type: defaultType,
    performance: result,
  };

  return res.status(200).json({
    success: true,
    result: finalResult,
    message: `Successfully found all Quotations for the last ${defaultType}`,
  });
};

export default summary;
