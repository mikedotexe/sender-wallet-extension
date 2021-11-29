import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const WrapperTransaction = styled.div`
  height: 68px;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .info {
    flex: 1;
    margin-left: 15px;
  }
  
  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
`

const Transaction = ({ style, data, index }) => {
  const { action_kind: title, hash } = data;

  return (
    <WrapperTransaction>
      <Button onClick={() => window.open(`https://explorer.mainnet.near.org/transactions/${hash}`)}>
        <Avatar alt={data.hash}></Avatar>
        <Box className="info">
          <Box className="line">
            <Typography sx={{ color: '#000000', fontSize: '14px' }}>{title}</Typography>
          </Box>

          <Box className="line">
            <Typography sx={{ width: '220px', color: '#5E5E5E', fontSize: '12px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>hash: {hash}</Typography>
          </Box>
        </Box>
      </Button>
    </WrapperTransaction>
  )
}

export default Transaction;
