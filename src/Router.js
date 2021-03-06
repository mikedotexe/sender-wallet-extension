import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Loading from './pages/Home/Loading';
import Startup from './pages/Startup';
import Unlock from './pages/Startup/Unlock';
import Import from './pages/Startup/Import';
import SetPwd from './pages/Startup/SetPwd';
import Home from './pages/Home';
import Receive from './pages/Wallet/Receive';
import Send from './pages/Wallet/Send';
import Tokens from './pages/Wallet/Tokens';
import Validators from './pages/Staking/Validators';
import Unstake from './pages/Staking/Unstake';
import ChangePwd from './pages/Settings/ChangePwd';
import Network from './pages/Settings/Network';
import AddNetwork from './pages/Settings/AddNetwork';
import EditNetwork from './pages/Settings/EditNetwork';

import Signin from './pages/Notification/Signin';
import SignAndSendTransaction from './pages/Notification/SignAndSendTransaction';
import TransactionDetails from './pages/Notification/TransactionDetails';

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Loading}></Route>
        <Route exact path='/unlock' component={Unlock}></Route>
        <Route exact path='/import' component={Import}></Route>
        <Route exact path='/setpwd' component={SetPwd}></Route>
        <Route exact path='/startup' component={Startup}></Route>
        <Route exact path='/home' component={Home}></Route>
        <Route exact path='/receive/:accountId' component={Receive}></Route>
        <Route exact path='/send' component={Send}></Route>
        <Route exact path='/tokens' component={Tokens}></Route>
        <Route exact path='/staking/validators/:isUnstake' component={Validators}></Route>
        <Route exact path='/staking/unstake' component={Unstake}></Route>
        <Route exact path='/settings/changepwd' component={ChangePwd}></Route>
        <Route exact path='/settings/network' component={Network}></Route>
        <Route exact path='/settings/addNetwork' component={AddNetwork}></Route>
        <Route exact path='/settings/editNetwork:index' component={EditNetwork}></Route>
        <Route exact path='/notification/signin' component={Signin}></Route>
        <Route exact path='/notification/signAndSendTransaction' component={SignAndSendTransaction}></Route>
        <Route exact path='/notification/transactionDetails' component={TransactionDetails}></Route>
      </Switch>
    </HashRouter>
  )
}

export default Router;
