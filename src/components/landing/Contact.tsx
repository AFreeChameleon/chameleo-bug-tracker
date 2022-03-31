import React from'react';

import NextImage from 'next/image';
import demo from '../../../public/img/demo.png';
import waveOne from '../../../public/img/wave_1.svg';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { styled, alpha } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({

}));

const Container = styled('div')(({ theme }) => ({
    width: '850px',
    margin: '0 auto'
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    width: '100px',
    textTransform: 'none'
}));

type ContactState = {
    name: string;
    email: string;
    message: string;
}

class Contact extends React.Component<any, ContactState> {
    constructor(props) {
        super(props);

        this.submitEmail = this.submitEmail.bind(this);

        this.state = {
            name: '',
            email: '',
            message: ''
        }
    }

    submitEmail(e) {
        e.preventDefault();
    }

    render() {
        const {
            name,
            email,
            message
        } = this.state;

        return (
            <Root>
                <Box overflow="hidden" width="100%">
                    <img
                        src="/img/wave_2.svg"
                    />
                </Box>
                <Container>
                    <Typography variant="h3">
                        Contact us
                    </Typography>
                    <Box display="flex" flexDirection="column" rowGap="15px" marginTop="30px" component="form" onSubmit={this.submitEmail}>
                        <TextField
                            variant="outlined"
                            label="Name"
                            value={name}
                            onChange={(e) => this.setState({
                                name: e.target.value
                            })}
                        />
                        <TextField
                            variant="outlined"
                            label="Email"
                            value={email}
                            onChange={(e) => this.setState({
                                email: e.target.value
                            })}
                        />
                        <TextField
                            multiline
                            rows={5}
                            variant="outlined"
                            label="Message"
                            value={message}
                            onChange={(e) => this.setState({
                                message: e.target.value
                            })}
                        />
                        <SubmitButton variant="contained" color="secondary">
                            Submit
                        </SubmitButton>
                    </Box>
                </Container>
            </Root>
        )
    }
}

export default Contact;