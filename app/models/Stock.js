'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Stock = new Schema({
    stock_code: String,
    stock_description: String,
    stock_data: []                // {date: stock value}
});

module.exports = mongoose.model("Stock", Stock);
