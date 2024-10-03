var dbConn = require("../../config/db.config");
const EventEmitter = require('events');

const event = new EventEmitter();

var Basket = function (user) {
    this.basket_id = user.basket_id;
    this.customer_id = user.customer_id;
    this.purchase_date = user.purchase_date;
    this.total_amount = user.total_amount;
    this.created_at = user.created_at;
};

// Event listener for the 'get-total-basket' event
event.on('get-customer-basket-items', (basketId, customerID, totalAmount, purchaseDate) => {
    console.log('Retrieved transaction information:', basketId, customerID, totalAmount, purchaseDate);
    
    // Call the getCustomerBasketItems method
    Basket.getCustomerBasketItems(basketId, customerID, (err, items) => {
        if (err) {
            console.error('Error retrieving basket items:', err);
        } else {
            console.log('Basket items:', items);
            // Further processing of basket items...
        }
    });
});


event.on('get-customer-basket', (basketId) => {
    console.log('Retrieved transaction information:', basketId);
    
    // Call the getCustomerBasketItems method
    Basket.getCustomerBasket(basketId, (err, total_basket_amount) => {
        if (err) {
            console.error('Error retrieving basket total_basket_amount:', err);
        } else {
            console.log('Basket total_basket_amount:', total_basket_amount);
            // Further processing of basket items...
        }
    });
});

///--------------------------------------------------------


event.on('check-loyalty-customer', (customerId) => {
    console.log('Retrieved the customer id', customerId);
    
    // Call the getCustomerBasketItems method
    Basket.checkLoyaltyCustomer(customerId, (err, customer) => {
        if (err) {
            console.error('Error determining if the customer is on loyalty:', err);
        } else {
            console.log('Customer is on loyalty program:', customer);
            // Further processing of basket items...
        }
    });
});

event.on('get-product-details', (itemCode) => {
    console.log('Retrieved products item code:', itemCode);
    
    // Call the getCustomerBasketItems method
    Basket.getProductDetails(itemCode, (err, productItem) => {
        if (err) {
            console.error('Error retrieving the product details:', err);
        } else {
            console.log('Successfully the product details retrieved:', productItem);
            // Further processing of basket items...
        }
    });
});

event.on('get-product-specials', (product) => {
    console.log('Retrieved products items specials:', product);
    
    // Call the getCustomerBasketItems method
    Basket.getProductSpecials(product, (err, productspecials) => {
        if (err) {
            console.error('Error retrieving basket total_basket_amount:', err);
        } else {
            console.log('Basket total_basket_amount:', productspecials);
            // Further processing of basket items...
        }
    });
});

event.on('save-clients-transaction', (basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time) => {
    console.log('successfully save-clients-transaction', basket_id);
    
    // Call the getCustomerBasketItems method
    Basket.saveClientsTransaction(basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time, (err, client_info) => {
        if (err) {
            console.error('Error saving the information', err);
        } else {
            console.log('saved client information:', client_info);
            // Further processing of basket items...
        }
    });
});

// ------------------------------------Basket.checkLoyaltyCustomer


Basket.getCustomerBasket = (basketId, result) => {
    // const basketId = req.params.basket_id;
    console.log('Fetching basket with ID:', basketId); // Add logging to see the basket_id

    dbConn.query('SELECT basket_id, customer_id, total_amount, purchase_date FROM erpapi.tblbasketinfo WHERE basket_id = ?', [basketId], (err, res) => {
        if (err) {
            console.error('Error while getting basket information:', err); // Better error logging
            result(err, null);  // Notice the order: return error first
        } else if (res.length === 0) {
            console.warn('No data found for basket ID:', basketId); // Log when no data is returned
            result(null, { message: 'No basket found with this ID' }); // Return a meaningful message if no data
        } else {
            console.log('Successfully retrieved basket information:', res);

            result(null, res);
        }
    });
};


Basket.getCustomerBasketItems = (basketId, customerID, result) => {
    dbConn.query('SELECT customer_id, product, quantity, product_price FROM erpapi.tblbasketinfo_items WHERE basket_id = ?', [basketId], (err, res) => {
        if (err) {
            console.error('Error while getting basket items:', err);
            result(err, null);
        } else {
            console.log('Successfully retrieved the basket items:', res);
            result(null, res);
        }
    });
};


Basket.checkLoyaltyCustomer = (customerId, result) => {
    dbConn.query('SELECT customer_id, loyalty_tier FROM erpapi.tblloyaltycustomers WHERE customer_id = ?', [customerId], (err, res) => {
        if (err) {
            console.log('Error while checking if the customer is apart of the loyalty program' + err);
            result(null, err);
        } else {
            console.log('The Customer is apart of the loyalty program', res);
            result(null, res);
        }
    });
}

Basket.getProductDetails = (itemCode, result) => {
    dbConn.query(`SELECT inv.item_code, COALESCE(NULLIF(inv.description_1, ''), inv.description_2) AS description, mst.selling_incl_1, mst.special_price_incl FROM erpapi.tblinventory inv JOIN erpapi.tblmultistoretrn mst ON inv.item_code = mst.item_code WHERE inv.item_code = ?`, [itemCode], (err, res) => {
        if (err) {
            console.log('Error while getting the product details using the item_code' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the product details using the item_code', res);
            result(null, res);
        }
    });
}

Basket.getProductSpecials = (product, result) => {
    dbConn.query('SELECT erpapi.tblspecialitems.special_id, erpapi.tblspecialitems.item_code, erpapi.tblspecials.product_description, erpapi.tblspecials.special, erpapi.tblspecials.special_price, erpapi.tblspecials.special_value, erpapi.tblspecials.special_type, erpapi.tblspecials.start_date, erpapi.tblspecials.expiry_date FROM erpapi.tblspecialitems INNER JOIN erpapi.tblspecials ON erpapi.tblspecialitems.special_id = erpapi.tblspecials.special_id WHERE start_date <= CURDATE() AND expiry_date >= CURDATE() AND erpapi.tblspecials.product_description = ?', [product], (err, res) => {
        if (err) {
            console.log('Error while checking the product specials for the purchased item' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the special using the basket infomation', res);
            result(null, res);
        }
    });
}

Basket.saveClientsTransaction = (basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time, result) => {
    // const { basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time } = req.body;
    dbConn.query('INSERT INTO erpapi.tblbasketinfo_items (basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time)VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [basket_id, customer_id, product, quantity, product_price, discount_applied, final_price, insertion_time], (err, res) => {
        if (err) {
            console.log('Error while checking the product specials for the purchased item' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the special using the basket infomation', res);
            result(null, res);
        }
    });
}

event.emit('get-customer-basket-items', 1)
event.emit('get-customer-basket', 1);
event.emit('check-loyalty-customer', 1);
event.emit('get-product-details', '6009694632140');
event.emit('get-product-specials', 'KINGSLEY 2LTR ASST');
event.emit('save-clients-transaction', 1, 1, 'test', 3, 10, 5, 5, '2024-01-01 00:00:00');


module.exports = Basket;

