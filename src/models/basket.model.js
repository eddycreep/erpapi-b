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

Basket.determineLoyaltyCustomer = (req, result) => {
    dbConn.query('SELECT customer_id, first_name, last_name, loyalty_tier FROM erpapi.tblloyaltycustomers where customer_id = ?', [req.params.customer_id], (err, res) => {
        if (err) {
            console.log('Error while checking if the customer is apart of the loyalty program' + err);
            result(null, err);
        } else {
            console.log('The Customer is apart of the loyalty program', res);
            result(null, res);
        }
    });
}

Basket.getProductDetails = (req, result) => {
    dbConn.query(`SELECT inv.item_code, COALESCE(NULLIF(inv.description_1, ''), inv.description_2) AS description, mst.selling_incl_1, mst.special_price_incl FROM erpapi.tblinventory inv JOIN erpapi.tblmultistoretrn mst ON inv.item_code = mst.item_code WHERE inv.item_code = ?`, [req.params.item_code], (err, res) => {
        if (err) {
            console.log('Error while getting the product details using the item_code' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the product details using the item_code', res);
            result(null, res);
        }
    });
}

Basket.getCustomerSpecials = (req, result) => {
    dbConn.query('SELECT uid, special_id, stockcode, product_description, special, special_price, special_value, special_type, start_date, expiry_date FROM erpapi.tblspecials where product_description = ?', [req.params.product], (err, res) => {
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

