const express = require('express');
const router = express.Router();

const BasketController = require('../controllers/basket.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/getcustomerbasket/:basket_id', BasketController.getCustomerBasket); //getBasketInfo

router.get('/determineloyalty/:customer_id', BasketController.determineLoyaltyCustomer); //checkLoyaltyCustomers

router.get('/getproductdetails/:item_code', BasketController.getProductDetails); //checkLoyaltyCustomers

router.get('/getcustomerspecial/:product', BasketController.getCustomerSpecials); //getSpecials

router.post('/saveclientransaction', BasketController.saveClientsTransaction);

module.exports = router;