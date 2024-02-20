import mongoose, { Schema, Document } from 'mongoose';

interface IItem {
    name: string;
    tags: string[];
    price: {
        $numberDecimal: string;
    };
    quantity: number;
}
export interface ISales extends Document {
    saleDate: Date;
    storeLocation: string;
    couponUsed: boolean;
    purchaseMethod: string;
    customer: {
        pronoun: string;
        age: number;
        email: string;
        satisfaction: number;
    };
    items: IItem[];
}



const SalesSchema: Schema = new Schema({
    saleDate: { type: Date, required: true, index: true },
    storeLocation: { type: String, required: true, index: true },
    couponUsed: { type: Boolean, required: true, index: true },
    purchaseMethod: { type: String, required: true, index: true},
    customer: {
        pronoun: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, required: true, index: true },
        satisfaction: { type: Number, required: true },
    },
    items: [{
        name: { type: String, required: true },
        tags: [{ type: String, required: true }],
        price: {
            $numberDecimal: { type: String, required: true }
        },
        quantity: { type: Number, required: true }
    }]
});
SalesSchema.index({ storeLocation: 1, saleDate: -1 });

const Sales = mongoose.model<ISales>('Sales', SalesSchema);

export default Sales;
