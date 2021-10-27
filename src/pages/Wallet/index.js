import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import BN from 'bn.js';
import _ from 'lodash';

import List from '../../components/List';
import Token from '../../components/Token';
import Transaction from '../../components/Transaction';
import ButtonGroup from '../../components/ButtonGroup';

import visibleIcon from '../../assets/img/visible.png';
import walletBalanceIcon from '../../assets/img/wallet-balance.png';
import arrowupIcon from '../../assets/img/arrow-up.png';
import arrowdownIcon from '../../assets/img/arrow-down.png';
import { APP_UPDATE_ACCOUNT } from '../../actions/app';
import { fixedNearAmount, fixedNumber, fixedTokenAmount } from '../../utils';

const WrappedBox = styled(Box)`
  .wallet-balance {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }

  .arrow-up {
    width: 15px;
    height: 15px;
    margin-left: 6px;
  }

  .MuiAccordionSummary-root {
    margin-top: 6px;
    background-color: rgb(29, 29, 29);
  }

  .list {
    background: #FFFFFF;
    box-shadow: 0px 0px 20px rgba(30, 30, 30, 0.06);
    border-radius: 40px 40px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 250px;
  }

  .action-button {
    width: 144px;
    height: 48px;
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    color: white;
    font-size: 16px;
  }
`

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Wallet = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const marketStore = useSelector((state) => state.market);
  const [expanded, setExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0)

  const { prices } = marketStore;

  const currentAccount = useMemo(() => {
    return appStore.currentAccount;
  }, [appStore.currentAccount])

  const totalStaking = useMemo(() => {
    const staking = new BN(currentAccount.totalUnclaimed).add(new BN(currentAccount.totalPending)).add(new BN(currentAccount.totalStaked)).add(new BN(currentAccount.totalAvailable));
    return staking.toString();
  }, [currentAccount.totalUnclaimed, currentAccount.totalPending, currentAccount.totalStaked])

  const walletBalance = useMemo(() => {
    const value = new BN(totalStaking).add(new BN(currentAccount.balance.total));
    return value.toString();
  }, [totalStaking, currentAccount.balance.total])

  const tokens = useMemo(() => {
    return _.map(currentAccount.tokens, (item) => {
      return {
        ...item,
        price: prices[item.symbol],
        balance: item.symbol === 'NEAR' ? fixedNearAmount(item.balance) : fixedTokenAmount(item.balance, item.decimals),
      }
    })
  }, [currentAccount.tokens, currentAccount.balance.available, prices])

  const total = useMemo(() => {
    let value = 0;
    _.forEach(tokens, (token) => {
      value = value + (token.price ? (Number(token.price) * Number(token.balance)) : 0);
    })

    return fixedNumber(value, 4);
  }, [tokens])

  useEffect(() => {
    console.log('update account');
    dispatch({ type: APP_UPDATE_ACCOUNT });
  }, [])

  const receiveClicked = () => {
    history.push(`/receive/${currentAccount.accountId}`);
  }

  const sendClicked = () => {
    history.push('/send');
  }

  return (
    <WrappedBox>
      <Box sx={{ display: 'flex', flexDirection: 'row', padding: '16px', alignItems: 'center' }}>
        <Typography color="#9CA2AA">Amount</Typography>
        <Button>
          {/* <img src={visibleIcon} alt="visible"></img> */}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '42px' }} color="white">${total}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '33px' }}>
        <Button className="action-button" onClick={receiveClicked}>Receive</Button>
        <Button className="action-button" onClick={sendClicked}>Send</Button>
      </Box>

      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary
          aria-controls="panel1bh-content"
          id="panel1bh-`header`"
        >
          <Box sx={{ display: 'flex', paddingLeft: '13px', paddingRight: '14px', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <img className='wallet-balance' src={walletBalanceIcon} alt="wallet-balance"></img>
              <Typography sx={{ fontSize: '14px' }} color="white">Wallet Balance</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">{fixedNearAmount(walletBalance)} NEAR</Typography>

              {expanded ? <img className="arrow-up" src={arrowdownIcon} alt="arrow-up"></img> : <img className="arrow-up" src={arrowupIcon} alt="arrow-up"></img>}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: 'rgb(29, 29, 29)' }}>
          <Box sx={{ height: '24px', display: 'flex', paddingLeft: '37px', paddingRight: '35px', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">Available balance</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">{fixedNearAmount(currentAccount.balance.available)} NEAR</Typography>
            </Box>
          </Box>

          <Box sx={{ height: '24px', display: 'flex', paddingLeft: '37px', paddingRight: '35px', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">Staking</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">{fixedNearAmount(totalStaking)} NEAR</Typography>
            </Box>
          </Box>

          <Box sx={{ height: '24px', display: 'flex', paddingLeft: '37px', paddingRight: '35px', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">Others</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px' }} color="white">{fixedNearAmount(currentAccount.balance.stateStaked)} NEAR</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box className='list'>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>
        <Box sx={{ marginTop: '11px', width: '315px', alignSelf: 'center', marginBottom: '9px' }}>
          <ButtonGroup buttons={['Token List', 'Account activity']} value={tabValue} onChange={setTabValue}></ButtonGroup>
        </Box>

        {
          tabValue ? (
            <>
              <List sx={{ width: '100%' }} list={currentAccount.transactions} Component={Transaction}></List>
              <Button sx={{ marginTop: '20px', marginBottom: '80px', backgroundColor: '#FFCE3E', width: '100px', borderRadius: '20px' }} onClick={() => window.open(`https://explorer.mainnet.near.org/accounts/${currentAccount.accountId}`)}>
                <Typography sx={{ fontSize: '14px' }} color="black">Get All</Typography>
              </Button>
            </>
          ) : (
            <List sx={{ width: '100%', marginBottom: '60px' }} list={tokens} Component={Token}></List>
          )
        }
      </Box>
    </WrappedBox>
  )
}

export default Wallet;
