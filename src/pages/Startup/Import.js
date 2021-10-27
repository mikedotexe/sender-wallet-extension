import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';

import StartupHeader from '../../components/StartupHeader';
import BottomDrawer from '../../components/BottomDrawer';
import backIcon from '../../assets/img/back.png';
import pasteIcon from '../../assets/img/paste.png';
import closeIcon from '../../assets/img/drawer_close.png';
import failIcon from '../../assets/img/fail.png';
import { APP_IMPORT_ACCOUNT } from '../../actions/app';
import { initStatus } from '../../reducers/loading';
import { checkPhrass } from '../../utils';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  textarea {
    width: 100%;
    height: 146px;
    margin-top: 8px;
    background: #1E1E1E;
    border: 1px solid #090909;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(219, 219, 219, 0.5);
    border-radius: 12px;
    padding: 10px;
    color: white;
  }
`

const Startup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const loadingStore = useSelector(state => state.loading);
  const [open, setOpen] = useState(false);
  const [mnemonic, setMnemonic] = useState('');

  const { importLoading, importError } = loadingStore;

  const backClicked = () => {
    history.goBack();
  }

  const mnemonicChanged = (event) => {
    const text = event.target.value;
    setMnemonic(text);
  }

  const pasteClicked = (event) => {
  }

  const continueClicked = () => {
    if (checkPhrass(mnemonic)) {
      dispatch({ type: APP_IMPORT_ACCOUNT, mnemonic });
    } else {
      setOpen(true);
    }
  }

  const closeDrawer = () => {
    setOpen(false);
    setTimeout(() => {
      dispatch(initStatus());
    }, 500)
  }

  useEffect(() => {
    if (importError) {
      setOpen(true);
    }
  }, [importError])

  return (
    <WrapperBox>
      <StartupHeader />

      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Import wallet</Typography>
      </Box>

      <Typography sx={{ fontSize: '14px', color: '#777777', marginTop: '15px', marginLeft: '35px', marginRight: '35px' }} align='center'>Enter the backup passphrase associated with the account</Typography>

      <Box sx={{ marginLeft: '30px', marginRight: '30px', position: 'relative' }}>
        <Typography sx={{ fontSize: '14px', color: 'white', marginTop: '15px' }} align='left'>Passphrase ( 12 words )</Typography>

        <textarea onChange={mnemonicChanged}></textarea>

        {/* <Button sx={{ position: 'absolute', bottom: '15px', right: '15px', width: '15px', height: '15px', minWidth: '15px' }} onClick={pasteClicked}><img src={pasteIcon} alt='paste'></img></Button> */}
      </Box>


      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }}>
        <Button disabled={importLoading || !mnemonic} sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }} onClick={continueClicked}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>{importLoading ? 'Importing...' : 'Continue'}</Typography>
        </Button>
      </Box>

      <BottomDrawer
        open={open}
        onClose={closeDrawer}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={closeDrawer}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
            <img src={failIcon} alt="fail" style={{ width: '42px', height: '42px' }}></img>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Failed!</Typography>
          </Box>

          {
            importError ? (
              <Typography align='center' sx={{ fontSize: '14px', color: '#5E5E5E', marginTop: '27px', lineHeight: '16px', marginLeft: '38px', marginRight: '38px' }}>Error: {importError}</Typography>
            ) : (
              <>
                <Typography align='center' sx={{ fontSize: '14px', color: '#5E5E5E', marginTop: '27px', lineHeight: '16px', marginLeft: '38px', marginRight: '38px' }}>Error: Cannot find matching public key</Typography>
                <Typography align='center' sx={{ fontSize: '14px', color: '#5E5E5E', marginTop: '8px', lineHeight: '16px', marginBottom: '37px', marginLeft: '38px', marginRight: '38px' }}>No accounts were found for this passphrase.</Typography>
              </>
            )
          }

          <Button
            sx={{
              backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '18px', height: '48px', marginBottom: '37px',
              '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
            }}
            onClick={closeDrawer}
          >
            <Typography sx={{ fontSize: '16px', color: '#202046' }}>{'Try Again'}</Typography>
          </Button>
        </Box>
      </BottomDrawer>
    </WrapperBox>
  )
}

export default Startup;
