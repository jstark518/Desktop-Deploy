import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Container, Button, Box } from '@mui/material'
import Xterm from "./XTerm";
import TerminalIcon from '@mui/icons-material/Terminal';


const BottomViewContainerStyle = styled.div`
  flex: 1;
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: end;
`;

export default function BottomViewContainer() {
    const [bottomCont, setBottomCont] = useState('');

    return (
        <BottomViewContainerStyle>
            <Container>
                <Button variant='contained' 
                    startIcon={<TerminalIcon/>}
                    onClick={()=> {
                        if(bottomCont==''){
                        setBottomCont('term')
                        }else{setBottomCont('')}
                    }}
                    sx={{fontSize: '10px', height: '18px', padding: '5px', borderRadius: '5px 5px 0 0'}}
                >
                Terminal
                </Button>
            </Container>
            <Box sx={{display: bottomCont == 'term' ?'block':'none'}}>
                <Xterm></Xterm>
            </Box>
        </BottomViewContainerStyle>
    )
}
