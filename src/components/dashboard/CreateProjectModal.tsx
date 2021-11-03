import React from 'react';
import axios from 'axios';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/system';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { setAlerts } from '../../redux/alerts/actions';
import { fetchUserData } from '../../redux/user/actions';

type CreateProjectModalProps = {
    open: boolean;
    onClose: () => void;
    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
}

type CreateProjectModalState = {
    name: string;
    key: string;
}

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    height: '200px',
    padding: '20px 30px'
}));

const Field = styled('div')(({ theme }) => ({
    
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    marginTop: '15px',
    boxSizing: 'border-box'
}));



class CreateProjectModal extends React.Component<CreateProjectModalProps, CreateProjectModalState> {
    constructor(props) {
        super(props);

        this.submitCreateProject = this.submitCreateProject.bind(this);
        this.state = {
            name: '',
            key: '',
        }
    }

    submitCreateProject(e) {
        e.preventDefault();
        const { onClose, dispatchSetAlerts, dispatchFetchUserData } = this.props;
        const { name, key } = this.state;

        axios.post('/api/project/new', {
            name: name,
            key: key,
        }, { withCredentials: true })
        .then((res) => {
            dispatchSetAlerts([]);
            dispatchFetchUserData();
        })
        .catch((err) => {
            if (err.response) {
                dispatchSetAlerts(err.response.data.errors.map((e) => ({
                    type: 'error',
                    message: e
                })));
            } else {
                dispatchSetAlerts([ { type: 'error', message: 'An error occurred while creating your project. Please try again later.' } ])
            }
        })
        .finally(() => {
            onClose();
        });
    }

    render() {
        const { open, onClose } = this.props;
        const { name, key } = this.state;

        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Typography
                        variant="h5"
                    >
                        Create project
                    </Typography>
                    <Form action="" onSubmit={this.submitCreateProject}>
                        <Field>
                            <Typography
                                variant="body2"
                            >
                                Name
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                value={name}
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                        </Field>
                        <FlexGrow />
                        <div>
                            <Button
                                // fullWidth
                                variant="contained"
                                type="submit"
                            >
                                Create
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (values: any[]) => dispatch(setAlerts(values)),
    dispatchFetchUserData: () => dispatch(fetchUserData())
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateProjectModal);