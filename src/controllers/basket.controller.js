const BasketModel = require('../models/basket.model');

exports.getCustomerBasket = (req, res) => {
  // Pass the `req` object to access `req.params.basket_id` in the model
  BasketModel.getCustomerBasket(req, (err, basket) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    //res.status(200).json
    res.send(basket);
  });
};

exports.getCustomerBasketItems = (req, res) => {
  BasketModel.getCustomerBasketItems (req, (err, basket) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.send(basket);
  });
};

// exports.checkLoyaltyCustomer = (req, res) => {
//   BasketModel.checkLoyaltyCustomer(req, (err, customer) => {
//     if (err) {
//       res.status(500).json({ error: err });
//       return;
//     }
//     res.send(customer);
//   });
// };
exports.checkLoyaltyCustomer = (req, res) => {
  BasketModel.checkLoyaltyCustomer(req, (err, customer) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }

    if (!customer || customer.length === 0) {
      console.log("No customer found, exiting the process");
      res.status(404).json({ message: "Customer not found" });
      process.exit(1) // Exit the process if no customer is found
    } else {
      res.send(customer);
    }
  });
};


exports.getProductDetails = (req, res) => {
  BasketModel.getProductDetails(req, (err, customer) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.send(customer);
  });
};

exports.getProductSpecials = (req, res) => {
  // Pass the `req` object to access `req.params.basket_id` in the model
  BasketModel.getProductSpecials(req, (err, basket) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    //res.status(200).json
    res.send(basket);
  });
};

exports.sendDiscountedProducts = (req, res) => {
  BasketModel.sendDiscountedProducts(req, (err, client) => {
    if (err) {
      client.message = "Failed";
      res.send(err);
      process.exit(1);
    }
    client.message = "Success";
    res.send(client);
  })
}

exports.saveClientsTransaction = (req, res) => {
  BasketModel.saveClientsTransaction(req, (err, client) => {
    if (err) {
      client.message = "Failed";
      res.send(err);
      process.exit(1);
    }
    client.message = "Success";
    res.send(client);
  })
}