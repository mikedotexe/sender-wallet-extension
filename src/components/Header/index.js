import React, { useState, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import styled from 'styled-components';
import _ from 'lodash';

import menu from '../../assets/img/menu.png';
import MenuDrawer from '../MenuDrawer';
import { changeRpc } from '../../reducers/app';

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

  .network-btn {
    align-self: center;
    border: 1px solid #090909;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(219, 219, 219, 0.5);
    border-radius: 12px;
    width: 250px;
    padding: 5px 40px;
  }
`;

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'black',
    borderRadius: '12px',
    '& .MuiMenuItem-root': {
      margin: '10px',
      width: '230px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
    },
    '& .MuiMenuItem-root:hover': {
      backgroundColor: '#222222',
    }
  },
}));

const Header = () => {
  const dispatch = useDispatch();

  const appStore = useSelector((state) => state.app);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [networkAnchorEl, setNetworkAnchorEl] = useState(null);

  const { currentAccount, currentRpc, rpcs } = appStore;
  const { network } = currentAccount;

  const rpc = useMemo(() => {
    return currentRpc[network];
  }, [network, currentRpc])

  const filterRpcs = useMemo(() => {
    return _.filter(rpcs, item => item.network === network && item.index !== rpc.index);
  }, [network, rpcs, rpc])

  const handleNetworkClose = () => {
    setNetworkAnchorEl(null);
  };

  const handleNetworkClicked = (event) => {
    setNetworkAnchorEl(event.currentTarget);
  };

  const changeNetwork = (index) => {
    setNetworkAnchorEl(null);

    dispatch(changeRpc({ index, network }));
  }

  return (
    <StyledHeader>
      <AppBar position="fixed">
        <Toolbar className="toolbar">
          <Button className="menu-button" onClick={() => setDrawerOpen(true)}>
            <img src={menu} alt="menu"></img>
          </Button>
          <Button className="network-btn" onClick={handleNetworkClicked}>
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: 'white',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {rpc.name}
            </Typography>
          </Button>

          <StyledMenu
            id="basic-menu"
            anchorEl={networkAnchorEl}
            open={!!networkAnchorEl}
            onClose={handleNetworkClose}
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
          >
            {
              _.map(filterRpcs, rpc => {
                const { name, index } = rpc;
                return (
                  <MenuItem key={index} onClick={() => changeNetwork(index)}>
                    <Typography align="center" sx={{ color: 'white' }}>{name}</Typography>
                  </MenuItem>
                )
              })
            }
          </StyledMenu>
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
