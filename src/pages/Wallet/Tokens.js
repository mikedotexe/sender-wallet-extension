import React from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import List from '../../components/List';
import backIcon from '../../assets/img/back.png';
import searchIcon from '../../assets/img/search.png';
import selectedIcon from '../../assets/img/selected.png';

const WrapperBasePage = styled(BasePage)`
  .search-input {
    flex: 1;
    margin-left: 11px;
  }
`

const tokens = ['NEAR', 'Skyword', 'NEAR', 'Skyword', 'NEAR', 'Skyword', 'NEAR', 'Skyword', 'NEAR', 'Skyword', 'NEAR', 'Skyword'];

const TokenItem = ({ data }) => {
  return (
    <Button sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: '25px', paddingRight: '25px', height: '60px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar></Avatar>
        <Typography sx={{ fontSize: '14px', color: 'white', marginLeft: '10px', lineHeight: '24px' }}>{data}</Typography>
      </Box>

      <img src={selectedIcon} alt="selected"></img>
    </Button>
  )
}

const Tokens = () => {
  const history = useHistory();

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
