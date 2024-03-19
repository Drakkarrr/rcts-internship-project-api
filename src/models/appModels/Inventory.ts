import mongoose, { Schema, Document } from 'mongoose';

interface IAdjustment extends Document {
  increase: {
    returned: number;
    change: number;
    refund: number;
    other: number;
  };
  decrease: {
    damaged: number;
    change: number;
    refund: number;
    other: number;
  };
}

interface IInventory extends Document {
  removed: boolean;
  enabled: boolean;
  product: Schema.Types.ObjectId;
  quantity: number;
  threshold: number;
  order: number;
  purchase: number;
  adjustment: IAdjustment;
  created: Date;
  updated: Date;
}

const adjustmentSchema: Schema<IAdjustment> = new Schema<IAdjustment>({
  increase: {
    returned: {
      type: Number,
      default: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    refund: {
      type: Number,
      default: 0,
    },
    other: {
      type: Number,
      default: 0,
    },
  },
  decrease: {
    damaged: {
      type: Number,
      default: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    refund: {
      type: Number,
      default: 0,
    },
    other: {
      type: Number,
      default: 0,
    },
  },
});

const inventorySchema: Schema<IInventory> = new Schema<IInventory>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
  purchase: {
    type: Number,
    default: 0,
  },
  adjustment: adjustmentSchema,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IInventory>('Inventory', inventorySchema);
