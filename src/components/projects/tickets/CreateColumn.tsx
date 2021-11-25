import React from 'react';
import _ from 'lodash';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { setAlerts } from '../../../redux/alerts/actions';
import { fetchUserData } from '../../../redux/user/actions';
import { setProjectDetails } from '../../../redux/project/actions';

import { styled } from '@mui/material/styles';

import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';

type CreateColumnProps = {
    project: any;

    dispatchSetAlerts: (e: any[]) => void;
    dispatchFetchUserData: () => void;
    dispatchSetProjectDetails: (id: string, details: any) => void;
}

type CreateColumnState = {
    createModalOpen: boolean;
    columnName: string;
}

const CreatColumnButton = styled(Button)(({ theme }) => ({
    height: '44px',
    width: '200px'
}));

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

class CreateColumn extends React.Component<CreateColumnProps, CreateColumnState> {
    constructor(props) {
        super(props);

        this.createColumn = this.createColumn.bind(this);

        this.state = {
            createModalOpen: false,
            columnName: ''
        }
    }

    createColumn(e) {
        e.preventDefault();
        const { project, dispatchSetProjectDetails } = this.props;
        const { columnName } = this.state;

        let editableProject = _.cloneDeep(project);
        const newId = Math.max(...Object.keys(editableProject.details.columns).map((id) => parseInt(id))) + 1;
        editableProject.details.columns[newId] = {
            name: columnName,
            ticketIds: []
        };
        editableProject.details.columnOrder.push(newId.toString());
        this.setState({
            createModalOpen: false,
            columnName: ''
        });
        dispatchSetProjectDetails(project.id, editableProject.details);

    }

    render() {
        const { 
            createModalOpen, 
            columnName 
        } = this.state;

        return (
            <div>
                {/* CREATE COLUMN */}
                <CreatColumnButton
                    variant="outlined"
                    startIcon={<AddIcon/>}
                    onClick={() => this.setState({ createModalOpen: true })}
                >   
                    Create Column
                </CreatColumnButton>
                <Modal
                    open={createModalOpen}
                    onClose={() => this.setState({ createModalOpen: false })}
                >
                    <ModalBody>
                        <Typography
                            variant="h5"
                        >
                            Create column
                        </Typography>
                        <Form action="" onSubmit={this.createColumn}>
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
                                    defaultValue={columnName}
                                    onChange={(e) => this.setState({ columnName: e.target.value })}
                                />
                            </Field>
                            <FlexGrow />
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                sx={{ width: '100px', height: '40px', textTransform: 'none' }}
                            >
                                Create
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
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
)(CreateColumn);