import React, { Component } from "react";

import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import Locations from "../containers/Locations";
import Products from "../containers/Products.js";
import Employees from "../containers/Employees.js";
import Namings from "../containers/Namings.js";
import Types from "../containers/Types.js";

class TableRoutes extends Component {
  render() {
    const { history } = this.props;

    return (
      <div>
        <Switch>
          <Route history={history} path="/products" component={Products} />
          <Route history={history} path="/locations" component={Locations} />
          <Route history={history} path="/namings" component={Namings} />
          <Route history={history} path="/employees" component={Employees} />
          <Route history={history} path="/types" component={Types} />
          <Redirect from="/" to="/products" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(TableRoutes);
