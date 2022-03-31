import React from'react';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    setAlerts
} from '../../redux/alerts/actions';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import { styled, alpha } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({

}));

const Container = styled('div')(({ theme }) => ({
    width: '850px',
    margin: '0 auto'
}));

const SubmitButton = styled(LoadingButton)(({ theme }) => ({
    width: '100px',
    textTransform: 'none'
}));

type ContactProps = {
    dispatchSetAlerts: (alerts: any[]) => void;
}

type ContactState = {
    name: string;
    email: string;
    message: string;
    loading: boolean;
}

class Contact extends React.Component<ContactProps, ContactState> {
    constructor(props) {
        super(props);

        this.submitEmail = this.submitEmail.bind(this);

        this.state = {
            name: '',
            email: '',
            message: '',
            loading: false
        }
    }

    submitEmail(e) {
        e.preventDefault();
        const { dispatchSetAlerts } = this.props;
        const {
            name,
            email,
            message,
            loading
        } = this.state;

        this.setState({ loading: true });
        
        axios.post('/api/contact-email', {
            name,
            email,
            message
        }).then((res) => {
            console.log('res', res)
            dispatchSetAlerts([
                {
                    severity: 'success',
                    message: res.data.message
                }
            ]);
        }).catch((err) => {
            console.log('err', err)
            if (err.response) {
                dispatchSetAlerts(
                    err.response.data.errors.map((e: string) => ({
                        type: 'error',
                        message: e
                    }))
                );
            } else {
                dispatchSetAlerts([ {
                    type: 'error',
                    message: err.message
                } ]);
            }
        }).finally(() => {
            this.setState({ loading: false })
        });
    }

    render() {
        const {
            name,
            email,
            message,
            loading
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
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        rowGap="15px" 
                        marginTop="30px" 
                        component="form" 
                        action=""
                        method="POST"
                        onSubmit={this.submitEmail}
                    >
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
                        <SubmitButton
                            disabled={loading}
                            variant="contained" 
                            color="secondary" 
                            type="submit"
                        >
                            Submit
                        </SubmitButton>
                    </Box>
                </Container>
            </Root>
        )
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (alerts: any[]) => dispatch(setAlerts(alerts))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Contact);