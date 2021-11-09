import React from 'react';
import _ from 'lodash';
import axios from 'axios';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/system';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { setAlerts } from '../../../redux/alerts/actions';
import { fetchUserData } from '../../../redux/user/actions';
import { setProjectDetails } from '../../../redux/project/actions';

type EditColumnModalProps = {
    project: any;
    columnId: string;
    open: boolean;
    onClose: () => void;
    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
    dispatchSetProjectDetails: (id: string, details: any) => void;
}

type EditColumnModalState = {
    name: string;
}

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    height: '200px',
    padding: '20px 30px',
    outline: 'none'
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

class EditColumnModal extends React.Component<EditColumnModalProps, EditColumnModalState> {
    constructor(props) {
        super(props);

        this.submitEditColumn = this.submitEditColumn.bind(this);

        this.state = {
            name: ''
        }
    }

    submitEditColumn(e) {
        e.preventDefault();
        const { project, columnId, dispatchSetProjectDetails, onClose } = this.props;
        const { name } = this.state;

        let editableProject = _.cloneDeep(project);
        editableProject.details.columns[columnId].name = name;
        dispatchSetProjectDetails(editableProject.id, editableProject.details);
        onClose();
    }

    render() {
        const { open, onClose, columnId, project } = this.props;
        if (!(project && project.details && columnId)) {
            return null;
        }
        const column = project.details.columns[columnId];
        console.log(column, project, columnId)
        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Typography
                        variant="h5"
                    >
                        Edit column
                    </Typography>
                    <Form action="" onSubmit={this.submitEditColumn}>
                        <Field>
                            <Typography
                                variant="body2"
                            >
                                Name
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Column name..."
                                defaultValue={column.name}
                                onChange={(e) => this.setState({ name: e.target.value })}
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
    user: state.user.data,
    project: state.project.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (values: any[]) => dispatch(setAlerts(values)),
    dispatchFetchUserData: () => dispatch(fetchUserData()),
    dispatchSetProjectDetails: (id: string, details: any) => dispatch(setProjectDetails(id, details))
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(EditColumnModal);