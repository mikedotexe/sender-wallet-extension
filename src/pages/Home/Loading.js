import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import styled from 'styled-components';

import _ from 'lodash';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;
  align-items: center;
  justify-content: center;
`

const Loading = () => {
  const history = useHistory();
  const location = useLocation();
  const appStore = useSelector((state) => state.app);

  useEffect(() => {
    setTimeout(() => {
      const params = location.search;
      if (appStore.lockupPassword) {
        if (appStore.isLockup) {
          history.push('/unlock' + params);
        } else if (!_.isEmpty(appStore.accounts)) {
          history.push('/home' + params);
        } else {
          history.push('/startup' + params);
        }
      } else {
        history.push('/setpwd' + params);
      }
    }, 500)
  }, [])

  return (
    <WrapperBox>
      <CircularProgress></CircularProgress>
    </WrapperBox>
  )
}

export default Loading;
