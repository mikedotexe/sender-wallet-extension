import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import QRcode from 'qrcode.react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BasePage from '../../components/BasePage';
import backIcon from '../../assets/img/back.png';
import copyIcon from '../../assets/img/copy.png';

const WrapperBasePage = styled(BasePage)`
  .copy-view {
    width: 325px;
    background: #1E1E1E;
    border: 1px solid #090909;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(219, 219, 219, 0.5);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    margin-top: 53px;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
  }
`

const Receive = () => {
  const history = useHistory();
  const [copied, setCopied] = useState(false);

  const backClicked = () => {
    history.goBack();
  }

  const copyClicked = () => {
    setCopied(true);
  }


  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Receive</Typography>
      </Box>
      <Box sx={{ marginTop: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Box sx={{ width: '176px', height: '170px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <QRcode value="123" size={148}></QRcode>
        </Box>

        <Box className="copy-view">
          <Typography sx={{ fontSize: '16px', color: '#777777' }}>jzheng.near</Typography>

          <CopyToClipboard
            text="123"
            onCopy={copyClicked}
          >
            {copied ? <Typography sx={{ color: '#FAD165' }}>Copied!</Typography> : <Button sx={{ padding: 0, color: '#FAD165' }} startIcon={<img src={copyIcon} alt="copy"></img>}>Copy</Button>}
          </CopyToClipboard>

        </Box>
      </Box>
    </WrapperBasePage>
  )
}

export default Receive;
