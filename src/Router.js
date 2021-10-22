import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Receive from './pages/Wallet/Receive';
import Send from './pages/Wallet/Send';
import Tokens from './pages/Wallet/Tokens';
import Validators from './pages/Staking/Validators';

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/home' component={Home}></Route>
        <Route exact path='/receive' component={Receive}></Route>
        <Route exact path='/send' component={Send}></Route>
        <Route exact path='/tokens' component={Tokens}></Route>
        <Route exact path='/staking/validators' component={Validators}></Route>
      </Switch>
    </HashRouter>
  )
}

export default Router;
