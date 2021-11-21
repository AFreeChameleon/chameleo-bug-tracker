import React from "react";

import { compose } from "redux";
import { connect } from "react-redux";

import {
    setTicketDescription
} from '../../../../redux/ticket/actions';

import {
    styled,
    alpha
} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { 
    CriticalPriorityIcon, 
    HighPriorityIcon, 
    LowPriorityIcon, 
    MediumPriorityIcon 
} from "../Icons";
import TicketDetails from "./TicketDetails";

type TicketBodyProps = {
    project: any;
    ticket: any;
    user: any

    dispatchSetTicketDescription: (projectId: string, ticketNumber: number, description: string) => void;
}

type TicketBodyState = {
    editingDescription: null | string;
}

const Body = styled('div')(({ theme }) => ({
    display: 'grid',
    columnGap: '20px',
    gridTemplateColumns: 'auto 350px',
    marginTop: '20px'
}));

const Main = styled('div')(({ theme }) => ({
    width: '100%'
}));

const SaveButtons = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '15px',
    marginTop: '10px'
}));

const SaveButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '70px',
}));

class TicketBody extends React.Component<TicketBodyProps, TicketBodyState> {
    constructor(props) {
        super(props);

        this.saveDescription = this.saveDescription.bind(this);

        this.state = {
            editingDescription: null
        }
    }

    saveDescription(e) {
        e.preventDefault();
        const { project, ticket, dispatchSetTicketDescription } = this.props;
        const { editingDescription } = this.state;

        this.setState({ editingDescription: null });
        dispatchSetTicketDescription(project.id, ticket.ticketNumber, editingDescription);
    }

    render() {
        const { project, ticket, user } = this.props;
        const { editingDescription, } = this.state;
        const role = user.roles.find(r => r.projectId === project.id);

        return (
            <>
                <Body>
                    <Main>
                        <form action="" onSubmit={this.saveDescription}>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="Description"
                                value={editingDescription === null ? ticket.description : editingDescription}
                                onChange={(e) => this.setState({ editingDescription: e.target.value })}
                            />
                            {editingDescription !== null &&(
                                <SaveButtons>
                                    <SaveButton
                                        variant="contained"
                                        type="submit"
                                    >
                                        Save
                                    </SaveButton>
                                    <SaveButton
                                        variant="outlined"
                                        onClick={(e) => this.setState({ editingDescription: null })}
                                    >
                                        Cancel
                                    </SaveButton>
                                </SaveButtons>
                            )}
                        </form>
                    </Main>
                    <TicketDetails />
                </Body>
            </>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data,
    user: state.user.data
});

const mapDispatchToProps = dispatch => ({
    dispatchSetTicketDescription: (projectId: string, ticketNumber: number, description: string) => dispatch(setTicketDescription(projectId, ticketNumber, description))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(TicketBody);