const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
    origin: '*',
    credentials: true,           
    optionSuccessStatus: 200
}

//.ENV
require('dotenv').config({ path: './configuration.env' });

// Instantiate an Express application
const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// setup the server port
const port = process.env.SERVERPORT;

const UserRoutes = require('./src/routes/user.route')
app.use('/user', UserRoutes);

const BasketRoutes = require('./src/routes/basket.route')
app.use('/basket', BasketRoutes);

// listen to the port
app.listen(port, () => {
    console.log(`Express is running at port ${port}`);
});