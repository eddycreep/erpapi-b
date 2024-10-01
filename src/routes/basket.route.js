const express = require('express');
const router = express.Router();

const BasketController = require('../controllers/basket.controller');

require('dotenv').config({ path: './configuration.env' });

//getBasket information
router.get('/getcustomerbasket/:basket_id', BasketController.getCustomerBasket); //getBasketInfo
router.get('/getbasketitems/:basket_id', BasketController.getCustomerBasketItems); //getBasketInfo
router.get('/checkloyalty/:customer_id', BasketController.checkLoyaltyCustomer); //checkLoyaltyCustomers

//getProductDetails - get
router.get('/getproductdetails/:item_code', BasketController.getProductDetails); //getProductDetails
router.get('/getproductspecial/:product_description', BasketController.getProductSpecials); //getSpecial using the product name

//save the 
router.post('/saveclientransaction', BasketController.saveClientsTransaction); //save the client transaction with the applied amounts

module.exports = router;