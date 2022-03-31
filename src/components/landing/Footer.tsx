import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { styled, alpha } from '@mui/material/styles';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box height="60px" marginTop="30px" boxShadow={(theme) => theme.shadows[4]} display="flex" alignItems="center" padding="0 20px">
                <Typography variant="body2">
                    Email: <Link href="mailto:support@chameleo.dev">support@chameleo.dev</Link>
                </Typography>
            </Box>
        )
    }
}

export default Footer;