const express = require('express');
const router = express.Router();

const BasketController = require('../controllers/basket.controller');

require('dotenv').config({ path: './configuration.env' });

//get-basket information || check-if-on-loyalty || get-product-prices 
router.get('/getcustomerbasket/:basket_id', BasketController.getCustomerBasket); 
router.get('/checkloyalty/:customer_id', BasketController.checkLoyaltyCustomer); 
router.get('/getproductprices/:product_description', BasketController.getProductPrices);

//get-product-specials
router.get('/getproductspecial/:product_description', BasketController.getProductSpecials); 
router.get('/getproductgroupspecial/:product_description', BasketController.getProductGroupSpecials); 

router.post('/savebasketinfoitems', BasketController.saveBasketInfoItems); 
router.post('/savefinaltransaction', BasketController.saveFinalTransaction); 

module.exports = router;