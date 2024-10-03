var dbConn = require("../../config/db.config");
const EventEmitter = require('events');
const { getProductSpecials } = require("../controllers/basket.controller");

const event = new EventEmitter();

//variables to store basket total transaction items
let basketid;
let customerid;
let totalamount;
let purchasedate;

//variables to store all times linked too the customer basket
let product;
let quantity;
let product_price;

//store customer loyalty
let loyaltytier;

//product details
let itemcode;
let sellingPrice;
let specialPriceIncl;

//product specials
let specialid;
let special;
let specialprice;
let specialvalue;
let specialtype;
let startdate;
let expirydate;

//calculate
let newDiscountedPrice;
let newTotalDiscBasketAmount;


var Basket = function (user) {
    this.basket_id = user.basket_id;
    this.customer_id = user.customer_id;
    this.purchase_date = user.purchase_date;
    this.total_amount = user.total_amount;
    this.created_at = user.created_at;
};


event.on('get-customer-basket', (basketId) => {
    console.log('Retrieved basket information', basketId);
    
    // Call the getCustomerBasketItems method
    Basket.getCustomerBasket(basketId, (err, total_basket_amount) => {
        if (err) {
            console.error('Error retrieving basket total_basket_amount:', err);
        } else {
            console.log('Customers total basket', total_basket_amount);
            // Further processing of basket items...

            if (total_basket_amount && total_basket_amount.length > 0) {
                //assign values from the total_basket_amountult
                basketid = total_basket_amount[0].basket_id;
                customerid = total_basket_amount[0].customer_id;
                totalamount = total_basket_amount[0].total_amount;
                purchasedate = total_basket_amount[0].purchase_date;

                console.log("basket basket basket basket bakset basket:", basketid, customerid, totalamount, purchasedate)

                //emit event for basket items using stored variables
                event.emit('get-customer-basket-items', basketid)
            } else {
                console.log('there was no basket information returned from result')
            }
        }
    });
});

// Event listener for the 'get-total-basket-tems' event
event.on('get-customer-basket-items', (basketId) => {
    console.log('Retrieved the transaction basketId from GET-CUSTOMER-BASKET:', basketId);
    
    // Call the getCustomerBasketItems method
    Basket.getCustomerBasketItems(basketId, (err, basket_items) => {
        if (err) {
            console.error('Error retrieving basket_items linked to customer basket ID:', err);
        } else {
            console.log('Retrieved Customer Basket Items linked to the Basket ID:', basket_items);

            if (basket_items && basket_items.length > 0) {
                //assign values from the basket items linked to basket
                product = basket_items[0].product;
                quantity = basket_items[0].quantity;
                product_price = basket_items[0].product_price;

                console.log(`Customers Purchased Product "${product}", the quantity "${quantity}", the price "${product_price}"`)

                //emit event for basket items using stored variables
                event.emit('check-loyalty-customer', customerid) //customer id retrieved from get total basket
            } else {
                console.log('there was no basket information returned from result')
            }
        }
    });
});

///-----------------|| check loyalty customer || ---------------------------------------


event.on('check-loyalty-customer', (customerId) => {
    console.log('Retrieved the customer id', customerId);
    
    // Call the getCustomerBasketItems method
    Basket.checkLoyaltyCustomer(customerId, (err, customer) => {
        if (err) {
            console.error('Error determining if the customer is on loyalty:', err);
        } else {
            console.log('Customer is on loyalty program:', customer);
            // Further processing of basket items...

            if (customer && customer.length > 0) {
                loyaltytier = customer[0].loyalty_tier;
                console.log(`The customer is on the loyalty tier as a ${loyaltytier}`);

                //emit event for basket items using stored variables
                event.emit('get-product-details', product) //customer id retrieved from get total basket
            } else {
                console.log('Unfortunately the customer is not on the loyalty  program, No Discounts can be Applied!')
            }
        }
    });
});

event.on('get-product-details', (product) => {
    console.log('Retrieved products item code:', product);
    
    // Call the getCustomerBasketItems method
    Basket.getProductDetails(product, (err, productItem) => {
        if (err) {
            console.error('Error retrieving the product details:', err);
        } else {
            console.log('Successfully the product details retrieved:', productItem);
            // Further processing of basket items...

            if (productItem && productItem.length > 0) {
                itemcode = productItem[0].item_code;
                sellingPrice = productItem[0].selling_incl_1;
                specialPriceIncl = productItem[0].special_price_incl;
                
                console.log(`The products item code is "${itemcode}" with a selling price of "${sellingPrice}" and with a special price of "${specialPriceIncl}"`);
                event.emit('get-product-specials', product) //product retrieved from get total basket
            } else {
                console.log('No product details found for this item code')
            }
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

            if( productspecials && productspecials.length > 0) {
                specialid = productspecials[0].special_id;
                special = productspecials[0].special;
                specialprice = productspecials[0].special_price;
                specialvalue = productspecials[0].special_value;
                specialtype = productspecials[0].special_type;
                startdate = productspecials[0].start_date;
                expirydate = productspecials[0].expiry_date;
                
                console.log(`The products special id is "${specialid}", special "${special}", special price "${specialprice}", special value "${specialvalue}", special type "${specialtype}", start date "${startdate}", expiry date "${expirydate}"`);

                //calculate the product specials to the items bought
                const calculateSpecial = () => {
                    if (specialvalue === 'Percentage') {
                        const discount = (specialprice / 100) * sellingPrice;
                        newDiscountedPrice = sellingPrice - discount;

                        const newtotal = (specialprice / 100) * totalamount;
                        newTotalDiscBasketAmount = totalamount - newtotal
                    } else if (specialvalue === 'Amount') {
                        newDiscountedPrice = sellingPrice - specialprice;
                        newTotalDiscBasketAmount = specialprice - totalamount;
                    } else {
                        newDiscountedPrice = sellingPrice;  // Default case
                    }
                    console.log("New Discounted Price:", newDiscountedPrice);
                    return newDiscountedPrice;
                };
                

                calculateSpecial();
                event.emit('save-clients-transaction', basketid, customerid, product, quantity, sellingPrice, newDiscountedPrice, totalamount, newTotalDiscBasketAmount, purchasedate) //product retrieved from get total basket
            } else {
                console.log('No specials found for this item code')
            }
        }
    });
});

event.on('save-clients-transaction', (basketid, customerid, product, quantity, sellingPrice, newDiscountedPrice, totalamount, newTotalDiscBasketAmount, purchasedate) => {
    console.log('successfully save-clients-transaction', basketid);
    
    // Call the getCustomerBasketItems method
    Basket.saveClientsTransaction(basketid, customerid, product, quantity, sellingPrice, newDiscountedPrice, totalamount, newTotalDiscBasketAmount, purchasedate, (err, client_info) => {
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
            //console.log('Successfully retrieved basket information:', res);

            result(null, res);
        }
    });
};


Basket.getCustomerBasketItems = (basketid, result) => {
    dbConn.query('SELECT customer_id, product, quantity, product_price FROM erpapi.tblbasketinfo_items WHERE basket_id = ?', [basketid], (err, res) => {
        if (err) {
            console.error('Error while getting customers basket items:', err);
            result(err, null);
        } else {
            console.log('Successfully retrieved the customers basket items:', res);
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

Basket.getProductDetails = (product, result) => {
    dbConn.query(`SELECT inv.item_code, COALESCE(NULLIF(inv.description_1, ''), inv.description_2) AS description, mst.selling_incl_1, mst.special_price_incl FROM erpapi.tblinventory inv JOIN erpapi.tblmultistoretrn mst ON inv.item_code = mst.item_code WHERE COALESCE(NULLIF(inv.description_1, ''), inv.description_2) = ?`, [product], (err, res) => {
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

Basket.saveClientsTransaction = (basketid, customerid, product, quantity, sellingPrice, newDiscountedPrice, totalamount, newTotalDiscBasketAmount, purchasedate, result) => {
    dbConn.query('INSERT INTO erpapi.tblcompletetransaction(basket_id, customer_id, purchased_product, quantity, product_amount, product_discounted_amount, total_basket_amount, total_disc_basket_amount, purchase_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [basketid, customerid, product, quantity, sellingPrice, newDiscountedPrice, totalamount, newTotalDiscBasketAmount, purchasedate], (err, res) => {
        if (err) {
            console.log('Error while checking the product specials for the purchased item' + err);
            result(null, err);
        } else {
            console.log('Successfully retrieved the special using the basket infomation', res);
            result(null, res);
        }
    });
}

event.emit('get-customer-basket', 2)


module.exports = Basket;

