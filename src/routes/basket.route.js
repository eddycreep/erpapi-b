const express = require('express');
const router = express.Router();

const BasketController = require('../controllers/basket.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/getcustomerbasket/:basket_id', BasketController.getCustomerBasket);

module.exports = router;