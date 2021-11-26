import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';

import styled from 'styled-components';
import _ from 'lodash';

import BaseBox from '../../components/BaseBox';
import BaseHeaderPage from '../../components/BaseHeaderPage';
import Input from '../../components/Input';
import backIcon from '../../assets/img/back.png';
import { APP_ADD_CUSTOM_RPC } from '../../actions/app';
import NetworkResultDrawer from '../../components/BottomDrawer/NetworkResultDrawer';

const WrapperBasePage = styled(BaseHeaderPage)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  .network-title {
    width: 325px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 25px;
  }

  .button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    width: 325px;
    height: 69px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
  }
`

const AddNetwork = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const loadingStore = useSelector((state) => state.loading);
  const [name, setName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [network, setNetwork] = useState('mainnet');

  const { customRpcLoading } = loadingStore;

  const backClicked = () => {
    history.goBack();
  }

  const nameOnChanged = (e) => {
    setName(e.target.value);
  }

  const rpcUrlOnChanged = (e) => {
    setRpcUrl(e.target.value);
  }

  const networkOnChanged = (e) => {
    const changedNetwork = e.target.value;
    setNetwork(changedNetwork);
  }

  const saveClicked = () => {
    dispatch({ type: APP_ADD_CUSTOM_RPC, network, nodeUrl: rpcUrl, name });
  }

  return (
    <WrapperBasePage>
      <Dialog
        open={customRpcLoading}
        PaperProps={{
          sx: { '&.MuiDialog-paper': { boxShadow: 'none', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0)' } },
        }}
      >
        <CircularProgress></CircularProgress>
      </Dialog>

      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16p x', color: '#777777' }}>Add Custom Network</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Box sx={{ width: '325px', padding: '24px', paddingLeft: '10px', paddingRight: '10px', boxSizing: 'border-box', backgroundColor: 'rgba(250, 209, 101, 0.05)', borderRadius: '12px', marginTop: '10px' }}>
          <Typography align='center' sx={{ color: '#FAD165', fontSize: '14px', lineHeight: '16px' }}>A malicious network provider can lie about the state of the blockchain and record your network activity. Only add custom networks you trust.</Typography>
        </Box>
        <Typography sx={{ width: '325px', fontSize: '16px', color: 'white', marginTop: '25px' }}>Network Name</Typography>
        <BaseBox>
          <Input value={name} onChange={nameOnChanged}></Input>
        </BaseBox>

        <Typography sx={{ width: '325px', fontSize: '16px', color: 'white', marginTop: '25px' }}>RPC URL</Typography>
        <BaseBox>
          <Input value={rpcUrl} onChange={rpcUrlOnChanged}></Input>
        </BaseBox>

        <Box sx={{ width: '325px', marginTop: '25px' }}>
          <FormLabel component="legend" sx={{ color: 'white' }}>Network</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            defaultValue={network}
            name="row-radio-buttons-group"
            onChange={networkOnChanged}
          >
            <FormControlLabel sx={{ color: 'white' }} value="mainnet" control={<Radio sx={{ color: '#777777' }} />} label="Mainnet" />
            <FormControlLabel sx={{ color: 'white' }} value="testnet" control={<Radio sx={{ color: '#777777' }} />} label="Testnet" />
          </RadioGroup>
        </Box>

        <Button
          sx={{
            width: '325px', height: '48px', backgroundColor: '#333333', borderRadius: '12px', marginTop: '10px',
            '&.MuiButton-root:hover': { backgroundColor: '#4B4B4B' }
          }}
          onClick={saveClicked}
        >
          <Typography sx={{ color: 'white', fontSize: '16px' }}>
            Save
          </Typography>
        </Button>

        <Button
          sx={{
            width: '325px', height: '48px',
          }}
          onClick={backClicked}
        >
          <Typography sx={{ color: '#777777', fontSize: '14px' }}>
            Cancel
          </Typography>
        </Button>
      </Box>

      <NetworkResultDrawer />
    </WrapperBasePage>
  )
}

export default AddNetwork;
