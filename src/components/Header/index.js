import React, { useState, useMemo } from 'react';

import { useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import menu from '../../assets/img/menu.png';
import MenuDrawer from '../MenuDrawer';

const StyledHeader = styled(Box)`
  .toolbar {
    height: 60px;
    background-color: #222222;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menu-button {
    position: absolute;
    left: 0px;
    padding-left: 16px;
    width: 39px;
    height: 39px;

    img {
      filter: invert(50%) sepia(0%) saturate(1369%) hue-rotate(142deg) brightness(94%) contrast(100%);
      width: 13px;
      height: 12px;
    }
  }

  .account {
    align-self: center;
    border: 1px solid #090909;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(219, 219, 219, 0.5);
    border-radius: 12px;
    max-width: 250px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 5px 40px;
    text-align: center;
  }
`;

const Header = () => {
  const appStore = useSelector((state) => state.app);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentAccount = useMemo(() => {
    return appStore.currentAccount;
  }, [appStore.currentAccount])

  return (
    <StyledHeader>
      <AppBar position="fixed">
        <Toolbar className="toolbar">
          <Button className="menu-button" onClick={() => setDrawerOpen(true)}>
            <img src={menu} alt="menu"></img>
          </Button>
          <Typography className="account" variant="h6" component="p">
            {currentAccount.accountId}
          </Typography>
        </Toolbar>
      </AppBar>

      <MenuDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </StyledHeader>
  )
}

export default Header;
