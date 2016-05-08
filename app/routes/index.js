var Stock = require("../models/Stock.js");
var request = require("request");
var path = process.cwd();

module.exports = function(app) {
    app.route("/")
        .get(function(req, res) {
            res.sendFile(path + '/client/index.html');
        });

    app.route("/api/add/:code")
        .post(function(req, res) {
            // Get start and end date
            var date = new Date();
            var day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var month = date.getMonth() - 6;
            var month2 = date.getMonth() + 1;
            var year = date.getFullYear();
            var year2 = year;
            if (month <= 0) {
                month = 12 + month;
                year -= 1;
            }
            if (month < 10) {
                month = "0" + month;
            }
            if (month2 < 10) {
                month2 = "0" + month2;
            }
            var start_date = day + "-" + month + "-" + year;
            var end_date = day + "-" + month2 + "-" + year2;

            // Create URL and perform API call to Quandl.
            var url = "https://www.quandl.com/api/v3/datasets/WIKI/" + req.params.code + ".json?api_key=" + process.env.API_KEY + "&start_date=" + start_date +
                        "&end_date=" + end_date + "&column_index=4";

            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // if bad data, res.json("invalid stock")
                    // else, create object with just the .dataset_code and .name parameters
                    if (data) {
                        var stock = { stock_code: data.dataset.dataset_code, stock_description: data.dataset.name, stock_data: data.dataset.data };
                        // Save in database
                        Stock.findOne({ stock_code: stock.stock_code}, function(err, stock_result) {
                            if (err) { throw err; }
                            if (stock_result) {
                                console.log("Existing stock found!");
                                res.json("existing stock");
                            }
                            else {
                                var newStock = new Stock();
                                newStock.stock_code = stock.stock_code;
                                newStock.stock_description = stock.stock_description;
                                newStock.stock_data = stock.stock_data;
                                newStock.save(function(err) {
                                    if (err) { throw err; }
                                    console.log("Stock successfully added.");
                                    res.json(stock);
                                });
                            }
                        });

                    }
                    else {
                        alert("Invalid stock code.");
                    }
            }
        });
    });

    app.route("/api/remove/:code")
        .post(function(req, res) {
            Stock.findOneAndRemove({ stock_code: req.params.code }, function(err, stock) {
                if (err) { throw err; }
                console.log("Stock successfully removed.");
                res.json(stock);
            });
        });

    app.route("/api/get/stocks")
        .get(function(req, res) {
            Stock.find({}, function(err, stocks) {
                if (err) { throw err; }
                res.send(stocks);
            });
        });
}
