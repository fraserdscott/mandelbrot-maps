import React from 'react';
import { Fab } from '@material-ui/core';

export default function TransparentFab(props) {
  const { children, style, ...p } = props;
  return (
      <Fab 
      size="medium" 
      style={{
        backgroundColor: "transparent",
        boxShadow: "none",
        ...style,
      }} {...p} >
        {children}
      </Fab>
  )
}