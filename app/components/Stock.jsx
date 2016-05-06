import React from "react";

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.removeStock = this.removeStock.bind(this);
    }

    removeStock() {
        this.props.onRemove(this.props.data.stock_code);
    }

    render() {
        return (
            <div id="stock">
                <h3>{this.props.data.stock_code}</h3>
                <p>{this.props.data.stock_description}</p>
                <button className="btn btn-danger" onClick={this.removeStock}>Remove</button>
            </div>
        );
    }
}

module.exports = Stock;
