import React from 'react';
import axios from 'axios';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/system';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { setAlerts } from '../../redux/alerts/actions';
import { fetchUserData } from '../../redux/user/actions';

type DestroyProjectModalProps = {
    open: boolean;
    project: any;
    onClose: () => void;
    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
}

type DestroyProjectModalState = {
}

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    height: '160px',
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
    height: 'calc(100% - 50px)',
    marginTop: '25px',
    boxSizing: 'border-box'
}));



class DestroyProjectModal extends React.Component<DestroyProjectModalProps, DestroyProjectModalState> {
    constructor(props) {
        super(props);

        this.submitDeleteProject = this.submitDeleteProject.bind(this);
    }

    submitDeleteProject(e) {
        e.preventDefault();
        const { onClose, dispatchSetAlerts, dispatchFetchUserData, project } = this.props;

        axios.delete(`/api/project/${project.id}/destroy`, { withCredentials: true })
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
                dispatchSetAlerts([ { type: 'error', message: 'An error occurred while destroying your project. Please try again later.' } ])
            }
        })
        .finally(() => {
            onClose();
        });
    }

    render() {
        const { open, onClose, project } = this.props;

        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Box display="flex" flexDirection="column" height="100%">
                        <Typography
                            variant="h5"
                        >
                            Destroy project
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{marginTop: '15px'}}
                        >
                            Are you sure you want to delete {project.name}?
                        </Typography>
                        <FlexGrow />
                        <Box display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ width: '100px', height: '40px', textTransform: 'none' }}
                                onClick={this.submitDeleteProject}
                            >
                                Destroy
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ width: '100px', height: '40px', textTransform: 'none' }}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
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
)(DestroyProjectModal);