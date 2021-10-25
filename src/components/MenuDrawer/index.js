import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiDrawer from '@material-ui/core/Drawer';
import styled from 'styled-components';
import _ from 'lodash';

import closeIcon from '../../assets/img/close_fill.png';
import selectedIcon from '../../assets/img/selected.png';
import lockIcon from '../../assets/img/lock.png';
import { changeAccount } from '../../reducers/app';

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

      <Box sx={{ marginTop: '57px', marginLeft: '18px', marginRight: '14px' }}>
        <Typography sx={{ color: '#878787', fontSize: '14px' }}>My Wallet</Typography>

        <Box sx={{ marginTop: '15px', marginBottom: '15px', height: '340px', flexDirection: 'column', display: 'flex', overflow: 'auto' }}>
          {
            _.map(accounts, (item, index) => {
              return (
                <Button
                  key={item.accountId}
                  endIcon={currentAccount.accountId === item.accountId ? <img src={selectedIcon} alt="selected"></img> : null}
                  sx={{ justifyContent: 'space-between' }}
                  onClick={() => {
                    onClose();
                    dispatch(changeAccount(item));
                  }}
                >
                  <Typography sx={{ color: '#878787', fontSize: '14px' }}>{item.accountId}</Typography>
                </Button>
              )
            })
          }
        </Box>

        <Button className="button" onClick={() => history.push('/import')}>
          <Typography sx={{ color: '#878787', fontSize: '14px' }}>Import Account</Typography>
        </Button>

        <Button className="button" sx={{ marginTop: '7px' }} onClick={() => window.open('https://wallet.near.org/create')}>
          <Typography sx={{ color: '#878787', fontSize: '14px' }}>Create New Accont</Typography>
        </Button>

        <Button sx={{ marginTop: '10px', width: '248px', height: '25px' }} startIcon={<img src={lockIcon} alt="lock"></img>}>
          <Typography sx={{ color: '#878787', fontSize: '14px' }}>Lock Wallet</Typography>
        </Button>
      </Box>
    </WrapperDrawer>
  )
}

export default MenuDrawer;
