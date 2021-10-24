import React from 'react';

import Box from '@material-ui/core/Box';

import styled from 'styled-components';

const WrapperBox = styled(Box)`
  width: 315px;
  background: #1E1E1E;
  border: 1px solid #090909;
  box-sizing: border-box;
  box-shadow: 0px 0px 1px rgba(219, 219, 219, 0.5);
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
`

const BaseBox = ({ className, children, ...props }) => {
  return (
    <WrapperBox className={className} {...props}>
      {children}
    </WrapperBox>
  )
}

export default BaseBox;
