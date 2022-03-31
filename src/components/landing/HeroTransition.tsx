import React from'react';

import NextImage from 'next/image';
import demo from '../../../public/img/demo.png';
import waveOne from '../../../public/img/wave_1.svg';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { styled, alpha } from '@mui/material/styles';

const Img = styled('img')(({ theme }) => ({
    boxShadow: theme.shadows[4],
    borderRadius: '5px'
}))

class HeroTransition extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box alignItems="center" display="flex" flexDirection="column" lineHeight="0">
                <Box marginBottom="-400px" zIndex="5">
                    <Img
                        src="/img/demo.png"
                        sx={{
                            maxWidth: '1080px',
                            maxHeight: '545px'
                        }}
                    />
                </Box>
                <Box overflow="hidden" width="100%">
                    <img
                        src="/img/wave_1.svg"
                    />
                </Box>
            </Box>
        )
    }
}

export default HeroTransition;