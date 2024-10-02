const mysql = require('mysql2/promise');  // Import MySQL with promises
require('dotenv').config({ path: './configuration.env' });  // Load environment variables from .env

// Create a connection pool for better performance
const dbConn = mysql.createPool({
    host: process.env.HOSTDEV,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Retry logic with exponential backoff
let retries = 0;
const maxRetries = 5;  // Max number of retries
const retryDelay = 1000;  // Initial delay of 1 second

const connectWithRetry = async () => {
    try {
        const connection = await dbConn.getConnection();  // Attempt to get a connection
        console.log('DB connected successfully');  // Log success
        connection.release();  // Release connection back to pool
        retries = 0;  // Reset retries on success
    } catch (error) {
        retries++;  // Increment retry count
        console.error(`Connection attempt ${retries} failed:`, error.message);
        
        if (retries <= maxRetries) {
            const delay = retryDelay * Math.pow(2, retries - 1);  // Exponential backoff delay
            console.log(`Retrying in ${delay / 1000} seconds...`);
            setTimeout(connectWithRetry, delay);  // Retry after delay
        } else {
            console.error(`Max retries reached (${maxRetries}). Could not connect to the database.`);
        }
    }
};

// Initiate the connection with retries
connectWithRetry();

module.exports = dbConn;  // Export the connection pool for usage elsewhere