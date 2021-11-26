import React, { useState, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import _ from 'lodash';

import menu from '../../assets/img/menu.png';
import MenuDrawer from '../MenuDrawer';
import { changeRpc } from '../../reducers/app';
import networkIcon from '../../assets/img/network.png';
import maskIcon from '../../assets/img/mask.png';
import maskSelectIcon from '../../assets/img/mask-select.png';

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
    padding: 5px;
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
    marginTop: '12px',
    background: 'linear-gradient(180deg, #363636 0%, #272727 100%)',
    border: '1px solid #090909',
    '& .MuiMenuItem-root': {
      marginLeft: '10px',
      marginRight: '10px',
      padding: 0,
      width: '230px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '0px',
    },
    'ul li p:hover': {
      color: '#FFCE3E',
    }
  },
}));

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const appStore = useSelector((state) => state.app);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [networkAnchorEl, setNetworkAnchorEl] = useState(null);

  const { currentAccount, currentRpc, rpcs } = appStore;
  const { network } = currentAccount;

  const rpc = useMemo(() => {
    return currentRpc[network];
  }, [network, currentRpc])

  const filterRpcs = useMemo(() => {
    return _.filter(rpcs, item => item.network === network);
  }, [network, rpcs])

  const displayMore = useMemo(() => {
    return !_.isEmpty(filterRpcs);
  }, [filterRpcs])

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

  const handleAddNetworkClicked = () => {
    history.push('/settings/addNetwork');
  }

  return (
    <StyledHeader>
      <AppBar position="fixed">
        <Toolbar className="toolbar">
          <Button className="menu-button" onClick={() => setDrawerOpen(true)}>
            <img src={menu} alt="menu"></img>
          </Button>
          <Button className="network-btn" onClick={handleNetworkClicked} disabled={!displayMore}>
            <img style={{ marginRight: '10px', width: '15px', height: '12px' }} src={networkIcon} alt="network"></img>
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
            {
              displayMore && (<img style={{ marginLeft: '10px', width: '10px', height: '6px' }} src={maskIcon} alt="mask"></img>)
            }
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
            <Box sx={{ maxHeight: '90px', overflow: 'auto' }}>
              {
                _.map(filterRpcs, (item) => {
                  const { name, index } = item;
                  const canSelect = index !== rpc.index;
                  const selectStyle = canSelect ? { color: 'white', fontSize: '12px', lineHeight: '16px', fontWeight: 'bold' } : { color: 'white', fontSize: '14px', lineHeight: '20px', fontWeight: 'bold' };
                  return (
                    <MenuItem sx={{ marginTop: '5px' }} key={index} onClick={() => changeNetwork(index)}>
                      <Typography align="center" sx={{
                        ...selectStyle,
                        maxWidth: '200px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>{name}</Typography>
                      {
                        !canSelect && (
                          <img style={{ width: '16px', height: '12px' }} src={maskSelectIcon} alt="mask-select"></img>
                        )
                      }
                    </MenuItem>
                  )
                })
              }
            </Box>
            <Divider sx={{ width: '100%', height: '1px', borderRadius: '2px', marginTop: '10px', boxSizing: 'border-box', border: '1px solid #4A4A4A' }}></Divider>
            <Button
              onClick={handleAddNetworkClicked}
              sx={{
                width: '100%',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
              }}><Typography sx={{ color: 'white', '&:hover': { color: '#FFCE3E' } }}>+ Add Custom Network</Typography></Button>
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
