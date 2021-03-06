import React, { Component } from "react";

import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import Location from "../containers/Locations";
import NamingTable from "./NamingTable.js";
import ProductsTable from "./ProductsTable.js";
import EmployeesTable from "./EmployeesTable.js";
import DecimalNumbersTable from "./DecimalNumbersTable.js";
import NotesTable from "./NotesTable.js";
import Types from "../containers/Types.js";

class TableRoutes extends Component {
  render() {
    const { history } = this.props;

    return (
      <div>
        <Switch>
          <Route history={history} path="/products" component={ProductsTable} />
          <Route history={history} path="/locations" component={Location} />
          <Route history={history} path="/namings" component={NamingTable} />
          <Route
            history={history}
            path="/employees"
            component={EmployeesTable}
          />
          <Route
            history={history}
            path="/decimalNumbers"
            component={DecimalNumbersTable}
          />
          <Route history={history} path="/notes" component={NotesTable} />
          <Route history={history} path="/types" component={Types} />
          <Redirect from="/" to="/products" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(TableRoutes);
