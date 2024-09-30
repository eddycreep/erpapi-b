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

exports.getCustomerSpecials = (req, res) => {
  BasketModel.getCustomerSpecials(req, (err, basket) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    //res.status(200).json
    res.send(basket);
  });
};

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