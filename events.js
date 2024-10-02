const Pizzashop = require('./event-handler')
const EventEmitter = require('node:events')

const pizzashop = new Pizzashop();

pizzashop.order();
pizzashop.showOrder();


