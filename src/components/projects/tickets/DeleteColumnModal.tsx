import React from 'react';
import _ from 'lodash';
import axios from 'axios';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { setAlerts } from '../../../redux/alerts/actions';
import { fetchUserData } from '../../../redux/user/actions';
import { setProjectDetails, deleteProjectColumn } from '../../../redux/project/actions';

import { styled } from '@mui/system';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type DeleteColumnModalProps = {
    project: any;
    columnId: string;
    open: boolean;
    onClose: () => void;

    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
    dispatchSetProjectDetails: (id: string, details: any) => void;
    dispatchDeleteProjectColumn: (
        id: string, 
        colId: string, 
        method: string, 
        colIdToMoveTo: string | null
    ) => void;
}

type DeleteColumnModalState = {
    selectedMethod: string;
    selectedColumnId: null | string;
}

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
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

class DeleteColumnModal extends React.Component<DeleteColumnModalProps, DeleteColumnModalState> {
    constructor(props) {
        super(props);

        this.submitDeleteColumn = this.submitDeleteColumn.bind(this);

        this.state = {
            selectedMethod: '0',
            selectedColumnId: '0'
        }
    }

    submitDeleteColumn(e) {
        e.preventDefault();
        const { project, columnId, dispatchDeleteProjectColumn, onClose } = this.props;
        const { selectedMethod, selectedColumnId } = this.state;
        console.log(selectedMethod, selectedColumnId)
        dispatchDeleteProjectColumn(
            project.id, 
            columnId, 
            selectedMethod, 
            selectedMethod === '0' ? selectedColumnId : null
        );

        onClose();
    }

    componentDidMount() {
        const { project, columnId } = this.props;

        console.log('mounted')
        if (project.details.columnOrder.length <= 1) {
            this.setState({ selectedMethod: '1' });
            return;
        }

        if (project.details.columnOrder[0] === columnId) {
            console.log(project.details.columnOrder[0], columnId)
            this.setState({ selectedColumnId: project.details.columnOrder[project.details.columnOrder.length - 1] });
            return;
        }
        
        this.setState({ selectedColumnId: project.details.columnOrder[0] });
    }

    render() {
        const { open, onClose, columnId, project } = this.props;
        const { selectedMethod, selectedColumnId } = this.state;
        if (!(project && project.details && columnId)) {
            return null;
        }
        const column = project.details.columns[columnId];
        
        return (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Typography
                        variant="h5"
                    >
                        Delete column
                    </Typography>
                    <Form action="" onSubmit={this.submitDeleteColumn}>
                        <Field>
                            <Typography
                                variant="body1"
                            >
                                Are you sure you want to delete <strong>{column.name}</strong>?
                            </Typography>
                        </Field>
                        { project.details.columns[columnId].ticketIds.length > 0 && (
                            <Field>
                                <RadioGroup
                                    value={selectedMethod}
                                    onChange={(e) => this.setState({ selectedMethod: e.target.value })}
                                >
                                    <FormControlLabel 
                                        value="0" 
                                        control={<Radio />} 
                                        sx={{ marginTop: '10px' }} 
                                        disabled={project.details.columnOrder.length <= 1} 
                                        label="Move all tickets to another column" 
                                    />
                                    <Select
                                        size="small"
                                        variant="standard"
                                        value={selectedColumnId}
                                        sx={{ width: '50%', marginLeft: '32px' }}
                                        disabled={project.details.columnOrder.length <= 1}
                                        onChange={(e) => this.setState({ selectedColumnId: e.target.value })}
                                    >
                                        { project.details.columnOrder
                                            .filter((c) => c !== columnId)
                                            .map((colId) => {
                                                const c = project.details.columns[colId];
                                                return (
                                                    <MenuItem value={colId} key={colId}>
                                                        {c.name}
                                                    </MenuItem>
                                                )
                                        }) }
                                    </Select>
                                    <FormControlLabel 
                                        value="1" 
                                        control={<Radio />} 
                                        sx={{ marginTop: '30px' }} 
                                        label="Archive all tickets in that column" 
                                    />
                                </RadioGroup>
                            </Field>
                        ) }
                        <FlexGrow />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            color="error"
                            sx={{ width: '100px', height: '40px', textTransform: 'none', marginTop: '30px' }}
                        >
                            Delete
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
    dispatchSetProjectDetails: (id: string, details: any) => dispatch(setProjectDetails(id, details)),
    dispatchDeleteProjectColumn: (
        id: string, 
        colId: string, 
        method: string, 
        colIdToMoveTo: string | null = null
    ) => dispatch(deleteProjectColumn(id, colId, method, colIdToMoveTo))
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(DeleteColumnModal);