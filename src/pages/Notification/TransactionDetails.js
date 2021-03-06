import React, { useState, useEffect, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';
import queryString from 'query-string';
import _ from 'lodash';
import BN from 'bn.js';

import backIcon from '../../assets/img/back.png';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { fixedNumber } from '../../utils';
import { FT_TRANSFER_GAS } from '../../core/near';

const WrapperBasePage = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
`

const TransactionDetails = () => {
  const location = useLocation();
  const history = useHistory();
  const marketStore = useSelector((state) => state.market);
  const [params, setParams] = useState({});

  useEffect(() => {
    const data = queryString.parse(location.search);
    const { notificationId } = data;
    const key = `notification-request-${notificationId}`;
    chrome.storage.local.get([key], function (result) {
      setParams(result[key]);
    })

    document.title = "Transaction Details";
  }, [])

  const gas = useMemo(() => {
    let gas = new BN(0);
    const { transactions } = params;
    _.forEach(transactions, (transaction) => {
      const { actions } = transaction;
      _.forEach(actions, (action) => {
        gas = action.gas ? gas.add(new BN(action.gas)) : gas.add(new BN(FT_TRANSFER_GAS));
      })
    })
    return gas.toString();
  }, [params])

  const gasPrice = useMemo(() => {
    if (!marketStore || !marketStore.prices['NEAR']) {
      return null;
    }
    const nearAmount = formatNearAmount(gas);
    return fixedNumber(Number(nearAmount) * marketStore.prices['NEAR'], 4);
  }, [gas, marketStore])

  const backButtonClicked = () => {
    history.goBack();
  }

  return (
    <WrapperBasePage>
      <Button sx={{ position: 'absolute', left: '20px', top: '40px', padding: 0 }} onClick={backButtonClicked}>
        <img src={backIcon} alt="back"></img>
        <Typography sx={{ color: '#777777', fontSize: '16px', lineHeight: '22px', marginLeft: '20px' }}>Back</Typography>
      </Button>

      <Typography align="left" sx={{ marginTop: '75px', color: 'white', fontSize: '16px', lineHeight: '22px' }}>Transaction Details</Typography>

      <div style={{ border: '1px solid #353535', width: '335px', height: 0, marginTop: '10px' }}></div>

      {
        _.map(params.transactions, (transaction) => {
          const { receiverId, actions } = transaction;
          return (
            <>
              <Box sx={{ display: 'flex', marginTop: '18px' }}>
                <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '22px' }}>
                  For Contract:
                </Typography>
                <Typography sx={{ color: '#FFCE3E', marginLeft: '11px' }}>{receiverId}</Typography>
              </Box>

              <Box sx={{ marginTop: '10px', marginLeft: '10px' }}>
                {
                  _.map(actions, (action) => {
                    const { methodName, args } = action;
                    return (
                      <Box key={methodName}>
                        <Typography sx={{ fontSize: '14px', color: 'white' }}>Calling function: {methodName}</Typography>
                        {
                          _.isEmpty(args) ? (
                            <Box sx={{ marginTop: '10px', marginLeft: '5px' }}>
                              <Typography sx={{ fontSize: '14px', color: '#777777' }}>{`Arguments: {}`}</Typography>
                            </Box>
                          ) : (
                            <Box sx={{ marginTop: '10px', marginLeft: '5px' }}>
                              <Typography sx={{ fontSize: '14px', color: '#777777' }}>{`Arguments: {`}</Typography>
                              {
                                _.map(_.keys(args), (key) => {
                                  const value = args[key];
                                  return (
                                    <Typography key={key} sx={{ fontSize: '14px', color: '#777777', marginLeft: '20px' }}>{`"${key}": "${value}",`}</Typography>
                                  )
                                })
                              }
                              <Typography sx={{ fontSize: '14px', color: '#777777' }}>{`}`}</Typography>
                            </Box>
                          )
                        }
                      </Box>
                    )
                  })
                }
              </Box>
            </>
          )
        })
      }

      <div style={{ border: '1px solid #353535', width: '335px', height: 0, marginTop: '20px' }}></div>

      <Typography align="left" sx={{ marginTop: '25px', color: 'white', fontSize: '16px', lineHeight: '22px' }}>Transaction Fees</Typography>
      <Typography align="left" sx={{ marginLeft: '10px', marginTop: '10px', color: 'white', fontSize: '14px', lineHeight: '20px' }}>Gas Limit:{gas || '0'}</Typography>
      <Typography align="left" sx={{ marginLeft: '10px', marginTop: '5px', color: 'white', fontSize: '14px', lineHeight: '20px' }}>{gasPrice ? `Gas price estimate: $${gasPrice}` : 'Gas price estimate is unabailable'}</Typography>
    </WrapperBasePage>
  )
}

export default TransactionDetails;
