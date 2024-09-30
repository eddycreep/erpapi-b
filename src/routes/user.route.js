const express = require('express');
const router = express.Router();
var dbConn = require('../../config/db.config');

const UserController = require('../controllers/user.controller');

require('dotenv').config({ path: './configuration.env' });

router.post('/insertauditlog', UserController.InsertAuditLog);

router.post('/login', (req, res) => {
  console.log(req.body)
  dbConn.query(
    `SELECT * FROM erpapi.user WHERE username = ${dbConn.escape(req.body.username)} and password = ${dbConn.escape(req.body.password)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        console.log(err);
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        console.log(result);
        return res.status(401).send({
          msg: 'Username or password is incorrect!, No user found!'
        });
      }

      if (result.length) {
        return res.status(200).send({
          msg: 'Success, Logged in!',
          emp_id: result[0].emp_id,
          emp_name: result[0].emp_name,
          emp_surname: result[0].emp_surname,
          id_no: result[0].id_no,
          role: result[0].role 
        });
      }

      return res.status(401).send({
        msg: 'Username or password is incorrect!'
      });
    }
  );
});
module.exports = router;
