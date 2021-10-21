import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Receive from './pages/Wallet/Receive';

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/home' component={Home}></Route>
        <Route exact path='/receive' component={Receive}></Route>
      </Switch>
    </HashRouter>
  )
}

export default Router;
