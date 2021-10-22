import React from 'react';

import styled from 'styled-components';

const WrapperInput = styled.input`
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  color: white;

  :focus {
    outline: none;
  }
`

const Input = (props) => {
  return (
    <WrapperInput {...props}></WrapperInput>
  )
}

export default Input;
