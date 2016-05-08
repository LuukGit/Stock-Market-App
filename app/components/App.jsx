import React from "react";
import ReactDOM from "react-dom";
import ajax from "../common/ajax-functions.js";
import LineChart from "./LineChart.jsx";
import StockList from "./StockList.jsx";
var socket = io();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: undefined, response: false };
        this.addStock = this.addStock.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.localAddStock = this.localAddStock.bind(this);
        this.localRemoveStock = this.localRemoveStock.bind(this);
    }

    componentDidMount() {
        socket.on("add", this.localAddStock);
        socket.on("remove", this.localRemoveStock);
        // ajax request to get all stocks in database.
        ajax("GET", "api/get/stocks", "", function(data) {
            data = JSON.parse(data);
            this.setState({ data: data });
            this.setState({ response: true });
        }.bind(this));
    }

    localAddStock(stock) {
        var new_data = this.state.data;
        new_data.unshift(stock);
        this.setState({ data: new_data });
    }

    localRemoveStock(stock) {
        var new_data = this.state.data;
        for (var i = 0; i < new_data.length; i++) {
            if (new_data[i].stock_code == stock.stock_code) {
                new_data.splice(i, 1);
            }
        }
        this.setState({ data: new_data });
    }

    addStock(code) {
        ajax("POST", "/api/add/" + code, "", function(data) {
            data = JSON.parse(data);
            if (data == "invalid code") {
                alert("Invalid stock code.");
            }
            else if (data != "existing stock") {
                socket.emit("add", data);
                var new_data = this.state.data;
                new_data.push(data);
                this.setState({ data: new_data });
            }
        }.bind(this));
    }

    removeStock(code) {
        ajax("POST", "/api/remove/" + code, "", function(data) {
            data = JSON.parse(data);
            if (data) {
                socket.emit("remove", data);
                var new_data = this.state.data;
                for (var i = 0; i < new_data.length; i++) {
                    if (new_data[i].stock_code == code) {
                        new_data.splice(i, 1);
                    }
                }
                this.setState({ data: new_data });
            }
        }.bind(this));
    }

    render() {
        if (this.state.response) {
            return (
                <div id="content" className="container">
                    <LineChart data={this.state.data} />
                    <StockList data={this.state.data} onAdd={this.addStock} onRemove={this.removeStock} />
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }
}

ReactDOM.render((<App />), document.getElementById("app"));
