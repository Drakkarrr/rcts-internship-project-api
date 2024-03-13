import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import moment from 'moment';
import { loadSettings } from '@/middlewares/settings';
import { checkCurrency } from '@/utils/currency';

interface Invoice {
  _id: mongoose.Types.ObjectId;
  total: number;
  currency: string;
  status: string;
  paymentStatus: string;
  expiredDate: Date;
}

interface StatusResult {
  status: string;
  count: number;
  percentage: number;
}

interface PaymentStatusResult {
  status: string;
  count: number;
  percentage: number;
}

interface Result {
  total: number;
  total_undue: number;
  type: string;
  performance: (StatusResult | PaymentStatusResult)[];
}

const summary = async (req: Request, res: Response): Promise<Response> => {
  let defaultType: string = 'month';

  const { type, currency }: { type?: string; currency?: string } = req.query;

  const settings: any = await loadSettings();

  const currentCurrency: string = currency
    ? currency.toUpperCase()
    : settings['default_currency_code'].toUpperCase();

  if (type) {
    if (!['week', 'month', 'year'].includes(type)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }
    defaultType = type;
  }

  const currentDate: moment.Moment = moment();
  const startDate: moment.Moment = currentDate.clone().startOf(defaultType as any);
  const endDate: moment.Moment = currentDate.clone().endOf(defaultType as any);

  const statuses: string[] = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

  const response: any[] = await Model.aggregate([
    {
      $match: {
        removed: false,
        currency: currentCurrency,
      },
    },
    {
      $facet: {
        totalInvoice: [
          {
            $group: {
              _id: null,
              total: {
                $sum: '$total',
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              total: '$total',
              count: '$count',
            },
          },
        ],
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
        paymentStatusCounts: [
          {
            $group: {
              _id: '$paymentStatus',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
        overdueCounts: [
          {
            $match: {
              expiredDate: {
                $lt: new Date(),
              },
            },
          },
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
      },
    },
  ]);

  let result: (StatusResult | PaymentStatusResult)[] = [];

  const totalInvoices: { total: number; count: number } = response[0].totalInvoice?.[0] || {
    total: 0,
    count: 0,
  };
  const statusResult: StatusResult[] = response[0].statusCounts || [];
  const paymentStatusResult: PaymentStatusResult[] = response[0].paymentStatusCounts || [];
  const overdueResult: StatusResult[] = response[0].overdueCounts || [];

  const statusResultMap: StatusResult[] = statusResult.map((item: StatusResult) => ({
    ...item,
    percentage: Math.round((item.count / totalInvoices.count) * 100),
  }));

  const paymentStatusResultMap: PaymentStatusResult[] = paymentStatusResult.map(
    (item: PaymentStatusResult) => ({
      ...item,
      percentage: Math.round((item.count / totalInvoices.count) * 100),
    })
  );

  const overdueResultMap: StatusResult[] = overdueResult.map((item: StatusResult) => ({
    ...item,
    status: 'overdue',
    percentage: Math.round((item.count / totalInvoices.count) * 100),
  }));

  statuses.forEach((status: string) => {
    const found: StatusResult | PaymentStatusResult | undefined = [
      ...paymentStatusResultMap,
      ...statusResultMap,
      ...overdueResultMap,
    ].find((item: StatusResult | PaymentStatusResult) => item.status === status);
    if (found) {
      result.push(found);
    }
  });

  const unpaid: { total_amount: number }[] = await Model.aggregate([
    {
      $match: {
        removed: false,
        currency: currentCurrency,
        paymentStatus: { $in: ['unpaid', 'partially'] },
      },
    },
    {
      $group: {
        _id: null,
        total_amount: {
          $sum: { $subtract: ['$total', '$credit'] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total_amount: '$total_amount',
      },
    },
  ]);

  const finalResult: Result = {
    total: totalInvoices.total,
    total_undue: unpaid.length > 0 ? unpaid[0].total_amount : 0,
    type: defaultType,
    performance: result,
  };

  return res.status(200).json({
    success: true,
    result: finalResult,
    message: `Successfully found all invoices for the last ${defaultType}`,
  });
};

export default summary;
