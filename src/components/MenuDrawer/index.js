import React, { useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiDrawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import _ from 'lodash';

import closeIcon from '../../assets/img/close_fill.png';
import selectedIcon from '../../assets/img/selected.png';
import lockIcon from '../../assets/img/lock.png';
import { changeAccount, setLockup } from '../../reducers/app';
import { APP_UPDATE_ACCOUNT } from '../../actions/app';
import { setBottomTabValue } from '../../reducers/temp';

const WrapperDrawer = styled(MuiDrawer)`
  .button {
    width: 248px;
    height: 48px;
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
  }
`

const MenuDrawer = ({ open, onClose }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const { accounts, currentAccount } = appStore;

  const lockupClicked = () => {
    dispatch(setLockup(true));
    history.push('/unlock');
  }

  const mainnetAccounts = useMemo(() => {
    return _.filter(accounts, (account) => account.network === 'mainnet');
  }, [accounts])

  const testnetAccounts = useMemo(() => {
    return _.filter(accounts, (account) => account.network === 'testnet');
  }, [accounts])

  return (
    <WrapperDrawer
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '284px', backgroundColor: '#262626' },
      }}
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Button sx={{ position: 'absolute', top: '21px', right: '13px' }} onClick={onClose}><img src={closeIcon} alt="close"></img></Button>

      <Box sx={{ marginTop: '40px', marginLeft: '18px', marginRight: '14px', height: '400px' }}>
        <Typography sx={{ color: '#878787', fontSize: '20px' }}>My Wallets</Typography>

        <Divider sx={{ width: '100%', height: '1px', borderColor: 'rgba(255, 255, 255, 0.5)', marginTop: '10px', boxSizing: 'border-box' }}></Divider>
        <Typography sx={{ color: '#878787', fontSize: '14px', marginTop: '10px', marginLeft: '10px' }}>Mainnet:</Typography>
        <Box sx={{ marginTop: '5px', marginLeft: '15px', marginBottom: '15px', flexDirection: 'column', display: 'flex', height: '150px', overflow: 'auto' }}>
          {
            _.map(mainnetAccounts, (item, index) => {
              return (
                <Button
                  key={item.accountId}
                  endIcon={currentAccount.accountId === item.accountId ? <img src={selectedIcon} alt="selected"></img> : null}
                  sx={{ justifyContent: 'space-between' }}
                  onClick={() => {
                    onClose();
                    dispatch(changeAccount(item));
                    dispatch(setBottomTabValue(0));
                    history.push('/home');
                    setTimeout(() => {
                      dispatch({ type: APP_UPDATE_ACCOUNT })
                    }, 500);
                  }}
                >
                  <Typography sx={{ color: '#878787', fontSize: '14px' }}>{item.accountId}</Typography>
                </Button>
              )
            })
          }
        </Box>

        <Divider sx={{ width: '100%', height: '1px', borderColor: 'rgba(255, 255, 255, 0.5)', marginTop: '10px', boxSizing: 'border-box' }}></Divider>
        <Typography sx={{ color: '#878787', fontSize: '14px', marginTop: '10px', marginLeft: '10px' }}>Testnet:</Typography>
        <Box sx={{ marginTop: '5px', marginLeft: '15px', marginBottom: '15px', flexDirection: 'column', display: 'flex', height: '150px', overflow: 'auto' }}>
          {
            _.map(testnetAccounts, (item, index) => {
              return (
                <Button
                  key={item.accountId}
                  endIcon={currentAccount.accountId === item.accountId ? <img src={selectedIcon} alt="selected"></img> : null}
                  sx={{ justifyContent: 'space-between' }}
                  onClick={() => {
                    onClose();
                    dispatch(changeAccount(item));
                    dispatch(setBottomTabValue(0));
                    history.push('/home');
                    setTimeout(() => {
                      dispatch({ type: APP_UPDATE_ACCOUNT })
                    }, 500);
                  }}
                >
                  <Typography sx={{ color: '#878787', fontSize: '14px' }}>{item.accountId}</Typography>
                </Button>
              )
            })
          }
        </Box>
      </Box>
      <Box sx={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Button className="button" onClick={() => history.push('/import')}>
          <Typography sx={{ color: '#878787', fontSize: '14px' }}>Import Account</Typography>
        </Button>

        <Button className="button" sx={{ marginTop: '7px' }} onClick={() => window.open('https://wallet.near.org/create')}>
          <Typography sx={{ color: '#878787', fontSize: '14px' }}>Create New Account</Typography>
        </Button>

        <Button onClick={lockupClicked} sx={{ marginTop: '10px', width: '248px', height: '25px' }} startIcon={<img src={lockIcon} alt="lock"></img>}>
          <Typography sx={{ color: '#878787', fontSize: '14px' }}>Lock Wallet</Typography>
        </Button>
      </Box>
    </WrapperDrawer>
  )
}

export default MenuDrawer;
