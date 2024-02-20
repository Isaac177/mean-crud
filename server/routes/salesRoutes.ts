import express from "express";
import {
    getAggregatedSalesData,
    getAggregatedTotalSalesPerItem,
    getAllSales,
    getAllSalesWithExplain, getTotalSalesPerItem
} from "../controllers/salesController";


const router = express.Router();

router.get('/sales', getAllSales);

router.get('/sales/explain', getAllSalesWithExplain);

router.get('/sales/aggregated', getAggregatedSalesData);

router.get('/sales/totalAggregated', getAggregatedTotalSalesPerItem);

router.get('/sales/totalSalesPerItem', getTotalSalesPerItem);

export default router;