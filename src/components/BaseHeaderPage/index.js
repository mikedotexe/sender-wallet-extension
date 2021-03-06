import React from 'react';

import Box from '@material-ui/core/Box';
import styled from 'styled-components';

import Header from '../../components/Header';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(28, 28, 28);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;
`

const BaseHeaderPage = ({ className, children }) => {
  return (
    <WrapperBox className={className}>
      <Header />
      <Box sx={{ marginTop: '25px', marginBottom: '25px' }}></Box>
      {children}
    </WrapperBox>
  )
}

export default BaseHeaderPage;