import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const WrapperToken = styled.div`
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

const Token = ({ style, data, index }) => {
  const price = data.price ? data.price : 'Price Unavailable';
  let total = data.price ? (Number(data.price) * Number(data.amount)).toFixed(4) : ''
  total = total ? `≈ $${total}` : '- USD';

  return (
    <WrapperToken>
      <Avatar alt={data.name}></Avatar>
      <Box className="info">
        <Box className="line">
          <Typography sx={{ color: '#000000', fontSize: '14px' }}>{data.symbol}</Typography>
          <Typography sx={{ color: '#000000', fontSize: '14px' }}>{data.amount}</Typography>
        </Box>

        <Box className="line">
          <Typography sx={{ color: '#5E5E5E', fontSize: '12px' }}>{price}</Typography>
          <Typography sx={{ color: '#5E5E5E', fontSize: '12px' }}>{total}</Typography>
        </Box>
      </Box>
    </WrapperToken>
  )
}

export default Token;
