import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import List from '../../components/List';
import ButtonGroup from '../../components/ButtonGroup';

import styled from 'styled-components';

const WrapperBasePage = styled(BasePage)`
  .list {
    background: #FFFFFF;
    box-shadow: 0px 0px 20px rgba(30, 30, 30, 0.06);
    border-radius: 40px 40px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .submit-button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 30px;
    width: 325px;
    height: 48px;
  }

  .validator {
    height: 68px;
    border-bottom: 1px;
    border-color: #F3F3F3;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px inset #F3F3F3;
  }
`

const validators = [
  {
    accountId: 'stakin.poolv1.near',
    fee: '0',
    active: true,
    amount: '0.01001',
  },
  {
    accountId: '01node.poolv1.near',
    fee: '0',
    active: true,
    amount: '0.01001',
  },
  {
    accountId: '122222node.poolv1.near',
    fee: '0',
    active: false,
    amount: '0.01001',
  },
];

const Validator = ({ data: validator }) => {
  return (
    <Box className="validator">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '14px', color: '#25272A' }}>{validator.accountId}</Typography>
        <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{validator.amount} NEAR</Typography>
      </Box>
      <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
        <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{validator.fee}%</Typography>
        <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
        <Typography sx={{ fontSize: '14px', color: validator.active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{validator.active ? 'active' : 'inactive'}</Typography>
      </Box>
    </Box>
  )
}

const Staking = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <WrapperBasePage>
      <Box sx={{ marginLeft: '25px', marginRight: '25px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>Amount</Typography>
        <BaseBox>
          <Input type="text" placeholder=''></Input>
        </BaseBox>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <Typography sx={{ fontSize: '12px', color: '#777777' }}>Available balance</Typography>
          <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>0.1209 NEAR</Typography>
        </Box>

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '15px' }}>Stake with</Typography>
        <BaseBox sx={{ paddingTop: '8px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '8px' }}>
          <Button sx={{ width: '100%', justifyContent: 'end' }}>
            <Typography sx={{ fontSize: '16px', color: '#FAD165' }}>Select</Typography>
          </Button>
        </BaseBox>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button className="submit-button">
            <Typography sx={{ fontSize: '16px', color: 'white' }}>Submit Stake</Typography>
          </Button>
        </Box>
      </Box>

      <Box className='list'>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>
        <Box sx={{ marginTop: '11px', width: '315px', alignSelf: 'center', marginBottom: '9px' }}>
          <ButtonGroup buttons={['My Staking', 'Current validators']} value={tabValue} onChange={setTabValue}></ButtonGroup>
        </Box>
        {
          tabValue ? (
            <List sx={{ width: '100%', paddingLeft: '18px', paddingRight: '18px', boxSizing: 'border-box' }} list={validators} Component={Validator}></List>
          ) : (
            <Box sx={{ width: '100%', paddingLeft: '18px', paddingRight: '18px', boxSizing: 'border-box' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Staked</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>0.01 NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ $0.07 USD</Typography>
                  </Box>
                </Box>

                <Button sx={{ borderRadius: '13px', border: "1px solid #588912", width: '75px', height: '30px' }}><Typography sx={{ fontSize: '14px', color: '#588912' }}>Unstake</Typography></Button>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Rewards earned</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>0.00003 NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ $0.01 USD</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Pending release</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>0 NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ $0 USD</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px', marginBottom: '20px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Available for withdrawal</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>0 NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ $0 USD</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        }

      </Box>
    </WrapperBasePage>
  )
}

export default Staking;
