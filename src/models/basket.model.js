var dbConn = require("../../config/db.config");

var Basket = function (user) {
    this.basket_id = user.basket_id;
    this.customer_id = user.customer_id;
    this.purchase_date = user.purchase_date;
    this.total_amount = user.total_amount;
    this.created_at = user.created_at
};

Basket.getCustomerBasket = (req, result) => {
    dbConn.query('SELECT basket_id, customer_id, product, quantity, purchase_date, total_amount, payment_method FROM erpapi.tblbasketinfo where basket_id = ?', [req.params.basket_id], (err, res) => {
        if (err) {
            console.log('Error while getting basket information' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the customers basket information', res);
            result(null, res);
        }
    });
}

Basket.getCustomerSpecials = (req, result) => {
    dbConn.query('SELECT uid, product, special, specialAmount, specialValue, specialType, startDate, expiryDate FROM erpapi.tblspecials where product = ?', [req.params.product], (err, res) => {
        if (err) {
            console.log('Error while checking the product specials for the purchased item' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the special using the basket infomation', res);
            result(null, res);
        }
    });
}

Basket.saveClientsTransaction = (req, result) => {
    const { basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time } = req.body;
    dbConn.query('INSERT INTO erpapi.basketinfo_items (basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time)VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time], (err, res) => {
        if (err) {
            console.log('Error while checking the product specials for the purchased item' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the special using the basket infomation', res);
            result(null, res);
        }
    });
}

module.exports = Basket;

