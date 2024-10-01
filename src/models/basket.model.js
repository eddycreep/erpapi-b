var dbConn = require("../../config/db.config");

var Basket = function (user) {
    this.basket_id = user.basket_id;
    this.customer_id = user.customer_id;
    this.purchase_date = user.purchase_date;
    this.total_amount = user.total_amount;
    this.created_at = user.created_at
};

Basket.getCustomerBasket = (req, result) => {
    dbConn.query('SELECT basket_id, customer_id, total_amount, purchase_date FROM tblbasketinfo WHERE basket_id = ?', [req.params.basket_id], (err, res) => {
        if (err) {
            console.log('Error while getting basket information' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the customers basket information', res);
            result(null, res);
        }
    });
}

Basket.getCustomerBasketItems = (req, result) => {
    dbConn.query('SELECT product, quantity, product_price, basket_id FROM erpapi.tblbasketinfo_items WHERE basket_id = ?', [req.params.basket_id], (err, res) => {
        if (err) {
            console.log('Error while getting basket information' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the customers basket information', res);
            result(null, res);
        }
    });
}


Basket.checkLoyaltyCustomer = (req, result) => {
    dbConn.query('SELECT customer_id, loyalty_tier FROM erpapi.tblloyaltycustomers WHERE customer_id = ?', [req.params.customer_id], (err, res) => {
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

Basket.getProductSpecials = (req, result) => {
    dbConn.query('SELECT erpapi.tblspecialitems.special_id, erpapi.tblspecialitems.item_code, erpapi.tblspecials.product_description, erpapi.tblspecials.special, erpapi.tblspecials.special_price, erpapi.tblspecials.special_value, erpapi.tblspecials.special_type, erpapi.tblspecials.start_date, erpapi.tblspecials.expiry_date FROM erpapi.tblspecialitems INNER JOIN erpapi.tblspecials ON erpapi.tblspecialitems.special_id = erpapi.tblspecials.special_id WHERE start_date <= CURDATE() AND expiry_date >= CURDATE() AND erpapi.tblspecials.product_description = ?', [req.params.product_description], (err, res) => {
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

