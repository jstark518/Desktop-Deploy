import React from 'react';
import { styled } from "@mui/system";
import { Button } from "@mui/material";

// Wrapping MUI Button Component in a styled component
const StyledMUIButton = styled(Button, {
  shouldForwardProp: (props) => props !== "variant" || props !== "onClick",
  })({
  backgroundColor: "#6D20C5",
  color: "white",
  "&:hover": { backgroundColor: '#9F62E5' },
  });


export default function MUIButton(onClickFunc) {

  // handle click function that will handle function passed from parent component
  const handleClick = () => {onClickFunc.onClick()};

  return (
    <StyledMUIButton onClick={handleClick} variant="contained">
      Clone
    </StyledMUIButton>
  )
}
