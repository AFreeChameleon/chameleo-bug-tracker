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
    width: '400px',
    height: '400px',
    padding: '20px 30px'
}));

const Field = styled('div')(({ theme }) => ({
    marginTop: '15px'
}))

class EditProjectModal extends React.Component<EditProjectModalProps, EditProjectModalState> {
    constructor(props) {
        super(props);

        this.submitEditProject = this.submitEditProject.bind(this);
    }

    submitEditProject(e) {
        e.preventDefault();
        const { onClose, project, originalCompany, dispatchSetAlerts, dispatchFetchUserData } = this.props;

        axios.patch('/api/project/edit', {
            ...project,
            originalCompany: originalCompany
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
                    <form action="" onSubmit={this.submitEditProject}>

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
                        <Field>
                            <Typography
                                variant="body2"
                            >
                                Company
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                value={project.company}
                                onChange={(e) => setProject('company', e.target.value)}
                                helperText="Can't have: capital letters, spaces or special characters."
                            />
                        </Field>
                        <Field>
                            <Typography
                                variant="body2"
                            >
                                Key
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                value={project.key}
                                onChange={(e) => setProject('key', e.target.value.toUpperCase())}
                                helperText={`Usually the initials for your company. Can't have: spaces or special characters.`}
                            />
                        </Field>
                        <Field>
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                            >
                                Edit
                            </Button>
                        </Field>
                    </form>
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