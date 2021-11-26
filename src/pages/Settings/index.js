import React from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import arrowIcon from '../../assets/img/arrow.png';
import currencyIcon from '../../assets/img/currency.png';
import languageIcon from '../../assets/img/language.png';
import networkIcon from '../../assets/img/networkIcon.png';
import changePasswordIcon from '../../assets/img/change_password.png';

const WrapperBasePage = styled(BaseHeaderPage)`
  .button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    width: 325px;
    height: 69px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
  }
`

const SettingItem = ({ item }) => {
  const { icon, title, value, onClick } = item;
  return (
    <Button className="button" onClick={onClick}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography sx={{ marginLeft: '15px', fontSize: '16px', color: '#777777' }}>{title}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '14px', color: '#FAD165' }}>{value}</Typography>
        <img style={{ marginLeft: '7px', width: '6px', height: '10px' }} src={arrowIcon} alt="arrow"></img>
      </Box>
    </Button>
  )
}

const Settings = () => {
  const history = useHistory();

  const generalSettings = [
    {
      title: 'Currency',
      value: 'USD',
      icon: <img style={{ width: '22px', height: '22px' }} src={currencyIcon} alt="currency"></img>,
    },
    {
      title: 'Language',
      value: 'English',
      icon: <img style={{ width: '22px', height: '22px' }} src={languageIcon} alt="language"></img>,
    },
    {
      title: 'Network',
      value: '',
      icon: <img style={{ width: '22px', height: '22px' }} src={networkIcon} alt="network"></img>,
      onClick: () => {
        history.push('/settings/network');
      }
    },
  ]

  const securitySettings = [
    {
      title: 'Change Password',
      value: '',
      icon: <img style={{ width: '16px', height: '22px' }} src={changePasswordIcon} alt="change-password"></img>,
      onClick: () => {
        history.push('/settings/changepwd');
      }
    },
  ]

  return (
    <WrapperBasePage>
      <Box sx={{ marginLeft: '25px', marginRight: '25px', width: '100%', boxSizing: 'border-box' }}>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>General</Typography>

        {
          _.map(generalSettings, (setting) => {
            return <SettingItem item={setting} key={setting.title}></SettingItem>
          })
        }

        <Typography sx={{ marginTop: '20px', fontSize: '16px', color: '#777777' }}>Security</Typography>
        {
          _.map(securitySettings, (setting) => {
            return <SettingItem item={setting} key={setting.title}></SettingItem>
          })
        }
      </Box>
    </WrapperBasePage>
  )
}

export default Settings;
