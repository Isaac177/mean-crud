import { Request, Response } from 'express';
import Sales, {ISales} from "../models/SalesModel";

export const getAllSales = async (req: Request, res: Response) => {
    try {
        const salesData = await Sales.find();
        res.status(200).json(salesData);
    } catch (error: any) {
        console.error('Failed to retrieve sales data:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


export const getAllSalesWithExplain = async (req: Request, res: Response) => {
    try {
        const salesDataExplain = await Sales.find().explain("executionStats");
        res.status(200).json(salesDataExplain);
    } catch (error: any) {
        console.error('Failed to retrieve sales data with explain:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getAggregatedSalesData = async (req: Request, res: Response) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: "$storeLocation",
                    averageSatisfaction: { $avg: "$customer.satisfaction" }
                }
            },
            {
                $sort: { averageSatisfaction: -1 }
            }
        ];

        // @ts-ignore
        const aggregatedData = await Sales.aggregate(pipeline);
        res.status(200).json(aggregatedData);
    } catch (error: any) {
        console.error('Failed to retrieve aggregated sales data:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


export const getTotalSalesPerItem = async (req: Request, res: Response) => {
    const startTime = process.hrtime.bigint();
    try {
        const salesData = await Sales.find();
        let salesPerItem: {[key: string]: number} = {};

        salesData.forEach((sale: ISales) => {
            sale.items.forEach(item => {
                if (salesPerItem[item.name]) {
                    salesPerItem[item.name] += item.quantity;
                } else {
                    salesPerItem[item.name] = item.quantity;
                }
            });
        });

        const endTime = process.hrtime.bigint();
        const executionTime = Number(endTime - startTime) / 1e9;
        res.status(200).json({salesPerItem, executionTime});
    } catch (error: any) {
        console.error('Failed to retrieve total sales per item:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getAggregatedTotalSalesPerItem = async (req: Request, res: Response) => {
    const startTime = process.hrtime.bigint();
    try {
        const pipeline = [
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalSales: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSales: -1 } }
        ];

        // @ts-ignore
        const aggregatedData = await Sales.aggregate(pipeline);
        const endTime = process.hrtime.bigint();
        const executionTime = Number(endTime - startTime) / 1e9;
        res.status(200).json({aggregatedData, executionTime});
    } catch (error: any) {
        console.error('Failed to retrieve aggregated total sales per item:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};