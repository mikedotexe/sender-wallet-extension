import React, { useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import styled from 'styled-components';
import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import List from '../../components/List';
import backIcon from '../../assets/img/back.png';
import searchIcon from '../../assets/img/search.png';
import selectedIcon from '../../assets/img/selected.png';
import { setSelectToken } from '../../reducers/temp';
import nearIcon from '../../assets/img/NEAR.png';
import wnearIcon from '../../assets/img/wNEAR.png';

const WrapperBasePage = styled(BaseHeaderPage)`
  .search-input {
    flex: 1;
    margin-left: 11px;
  }
`

const TokenItem = ({ data }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const icon = data.icon ? data.icon : (data.symbol === 'wNEAR' ? wnearIcon : nearIcon);

  return (
    <Button
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: '25px', paddingRight: '25px', height: '60px' }}
      onClick={() => {
        dispatch(setSelectToken(data.symbol));
        history.goBack();
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={icon} alt={data.name}></Avatar>
        <Typography sx={{ fontSize: '14px', color: 'white', marginLeft: '10px', lineHeight: '24px' }}>{data.symbol}</Typography>
      </Box>

      {data.isSelected && <img src={selectedIcon} alt="selected"></img>}
    </Button>
  )
}

const Tokens = () => {
  const history = useHistory();
  const appStore = useSelector((state) => state.app);
  const tempStore = useSelector((state) => state.temp);

  const tokens = useMemo(() => {
    return _.map(appStore.currentAccount.tokens, (token) => {
      if (token.symbol === tempStore.selectToken) {
        return { ...token, isSelected: true };
      }
      return token;
    })
  }, [appStore.currentAccount.tokens, tempStore.selectToken])

  const backClicked = () => {
    history.goBack();
  }

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Select Assets</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '25px', flexDirection: 'column' }}>
        <BaseBox sx={{ justifyContent: 'start' }}>
          <img src={searchIcon} alt="search"></img>
          <Input className='search-input' placeholder='Assets name'></Input>
        </BaseBox>

        <List list={tokens} Component={TokenItem} sx={{ width: '100%', marginTop: '15px', marginBottom: '15px' }}>
        </List>
      </Box>
    </WrapperBasePage>
  )
}

export default Tokens;
