import React from 'react';

import Box from '@material-ui/core/Box'
import _ from 'lodash';

const List = ({ list, Component }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {
        _.map(list, (item, index) => {
          return (
            <Component index={index} data={item}></Component>
          )
        })
      }
    </Box>
  )
}

export default List;
