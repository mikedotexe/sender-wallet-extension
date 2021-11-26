import React, { useEffect, useState, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import closeIcon from '../../assets/img/drawer_close.png';

import NearService from '../../core/near';
import { fixedNearAmount, fixedNumber, parseNearAmount } from '../../utils';
import { setTransferConfirmDrawer } from '../../reducers/temp';
import { APP_ACCOUNT_TRANSFER } from '../../actions/app';

const TransferConfirmDrawer = () => {
  const dispatch = useDispatch();

  const marketStore = useSelector((state) => state.market);
  const appStore = useSelector((state) => state.app);
  const tempStore = useSelector((state) => state.temp);

  const [loading, setLoading] = useState(false);
  const [estimatedFees, setEstimatedFees] = useState(0);
  const [estimatedFeesPrice, setEstimatedFeesPrice] = useState(0);
  const [estimatedTotalFees, setEstimatedTotalFees] = useState(0);
  const [estimatedTotalFeesPrice, setEstimatedTotalFeesPrice] = useState(0);

  const { prices } = marketStore;
  const { currentRpc } = appStore;
  const { accountId, network } = appStore.currentAccount;
  const { display, selectToken, sendAmount, receiver } = tempStore.transferConfirmDrawer;

  const nearService = useMemo(() => {
    return new NearService({ config: currentRpc[network] });
  }, [currentRpc, network])

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

  useEffect(() => {
    setLoading(false);
  }, [display])

  const handleClose = () => {
    dispatch(setTransferConfirmDrawer({ display: false }));
  }

  const handleConfirm = () => {
    setLoading(true);
    dispatch({ type: APP_ACCOUNT_TRANSFER, receiverId: receiver, amount: sendAmount, token: selectToken });
  }

  return (
    <BottomDrawer
      open={display}
      onClose={handleClose}
    >
      <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
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
          disabled={loading}
          sx={{
            backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
            '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
          }}
          onClick={() => {
            setLoading(true);
            handleConfirm();
          }}
        >
          <Typography sx={{ fontSize: '16px', color: '#202046' }}>{loading ? 'Sending...' : 'Confirm'}</Typography>
        </Button>

        <Button sx={{ width: '325px', height: '48px' }} onClick={handleClose}>
          <Typography sx={{ fontSize: '14px', color: '#777777' }}>Cancel</Typography>
        </Button>
      </Box>
    </BottomDrawer>
  )
}

export default TransferConfirmDrawer;