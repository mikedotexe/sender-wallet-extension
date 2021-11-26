import React, { useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';
import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import backIcon from '../../assets/img/back.png';
import addIcon from '../../assets/img/add.png';
import arrowIcon from '../../assets/img/arrow.png';

const WrapperBasePage = styled(BaseHeaderPage)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  .network-title {
    width: 325px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 25px;
  }

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

const NetworkItem = (props) => {
  const history = useHistory();
  const { name, index } = props;

  const canEdit = useMemo(() => {
    return (index !== 0 && index !== 1);
  }, [index])

  return (
    <Button key={index} disabled={!canEdit} className="button" onClick={() => history.push(`/settings/editNetwork${index}`)}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ marginLeft: '15px', fontSize: '16px', color: '#777777' }}>{name}</Typography>
      </Box>

      {
        canEdit && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ marginLeft: '7px', width: '6px', height: '10px' }} src={arrowIcon} alt="arrow"></img>
          </Box>
        )
      }
    </Button>
  )
}

const Network = () => {
  const history = useHistory();

  const appStore = useSelector((state) => state.app);

  const { rpcs } = appStore;

  const backClicked = () => {
    history.goBack();
  }

  const addClicked = () => {
    history.push('/settings/addNetwork');
  }

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Network</Typography>

        <Button sx={{ position: 'absolute', right: '9px', top: '26px' }} onClick={addClicked}>
          <img src={addIcon} alt='add'></img>
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: '30px' }}>
        <Box className="network-title">
          <Typography sx={{ fontSize: '16px', color: '#777777', alignSelf: 'start' }}>Mainnet:</Typography>
        </Box>
        {
          _.map(_.filter(rpcs, item => item.network === 'mainnet'), (rpc) => {
            return <NetworkItem {...rpc} />
          })
        }

        <Box className="network-title">
          <Typography sx={{ fontSize: '16px', color: '#777777', alignSelf: 'start' }}>Testnet:</Typography>
        </Box>
        {
          _.map(_.filter(rpcs, item => item.network === 'testnet'), (rpc) => {
            return <NetworkItem {...rpc} />
          })
        }
      </Box>
    </WrapperBasePage>
  )
}

export default Network;
