import React, { useState, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

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
import { APP_REMOVE_CUSTOM_RPC, APP_UPDATE_CUSTOM_RPC } from '../../actions/app';
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

const EditNetwork = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const appStore = useSelector((state) => state.app);
  const loadingStore = useSelector((state) => state.loading);
  const { index } = useParams();

  const [name, setName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [network, setNetwork] = useState('mainnet');

  const { rpcs } = appStore;
  const { customRpcLoading } = loadingStore;

  const networkItem = useMemo(() => {
    return _.find(rpcs, item => item.index === index);
  }, [rpcs, index]);

  useEffect(() => {
    if (!_.isEmpty(networkItem)) {
      setName(networkItem.name);
      setRpcUrl(networkItem.nodeUrl);
      setNetwork(networkItem.network);
    }
  }, [networkItem])

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

  const removeClicked = () => {
    dispatch({ type: APP_REMOVE_CUSTOM_RPC, index });
  }

  const saveClicked = () => {
    dispatch({ type: APP_UPDATE_CUSTOM_RPC, index, network, name, nodeUrl: rpcUrl });
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

        <Typography sx={{ fontSize: '16p x', color: '#777777' }}>Network</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
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
            name="row-radio-buttons-group"
            onChange={networkOnChanged}
            value={network}
          >
            <FormControlLabel sx={{ color: 'white' }} value="mainnet" control={<Radio sx={{ color: '#777777' }} />} label="Mainnet" />
            <FormControlLabel sx={{ color: 'white' }} value="testnet" control={<Radio sx={{ color: '#777777' }} />} label="Testnet" />
          </RadioGroup>
        </Box>

        <Box sx={{ width: '325px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '50px' }}>
          <Button
            sx={{
              width: '153px', height: '48px', backgroundColor: '#D83637', borderRadius: '12px',
              '&.MuiButton-root:hover': { backgroundColor: '#F04142' }
            }}
            onClick={removeClicked}
          >
            <Typography sx={{ color: 'white', fontSize: '16px' }}>
              Remove
            </Typography>
          </Button>
          <Button
            sx={{
              width: '153px', height: '48px', backgroundColor: '#333333', borderRadius: '12px',
              '&.MuiButton-root:hover': { backgroundColor: '#4B4B4B' }
            }}
            onClick={saveClicked}
          >
            <Typography sx={{ color: 'white', fontSize: '16px' }}>
              Save
            </Typography>
          </Button>
        </Box>
      </Box>

      <NetworkResultDrawer />
    </WrapperBasePage>
  )
}

export default EditNetwork;
