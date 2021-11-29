import React from 'react';

import styled from 'styled-components';
import _ from 'lodash';
import Button from '@material-ui/core/Button';

const WrapperButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background: #F7F7FC;
  border-radius: 24px;
  padding: 7px 5px;

  .button {
    flex: 1;
    border-radius: 24px;
  }

  .selected {
    background: #FFCE3E;
    color: #282828;
  }

  .unselected {
    background: rgba(0, 0, 0, 0);
    color: #9CA2AA;
  }
`

const ButtonGroup = ({ buttons = [], onChange, value }) => {
  return (
    <WrapperButtonGroup>
      {
        _.map(buttons, (button, index) => {
          return (
            <Button
              sx={{
                ml: 1,
                "&.MuiButtonBase-root:hover": {
                  backgroundColor: value === index ? '#FFCE3E' : '#F7F7FC',
                }
              }}
              className={`button ${value === index ? 'selected' : 'unselected'}`} key={`${button}-${index}`} onClick={() => onChange(index)}
            >
              {button}
            </Button>
          )
        })
      }
    </WrapperButtonGroup >
  )
}

export default ButtonGroup;
