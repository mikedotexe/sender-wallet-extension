import React, { useEffect, useState, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';
import closeIcon from '../../assets/img/drawer_close.png';

import { nearService } from '../../core/near';
import { fixedNearAmount, fixedNumber, parseNearAmount } from '../../utils';
import { setTransferResultDrawer } from '../../reducers/temp';

const TransferResultDrawer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const marketStore = useSelector((state) => state.market);
  const appStore = useSelector((state) => state.app);
  const tempStore = useSelector((state) => state.temp);

  const [estimatedFees, setEstimatedFees] = useState(0);
  const [estimatedFeesPrice, setEstimatedFeesPrice] = useState(0);
  const [estimatedTotalFees, setEstimatedTotalFees] = useState(0);
  const [estimatedTotalFeesPrice, setEstimatedTotalFeesPrice] = useState(0);

  const { prices } = marketStore;
  const { accountId } = appStore.currentAccount;
  const { display, selectToken, sendAmount, receiver, error } = tempStore.transferResultDrawer;

  const sendAmountPrice = useMemo(() => {
    const price = prices[selectToken.symbol] ? fixedNumber((Number(sendAmount) * prices[selectToken.symbol]), 4) : 0;
    return price;
  }, [sendAmount, prices])

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

  const handleClose = () => {
    dispatch(setTransferResultDrawer({ display: false }));
  }

  return (
    <BottomDrawer
      open={display}
      onClose={handleClose}
    >
      <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

        {
          !error ? (
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
          !error ? (
            <Typography sx={{ fontSize: '38px', color: '#202046', marginTop: '16px', lineHeight: '34px' }}>${sendAmountPrice}</Typography>
          ) : (
            <Typography sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Sorry, {error}</Typography>
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
            if (!error) {
              history.push('/home');
            }
            handleClose();
          }}
        >
          <Typography sx={{ fontSize: '16px', color: '#202046' }}>{!error ? 'Rerturn' : 'Try Again'}</Typography>
        </Button>
      </Box>
    </BottomDrawer>
  )
}

export default TransferResultDrawer;