import React from 'react';

import Box from '@material-ui/core/Box'
import _ from 'lodash';

const List = ({ list, Component, sx = {} }) => {
  return (
    <Box sx={sx}>
      {
        _.map(list, (item, index) => {
          return (
            <Component key={item.name || item.accountId} index={index} data={item}></Component>
          )
        })
      }
    </Box>
  )
}

export default List;
