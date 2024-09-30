const express = require('express');
const router = express.Router();

const BasketController = require('../controllers/basket.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/getcustomerbasket/:basket_id', BasketController.getCustomerBasket);

router.get('/getcustomerspecial/:product', BasketController.getCustomerSpecials);

router.post('/saveclientransaction', BasketController.saveClientsTransaction);

module.exports = router;