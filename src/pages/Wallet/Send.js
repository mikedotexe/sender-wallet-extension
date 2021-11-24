import React, { useState, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import TransferResultDrawer from '../../components/BottomDrawer/TransferResultDrawer';
import backIcon from '../../assets/img/back.png';
import arrowIcon from '../../assets/img/arrow.png';
import { fixedNearAmount, fixedTokenAmount, fixedNumber } from '../../utils';
import nearIcon from '../../assets/img/NEAR.png';
import wnearIcon from '../../assets/img/wNEAR.png';
import { setTransferConfirmDrawer, setTwoFaDrawer } from '../../reducers/temp';
import TransferConfirmDrawer from '../../components/BottomDrawer/TransferConfirmDrawer';
import TwoFaDrawer from '../../components/BottomDrawer/TwoFaDrawer';

const WrapperBasePage = styled(BaseHeaderPage)`
  .amount-input {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 48px;
  }

  .max-button {
    background: rgba(255, 213, 104, 0.17);
    mix-blend-mode: normal;
    border-radius: 8.5px;
    height: 17px;
    margin-top: 11px;
  }

  .accountId-input {
    width: 100%;
  }

  .send-button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 30px;
    width: 325px;
    height: 48px;
  }
`

const Send = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const tempStore = useSelector((state) => state.temp);
  const appStore = useSelector((state) => state.app);
  const marketStore = useSelector((state) => state.market);

  const [sendAmount, setSendAmount] = useState('');
  const [sendAmountPrice, setSendAmountPrice] = useState(0);
  const [receiver, setReceiver] = useState('');
  const [code, setCode] = useState('');

  const { prices } = marketStore;
  const { tokens } = appStore.currentAccount;

  const selectToken = useMemo(() => {
    let t;
    _.forEach(tokens, (token) => {
      if (token.symbol === tempStore.selectToken) {
        t = { ...token }
      }
    })
    if (t.symbol === 'NEAR') {
      t.balance = fixedNearAmount(t.balance);
    } else {
      t.balance = fixedTokenAmount(t.balance, t.decimals);
    }
    t.price = fixedNumber(Number(prices[t.symbol]) * Number(t.balance), 4);
    return t;
  }, [tempStore.selectToken, tokens, prices])

  const backClicked = () => {
    history.goBack();
  }

  const sendAmountChanged = (e) => {
    const amount = e.target.value;
    setSendAmount(amount);

    const price = prices[selectToken.symbol] ? fixedNumber((Number(amount) * prices[selectToken.symbol]), 4) : 0;
    setSendAmountPrice(price);
  }

  const receiverChanged = (e) => {
    setReceiver(e.target.value);
  }

  const selectTokensClicked = () => {
    history.push('/tokens');
  }

  const sendClicked = () => {
    dispatch(setTransferConfirmDrawer({ display: true, sendAmount, selectToken, receiver }));
  }

  const useMaxClicked = () => {
    setSendAmount(selectToken.balance);
  }

  const icon = useMemo(() => {
    return selectToken.icon ? selectToken.icon : (selectToken.symbol === 'wNEAR' ? wnearIcon : nearIcon);
  }, [selectToken])

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Send</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Input type="number" className='amount-input' placeholder='0' value={sendAmount} onChange={sendAmountChanged}></Input>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>${sendAmountPrice}</Typography>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Available to Send</Typography>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>{selectToken.balance} {selectToken.symbol} ≈ ${selectToken.price} USD</Typography>

        <Button onClick={useMaxClicked} className="max-button"><Typography sx={{ fontSize: '12px', color: '#FAD165' }}>Use Max</Typography></Button>
      </Box>

      <Box sx={{ marginTop: '23px', marginLeft: '25px', marginRight: '25px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>Send to</Typography>

        <BaseBox>
          <Input type="text" className='accountId-input' placeholder='Account ID' value={receiver} onChange={receiverChanged}></Input>
        </BaseBox>

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '15px' }}>Select Assets</Typography>

        <BaseBox sx={{ paddingTop: '8px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '8px' }}>
          <Button sx={{ width: '100%', justifyContent: 'space-between' }} onClick={selectTokensClicked}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={icon} alt={selectToken.name}></Avatar>
              <Typography sx={{ fontSize: '14px', color: 'white', marginLeft: '10px', lineHeight: '24px', fontWeight: 'bold' }}>{selectToken.symbol}</Typography>
            </Box>
            <img src={arrowIcon} alt='arrow'></img>
          </Button>
        </BaseBox>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button disabled={!sendAmount || !receiver} className="send-button" onClick={sendClicked}>
          <Typography sx={{ fontSize: '16px', color: 'white' }}>Send</Typography>
        </Button>
      </Box>

      <TransferConfirmDrawer />
      <TransferResultDrawer />
      <TwoFaDrawer />

    </WrapperBasePage >
  )
}

export default Send;
