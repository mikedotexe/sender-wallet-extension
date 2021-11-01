import React, { useState, useMemo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import _ from 'lodash';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import BottomDrawer from '../../components/BottomDrawer';
import backIcon from '../../assets/img/back.png';
import arrowIcon from '../../assets/img/arrow.png';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';
import closeIcon from '../../assets/img/drawer_close.png';
import { fixedNearAmount, fixedTokenAmount, fixedNumber, parseNearAmount } from '../../utils';
import { nearService } from '../../core/near';
import { APP_ACCOUNT_TRANSFER } from '../../actions/app';
import { usePrevious } from '../../hooks';
import nearIcon from '../../assets/img/NEAR.png';

const WrapperBasePage = styled(BasePage)`
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
  const loadingStore = useSelector((state) => state.loading);
  const marketStore = useSelector((state) => state.market);
  const [confirmDrawerOpen, setConfirmDrawerOpen] = useState(false);
  const [resultDrawerOpen, setResultDrawerOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAmountPrice, setSendAmountPrice] = useState(0);
  const [receiver, setReceiver] = useState('');
  const [estimatedFees, setEstimatedFees] = useState(0);
  const [estimatedFeesPrice, setEstimatedFeesPrice] = useState(0);
  const [estimatedTotalFees, setEstimatedTotalFees] = useState(0);
  const [estimatedTotalFeesPrice, setEstimatedTotalFeesPrice] = useState(0);

  const { prices } = marketStore;
  const { tokens, accountId } = appStore.currentAccount;
  const { sendLoading, sendError } = loadingStore;

  const preSendLoading = usePrevious(sendLoading);

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

  useEffect(() => {
    const getEstimatedTotalFees = async () => {
      const fees = await nearService.getEstimatedTotalFees({ accountId, contractId: selectToken.accountId });
      const nearFees = fixedNearAmount(fees);
      setEstimatedFees(nearFees);
      const nearFeesPrice = fixedNumber(Number(nearFees) * prices['NEAR'], 4);
      setEstimatedFeesPrice(nearFeesPrice);
    }
    getEstimatedTotalFees();
  }, [selectToken, accountId])

  useEffect(() => {
    const getEstimatedTotalNearAmount = async () => {
      let nearTotalFees;
      if (selectToken.symbol === 'NEAR') {
        const fees = await nearService.getEstimatedTotalNearAmount({ amount: parseNearAmount(sendAmount) });
        nearTotalFees = fixedNearAmount(fees);
        setEstimatedTotalFees(nearTotalFees);
      } else {
        nearTotalFees = estimatedFees;
        setEstimatedTotalFees(nearTotalFees);
      }

      const nearTotalFeesPrice = fixedNumber(Number(nearTotalFees) * prices['NEAR'], 4);
      setEstimatedTotalFeesPrice(nearTotalFeesPrice);
    }
    getEstimatedTotalNearAmount();
  }, [estimatedFees, sendAmount, selectToken])

  useEffect(() => {
    if (preSendLoading && !sendLoading) {
      setConfirmDrawerOpen(false);

      // Show result drawer
      setTimeout(() => {
        setResultDrawerOpen(true);
      }, 1000)
    }
  }, [sendLoading])

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

  const handleCloseDrawer = () => {
    setConfirmDrawerOpen(false);
    setResultDrawerOpen(false);
  }

  const sendClicked = () => {
    setConfirmDrawerOpen(true);
  }

  const confirmClicked = () => {
    dispatch({ type: APP_ACCOUNT_TRANSFER, receiverId: receiver, amount: sendAmount, token: selectToken });
  }

  const useMaxClicked = () => {
    setSendAmount(selectToken.balance);
  }

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
              <Avatar src={selectToken.icon || nearIcon} alt={selectToken.name}></Avatar>
              <Typography sx={{ fontSize: '14px', color: 'white', marginLeft: '10px', lineHeight: '24px', fontWeight: 'bold' }}>{selectToken.symbol}</Typography>
            </Box>
            <img src={arrowIcon} alt='arrow'></img>
          </Button>
        </BaseBox>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button disabled={!sendAmount && !receiver} className="send-button" onClick={sendClicked}>
          <Typography sx={{ fontSize: '16px', color: 'white' }}>Send</Typography>
        </Button>
      </Box>

      <BottomDrawer
        open={confirmDrawerOpen}
        onClose={() => setConfirmDrawerOpen(false)}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleCloseDrawer}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          <Typography sx={{ fontSize: '14px', color: '#202046', marginTop: '16px' }}>You are sending</Typography>

          <Typography sx={{ fontSize: '28px', color: '#202046', marginTop: '10px' }}>{sendAmount} {selectToken.symbol}</Typography>
          <Typography sx={{ fontSize: '14px', color: '#5E5E5E' }}>≈ ${sendAmountPrice} USD</Typography>

          <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

          <Typography sx={{ fontSize: '16px', color: '#202046', marginTop: '11px' }}>To</Typography>
          <Typography sx={{ fontSize: '16px', color: '#588912', marginTop: '8px' }}>{receiver}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '21px', width: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '25px' }}>Estimated fees</Typography>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginRight: '25px' }}>{`< ${estimatedFees} NEAR`}</Typography>
          </Box>
          <Typography sx={{ alignSelf: 'self-end', fontSize: '12px', color: '#5E5E5E', marginRight: '25px' }}>{`< $${estimatedFeesPrice} USD`}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '21px', width: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '25px' }}>Estimated total</Typography>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginRight: '25px' }}>{`< ${estimatedTotalFees} NEAR`}</Typography>
          </Box>
          <Typography sx={{ alignSelf: 'self-end', fontSize: '12px', color: '#5E5E5E', marginRight: '25px' }}>{`< $${estimatedTotalFeesPrice} USD`}</Typography>

          <Button
            disabled={sendLoading}
            sx={{
              backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
              '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
            }}
            onClick={confirmClicked}
          >
            <Typography sx={{ fontSize: '16px', color: '#202046' }}>{sendLoading ? 'Sending...' : 'Confirm'}</Typography>
          </Button>

          <Button sx={{ width: '325px', height: '48px' }} onClick={() => setConfirmDrawerOpen(false)}>
            <Typography sx={{ fontSize: '14px', color: '#777777' }}>Cancel</Typography>
          </Button>
        </Box>
      </BottomDrawer>

      <BottomDrawer
        open={resultDrawerOpen}
        onClose={() => setResultDrawerOpen(false)}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleCloseDrawer}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          {
            !sendError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                <img src={successIcon} alt="success"></img>
                <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Transfer successful!</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                <img src={failIcon} alt="fail" style={{ width: '42px', height: '42px' }}></img>
                <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Transfer failed!</Typography>
              </Box>
            )
          }

          {
            !sendError ? (
              <Typography sx={{ fontSize: '38px', color: '#202046', marginTop: '16px', lineHeight: '34px' }}>${sendAmountPrice}</Typography>
            ) : (
              <Typography sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Sorry, {sendError}</Typography>
            )
          }

          <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '21px', width: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '25px' }}>Amount</Typography>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginRight: '25px' }}>{`${sendAmount} ${selectToken.symbol}`}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '21px', width: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '25px' }}>To</Typography>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginRight: '25px' }}>{receiver}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '21px', width: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '25px' }}>Estimated fees</Typography>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginRight: '25px' }}>{`< ${estimatedFees} NEAR`}</Typography>
          </Box>
          <Typography sx={{ alignSelf: 'self-end', fontSize: '12px', color: '#5E5E5E', marginRight: '25px' }}>{`< $${estimatedFeesPrice} USD`}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '21px', width: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '25px' }}>Estimated total</Typography>
            <Typography sx={{ fontSize: '16px', color: '#202046', marginRight: '25px' }}>{`< ${estimatedTotalFees} NEAR`}</Typography>
          </Box>
          <Typography sx={{ alignSelf: 'self-end', fontSize: '12px', color: '#5E5E5E', marginRight: '25px' }}>{`< $${estimatedTotalFeesPrice} USD`}</Typography>

          <Button
            sx={{
              backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '18px', height: '48px', marginBottom: '37px',
              '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
            }}
            onClick={() => {
              if (!sendError) {
                history.push('/home');
              }
              handleCloseDrawer();
            }}
          >
            <Typography sx={{ fontSize: '16px', color: '#202046' }}>{!sendError ? 'Rerturn' : 'Try Again'}</Typography>
          </Button>
        </Box>
      </BottomDrawer>
    </WrapperBasePage >
  )
}

export default Send;
