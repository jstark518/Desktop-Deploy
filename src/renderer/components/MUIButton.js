import React from 'react';
import {styled} from "@mui/system";
import {Button} from "@mui/material";

// Wrapping MUI Button Component in a styled component
const StyledMUIButton = styled(Button)({
    backgroundColor: "#6D20C5",
    color: "white",
    "&:hover": {backgroundColor: '#9F62E5'},
});

export function MUIButton({onClick, title}) {
    // handle click function that will handle function passed from parent component
    const handleClick = () => {
        onClick();
    };

    return (
        <StyledMUIButton onClick={handleClick} variant="contained">
            {title}
        </StyledMUIButton>
    )
}

export function SmallMUIButton({onClick, title, sx}) {
    return (
        <Button onClick={onClick} variant="outlined" size="small" sx={sx}>
            {title}
        </Button>
    )
}