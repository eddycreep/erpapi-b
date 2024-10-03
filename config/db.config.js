const mysql = require('mysql2');
require('dotenv').config({ path: './configuration.env' });

const MAX_RETRIES = 5;
let retries = 0;

const dbConn = mysql.createConnection({
    host: process.env.HOSTDEV,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

function connectWithRetry() {
    dbConn.connect(function (error) {
        if (error) {
            console.error('Error connecting: ' + error.stack);
            retries += 1;
            if (retries < MAX_RETRIES) {
                console.log(`Retrying connection (${retries}/${MAX_RETRIES})...`);
                setTimeout(connectWithRetry, 2000); // Wait 2 seconds before retrying
            } else {
                console.error('Max retries reached. Exiting process.');
                process.exit(1);
            }
        } else {
            console.log('DB connected successfully');
        }
    });
}

connectWithRetry();

module.exports = dbConn;