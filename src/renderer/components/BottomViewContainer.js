import React, {useState} from "react";
import { Container, Button, Box } from '@mui/material'
import Xterm from "./XTerm";
import TerminalIcon from '@mui/icons-material/Terminal';
import {styled} from "@mui/system";


const BottomViewContainerStyle = styled('div')({
    flex: 1,
    overflowWrap: 'anywhere',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'end',
});

export default function BottomViewContainer() {
    const [bottomCont, setBottomCont] = useState(false);

    return (
        <BottomViewContainerStyle>
            <Container>
                <Button variant='contained'
                        startIcon={<TerminalIcon/>}
                        onClick={() => setBottomCont(!bottomCont)}
                        sx={{fontSize: '10px', height: '18px', padding: '5px', borderRadius: '5px 5px 0 0'}}
                >
                    Terminal
                </Button>
            </Container>
            <Box sx={{display: bottomCont ? 'block' : 'none'}}>
                <Xterm setShowFunc={setBottomCont}></Xterm>
            </Box>
        </BottomViewContainerStyle>
    )
}
