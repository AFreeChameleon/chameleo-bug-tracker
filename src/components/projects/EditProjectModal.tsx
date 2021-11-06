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

type EditProjectModalProps = {
    project: any;
    originalCompany: string;
    setProject: (key: string, value: any) => void;
    open: boolean;
    onClose: () => void;
    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
}

type EditProjectModalState = {
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

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 50px)',
    marginTop: '25px',
    boxSizing: 'border-box'
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

class EditProjectModal extends React.Component<EditProjectModalProps, EditProjectModalState> {
    constructor(props) {
        super(props);

        this.submitEditProject = this.submitEditProject.bind(this);
    }

    submitEditProject(e) {
        e.preventDefault();
        const { onClose, project, dispatchSetAlerts, dispatchFetchUserData } = this.props;

        axios.patch(`/api/project/${project.id}/edit`, {
            ...project,
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
                dispatchSetAlerts([ { type: 'error', message: 'An error occurred while editing your project. Please try again later.' } ])
            }
        })
        .finally(() => {
            onClose();
        });
    }

    render() {
        const { project, setProject, open, onClose } = this.props;
        console.log(project)
        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Typography
                        variant="h5"
                    >
                        Edit project
                    </Typography>
                    <Form action="" onSubmit={this.submitEditProject}>
                        <Field>
                            <Typography
                                variant="body2"
                            >
                                Name
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                value={project.name}
                                onChange={(e) => setProject('name', e.target.value)}
                            />
                        </Field>
                        <FlexGrow />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ width: '100px', height: '40px', textTransform: 'none' }}
                        >
                            Edit
                        </Button>
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
)(EditProjectModal);