// Required Package Import
import express from "express";
const route = express.Router();
import mainController from "../controllers/data.controller";

//Get all Sales Detail
route.get('/getAllSalesData', mainController.getAllSalesData);

//Get Sale Analytics
route.get('/getSalesAnalytics', mainController.getSalesAnalytics);

export default route;
