import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import _ from 'lodash';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import List from '../../components/List';
import backIcon from '../../assets/img/back.png';
import searchIcon from '../../assets/img/search.png';
import { setSelectUnstakeValidator, setSelectValidator } from '../../reducers/temp';
import { fixedNearAmount } from '../../utils';

const WrapperBasePage = styled(BasePage)`
  .search-input {
    flex: 1;
    margin-left: 11px;
  }
`

const ValidatorItem = ({ data: validator }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Box key={validator.accountId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: '25px', paddingRight: '25px', height: '60px', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography sx={{ width: '230px', fontSize: '14px', color: 'white', lineHeight: '24px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{validator.accountId}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: '#FAD165', fontWeight: 'bold' }}>{validator.fee.percentage}%Fee</Typography>
          <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
          <Typography sx={{ fontSize: '14px', color: '#777777', fontWeight: 'bold' }}>{validator.active ? 'active' : 'inactive'}</Typography>
        </Box>
      </Box>

      <Button
        sx={{ backgroundColor: '#343434', border: '1px solid #4D4D4D', boxSizing: 'border-box', borderRadius: '13px' }}
        onClick={() => {
          dispatch(setSelectValidator(validator));
          history.goBack();
        }}
      >
        <Typography sx={{ fontSize: '14px', color: '#777777', lineHeight: '10px' }}>Select</Typography>
      </Button>
    </Box>
  )
}

const UnstakeValidatorItem = ({ data: validator }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: '25px', paddingRight: '25px', height: '75px', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography sx={{ width: '230px', fontSize: '14px', color: 'white', lineHeight: '24px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{validator.accountId}</Typography>
        <Typography sx={{ fontSize: '14px', color: '#FAD165', fontWeight: 'bold' }}>{fixedNearAmount(validator.staked)} NEAR</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: '#777777', fontWeight: 'bold' }}>{validator.fee.percentage}%Fee</Typography>
          <Typography sx={{ fontSize: '14px', color: '#777777', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
          <Typography sx={{ fontSize: '14px', color: '#777777', fontWeight: 'bold' }}>{validator.active ? 'active' : 'inactive'}</Typography>
        </Box>
      </Box>

      <Button
        onClick={() => {
          dispatch(setSelectUnstakeValidator(validator));
          history.push('/staking/unstake');
        }}
        sx={{ backgroundColor: '#343434', border: '1px solid #4D4D4D', boxSizing: 'border-box', borderRadius: '13px' }}
      >
        <Typography sx={{ fontSize: '14px', color: '#777777', lineHeight: '10px' }}>Select</Typography>
      </Button>
    </Box>
  )
}

const Validators = () => {
  const history = useHistory();
  const appStore = useSelector((state) => state.app);
  const [validators, setValidators] = useState([]);
  const [search, setSearch] = useState('');

  let { isUnstake } = useParams();
  isUnstake = isUnstake === 'true';

  useEffect(() => {
    let list;
    if (isUnstake) {
      list = _.filter(appStore.currentAccount.validators, (validator) => Number(validator.staked) !== 0);
    } else {
      list = appStore.currentAccount.validators;
    }

    setValidators(list);
  }, [appStore.currentAccount.validators])

  const searchChanged = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setValidators(appStore.currentAccount.validators)
    } else {
      const list = _.filter(appStore.currentAccount.validators, (validator) => _.includes(validator.accountId, value));
      setValidators(list);
    }
  }

  const backClicked = () => {
    history.goBack();
  }

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Select a Validator</Typography>
      </Box>

      {
        isUnstake && (
          <Typography sx={{ fontSize: '14px', color: '#777777', marginTop: '15px' }} align='center'>Select the validator pool from which you wish to unstake your tokens</Typography>
        )
      }

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '25px', flexDirection: 'column' }}>
        {
          !isUnstake && (
            <BaseBox sx={{ justifyContent: 'start' }}>
              <img src={searchIcon} alt="search"></img>
              <Input className='search-input' placeholder='Validator account ID' value={search} onChange={searchChanged}></Input>
            </BaseBox>
          )
        }

        <List list={validators} Component={isUnstake ? UnstakeValidatorItem : ValidatorItem} sx={{ width: '100%', marginTop: '15px', marginBottom: '15px' }}>
        </List>
      </Box>
    </WrapperBasePage>
  )
}

export default Validators;
