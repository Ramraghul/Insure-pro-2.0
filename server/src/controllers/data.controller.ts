import { Request, Response } from 'express';
import { format } from 'date-fns';
import { readSalesReportFromFile } from '../middleware/readSalesFileData';

interface SalesData {
    Date: string;
    SKU: string;
    Unit_Price: number;
    Quantity: number;
    Total_Price: number;
}

// Main Controller
const mainController = {


    async getAllSalesData(req: Request, res: Response): Promise<void> {
        try {
            const { limit = 50, offset = 0 }: { limit?: number, offset?: number } = req.query;

            // Ensure limit and offset are valid numbers
            if (isNaN(limit) || isNaN(offset)) {
                res.status(400).json({ error: 'Invalid limit or offset parameters' });
                return;
            }

            // Read sales data from file with limit and offset
            const report = await readSalesReportFromFile('src/data/salesData.csv',);

            res.status(200).json({
                success: true,
                message: "Data Fetched Successfully",
                data: report
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    },


    async getSalesAnalytics(req: Request, res: Response) {
        try {
            const salesData = await readSalesReportFromFile('src/data/salesData.csv');
            const analyticsData = processSalesData(salesData);
            res.status(200).json({
                success: true,
                message: 'Sales analytics data fetched successfully',
                data: analyticsData
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};

function processSalesData(salesData: SalesData[]) {
    const totalSales = salesData.reduce((total, { Total_Price }) => total + Total_Price, 0);
    const dayWiseSales = calculateDateWiseSales(salesData)
    const monthWiseSales = calculateMonthWiseSales(salesData);
    const mostPopularItemPerMonth = calculateMostPopularItemPerMonth(salesData);
    const mostRevenueItemPerMonth = calculateMostRevenueItemPerMonth(salesData);
    const popularItemOrdersStats = calculatePopularItemOrdersStats(salesData, mostPopularItemPerMonth);

    return {
        totalSales,
        dayWiseSales,
        monthWiseSales,
        mostPopularItemPerMonth,
        mostRevenueItemPerMonth,
        popularItemOrdersStats
    };
}



function calculateDateWiseSales(salesData: SalesData[]) {
    const monthWiseSales: { [key: string]: number } = {};
    salesData.forEach(({ Date, Total_Price }) => {
        monthWiseSales[Date] = (monthWiseSales[Date] || 0) + Total_Price;
    });
    return monthWiseSales;
}

function calculateMonthWiseSales(salesData: SalesData[]) {
    const monthWiseSales: { [key: string]: number } = {};
    salesData.forEach(({ Date, Total_Price }) => {
        const month = Date.split('-')[1];
        if (!monthWiseSales[month]) {
            monthWiseSales[month] = 0;
        }
        monthWiseSales[month] += Total_Price;
    });
    const monthWiseSalesWithDateRange: { [key: string]: number } = {};
    Object.keys(monthWiseSales).forEach(month => {
        const startDate = `2019-${month}-01`;
        const endDate = `2019-${month}-${new Date(2019, parseInt(month), 0).getDate()}`;
        monthWiseSalesWithDateRange[`${startDate} - ${endDate}`] = monthWiseSales[month];
    });
    return monthWiseSalesWithDateRange;
}

function calculateMostPopularItemPerMonth(salesData: SalesData[]) {
    const mostPopularItemPerMonth: { [key: string]: { item: string, value: number } } = {};
    const quantitySoldPerItemPerMonth: { [key: string]: { [key: string]: number } } = {};
    salesData.forEach(({ Date, SKU, Quantity }) => {
        const month = Date.split('-')[1];
        if (!quantitySoldPerItemPerMonth[month]) {
            quantitySoldPerItemPerMonth[month] = {};
        }
        quantitySoldPerItemPerMonth[month][SKU] = (quantitySoldPerItemPerMonth[month][SKU] || 0) + Quantity;
    });

    Object.keys(quantitySoldPerItemPerMonth).forEach(month => {
        const itemsSold = quantitySoldPerItemPerMonth[month];
        const mostPopularItem = Object.keys(itemsSold).reduce((a, b) => itemsSold[a] > itemsSold[b] ? a : b);
        const mostPopularItemValue = itemsSold[mostPopularItem];
        const mostPopularItemConcatenated = {
            item: mostPopularItem,
            value: mostPopularItemValue
        }
        const startDate = `2019-${month}-01`;
        const endDate = `2019-${month}-${new Date(2019, parseInt(month), 0).getDate()}`;
        mostPopularItemPerMonth[`${startDate} - ${endDate}`] = mostPopularItemConcatenated;
    });
    return mostPopularItemPerMonth;
}

function calculateMostRevenueItemPerMonth(salesData: SalesData[]) {
    const revenuePerItemPerMonth: { [key: string]: { [key: string]: number } } = {};
    salesData.forEach(({ Date, SKU, Total_Price }) => {
        const month = Date.split('-')[1];
        if (!revenuePerItemPerMonth[month]) {
            revenuePerItemPerMonth[month] = {};
        }
        revenuePerItemPerMonth[month][SKU] = (revenuePerItemPerMonth[month][SKU] || 0) + Total_Price;
    });

    const mostRevenueItemPerMonth: { [key: string]: { item: string, value: number } } = {};
    Object.keys(revenuePerItemPerMonth).forEach(month => {
        const itemsRevenue = revenuePerItemPerMonth[month];
        const mostRevenueItem = Object.keys(itemsRevenue).reduce((a, b) => itemsRevenue[a] > itemsRevenue[b] ? a : b);
        const mostRevenueItemValue = itemsRevenue[mostRevenueItem];
        const mostRevenueItemConcatenated = {
            item: mostRevenueItem,
            value: mostRevenueItemValue
        }
        const startDate = `2019-${month}-01`;
        const endDate = `2019-${month}-${new Date(2019, parseInt(month), 0).getDate()}`;
        mostRevenueItemPerMonth[`${startDate} - ${endDate}`] = mostRevenueItemConcatenated;
    });
    return mostRevenueItemPerMonth;
}


function calculatePopularItemOrdersStats(salesData: SalesData[], mostPopularItemPerMonth: any) {
    const popularItemOrdersStats: { [key: string]: { min: number, max: number, average: number } } = {};
    const quantitySoldPerItemPerMonth: { [key: string]: { [key: string]: number } } = {};
    salesData.forEach(({ Date, SKU, Quantity }) => {
        const month = Date.split('-')[1];
        if (!quantitySoldPerItemPerMonth[month]) {
            quantitySoldPerItemPerMonth[month] = {};
        }
        quantitySoldPerItemPerMonth[month][SKU] = (quantitySoldPerItemPerMonth[month][SKU] || 0) + Quantity;
    });
    Object.keys(quantitySoldPerItemPerMonth).forEach(month => {
        const itemsSold = quantitySoldPerItemPerMonth[month];
        const mostPopularItem = parseInt(mostPopularItemPerMonth[month]);
        const itemQuantities = Object.values(itemsSold).filter(quantity => quantity !== mostPopularItem);
        const min = Math.min(...itemQuantities);
        const max = Math.max(...itemQuantities);
        const average = itemQuantities.reduce((total, quantity) => total + quantity, 0) / itemQuantities.length;
        const startDate = `2019-${month}-01`;
        const endDate = `2019-${month}-${new Date(2019, parseInt(month), 0).getDate()}`;
        popularItemOrdersStats[`${startDate} - ${endDate}`] = { min, max, average };
    });
    return popularItemOrdersStats;
}





export default mainController;
