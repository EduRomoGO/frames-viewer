import React from 'react';
import './Button.css';

const Button = ({onClick, name}) => {
  return <button className='button button--salmon' onClick={() => onClick(name)}>{name}</button>
};

export default Button;
