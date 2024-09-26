var dbConn = require("../../config/db.config");

var Basket = function (user) {
    this.basket_id = user.basket_id;
    this.customer_id = user.customer_id;
    this.purchase_date = user.purchase_date;
    this.total_amount = user.total_amount;
    this.created_at = user.created_at
};

Basket.getCustomerBasket = (req, result) => {
    dbConn.query('SELECT basket_id, customer_id, purchased_product, quantity, purchase_date, total_amount, payment_method FROM erpapi.tblbasketinfo where basket_id = ?', [req.params.basket_id], (err, res) => {
        if (err) {
            console.log('Error while getting basket information' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the customers basket information', res);
            result(null, res);
        }
    });
}


module.exports = Basket;

