import fs from 'fs';
import csv from 'csv-parser';

export interface SaleRecord {
    Date: string;
    SKU: string;
    Unit_Price: number;
    Quantity: number;
    Total_Price: number;
}

export async function readSalesReportFromFile(filePath: string, limit?: number, offset?: number): Promise<SaleRecord[]> {
    return new Promise((resolve, reject) => {
        const saleReport: SaleRecord[] = [];

        const stream = fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: any) => {
                saleReport.push({
                    Date: row.Date,
                    SKU: row.SKU,
                    Unit_Price: parseFloat(row.Unit_Price),
                    Quantity: parseInt(row.Quantity),
                    Total_Price: parseFloat(row.Total_Price)
                });
            })
            .on('end', () => {
                let result = saleReport.slice(offset || 0);
                if (limit) {
                    result = result.slice(0, limit); 
                }
                resolve(result);
            })
            .on('error', (error: Error) => {
                reject(error);
            });

        // Handle errors on the stream itself
        stream.on('error', (error: Error) => {
            reject(error);
        });
    });
}
