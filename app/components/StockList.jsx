import React from "react";
import Stock from "./Stock.jsx";

class StockList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { input: "" };
        this.handleInput = this.handleInput.bind(this);
        this.submitInput = this.submitInput.bind(this);
    }

    handleInput(e) {
        this.setState({ input: e.target.value });
    }

    submitInput(e) {
        e.preventDefault();
        this.props.onAdd(this.state.input);
        this.setState({ input: "" });
    }

    render() {
        // Make this an array of <Stock />
        var stocks = this.props.data.map(function(stock, index) {
            return <Stock key={index} data={stock} onRemove={this.props.onRemove}/>
        }.bind(this));

        return (
            <div id="stock-list">
                <form onSubmit={this.submitInput}>
                    <input type="text" placeholder="Enter stock code..." value={this.state.input} onChange={this.handleInput}></input>
                    <button type="submit" id="Add" className="btn btn-success">Add</button>
                </form>
                {stocks}
            </div>
        );
    }
}

module.exports = StockList;
