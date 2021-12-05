import React from 'react';
import date from 'date-and-time';
import { withRouter, NextRouter } from 'next/router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    restoreTickets,
    fetchArchivedTickets,
    setArchivedTickets,
    deleteTickets
} from '../../../../redux/project/actions';

import { styled, alpha } from '@mui/system';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';

import SearchIcon from '@mui/icons-material/Search';

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const Body = styled('div')(({ theme }) => ({
    marginTop: '30px'
}));

const LinkTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgb(0, 0, 0, 0.1)'
    }
}));

const ModalBody = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    width: '420px'
}));

const SmallButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }: any) => ({
    color: 'inherit',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey['400']}`,
    marginRight: '30px',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const ButtonsDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: '20px',
    columnGap: '20px'
}));

type ArchivedTicketsBodyProps = {
    project: any;
    router: NextRouter;
    dispatchRestoreTickets: (id: string, ticketNumbers: number[]) => void;
    dispatchFetchArchivedTickets: (id: string) => void;
    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean) => void;
    dispatchDeleteTickets: (id: string, ticketNumbers: number[]) => void;
}

type ArchivedTicketsBodyState = {
    selectedTickets: number[];
    restoreOpen: boolean;
    deleteOpen: boolean;
}

class ArchivedTicketsBody extends React.Component<ArchivedTicketsBodyProps, ArchivedTicketsBodyState> {
    constructor(props) {
        super(props);

        this.restoreTickets = this.restoreTickets.bind(this);
        this.deleteTickets = this.deleteTickets.bind(this);

        this.state = {
            selectedTickets: [],
            restoreOpen: false,
            deleteOpen: false
        }
    }

    restoreTickets() {
        const { project, dispatchSetArchivedTickets } = this.props;
        const { selectedTickets } = this.state;

        dispatchSetArchivedTickets(project.id, selectedTickets, false);

        this.setState({ restoreOpen: false });
    }

    deleteTickets() {
        const { project, dispatchDeleteTickets } = this.props;
        const { selectedTickets } = this.state;

        dispatchDeleteTickets(project.id, selectedTickets);

        this.setState({ deleteOpen: false })
    }

    render() {
        const { project, router } = this.props;
        const { selectedTickets, restoreOpen, deleteOpen } = this.state;
        
        return (
            <Body>
                <FlexDiv>
                    <Box display="flex" justifyContent="space-between">
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Box>
                </FlexDiv>
                <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{ marginTop: '20px' }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={project.tickets.length > 0 && (selectedTickets.length === project.tickets.length)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                this.setState({ selectedTickets: [ ...project.archivedTickets.map((t) => t.ticketNumber) ] });
                                            } else {
                                                this.setState({ selectedTickets: [] });
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Ticket Number</TableCell>
                                <TableCell align="right">Created At</TableCell>
                                <TableCell align="right">Last Edited</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {project.archivedTickets.map((t, i) => {
                                const dateCreatedAt = new Date(t.createdAt);
                                const dateUpdatedAt = new Date(t.updatedAt);
                                return (
                                    <LinkTableRow key={i} onClick={() => router.push(`/projects/${project.id}/tickets/${t.ticketNumber}`)}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedTickets.includes(t.ticketNumber)}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        this.setState({ selectedTickets: [ ...selectedTickets, t.ticketNumber ] });
                                                    } else {
                                                        this.setState({selectedTickets: selectedTickets.filter((id) => id !== t.ticketNumber) });
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{t.name}</TableCell>
                                        <TableCell align="right">{t.ticketNumber}</TableCell>
                                        <TableCell align="right">
                                            {date.format(dateCreatedAt, 'ddd, MMM DD YYYY')}
                                        </TableCell>
                                        <TableCell align="right">
                                            {date.format(dateUpdatedAt, 'ddd, MMM DD YYYY')}
                                        </TableCell>
                                    </LinkTableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ButtonsDiv>
                    <SmallButton
                        variant="contained"
                        onClick={() => this.setState({ restoreOpen: true })}
                    >
                        Restore
                    </SmallButton>
                    <SmallButton
                        variant="outlined"
                        color="error"
                        onClick={() => this.setState({ deleteOpen: true })}
                    >
                        Permanently Delete
                    </SmallButton>
                </ButtonsDiv>
                <Modal 
                    open={restoreOpen}
                    onClose={() => this.setState({ restoreOpen: false })}
                >
                    <ModalBody>
                        <Typography
                            sx={{ marginBottom: '20px' }}
                            variant="h5"
                        >
                            Restore
                        </Typography>
                        <Typography
                            sx={{ marginBottom: '25px' }}
                        >
                            Are you sure you want to restore these tickets?
                        </Typography>
                        <FlexDiv>
                            <SmallButton
                                variant="contained"
                                onClick={this.restoreTickets}
                            >
                                Restore
                            </SmallButton>
                            <SmallButton
                                variant="outlined"
                                onClick={() => this.setState({ restoreOpen: false })}
                            >
                                Cancel
                            </SmallButton>
                        </FlexDiv>
                    </ModalBody>
                </Modal>
                <Modal 
                    open={deleteOpen}
                    onClose={() => this.setState({ deleteOpen: false })}
                >
                    <ModalBody>
                        <Typography
                            sx={{ marginBottom: '20px' }}
                            variant="h5"
                        >
                            Delete
                        </Typography>
                        <Typography
                            sx={{ marginBottom: '25px' }}
                        >
                            Are you sure you want to permanently delete these tickets?
                        </Typography>
                        <FlexDiv>
                            <SmallButton
                                variant="contained"
                                color="error"
                                onClick={this.deleteTickets}
                            >
                                Delete
                            </SmallButton>
                            <SmallButton
                                variant="outlined"
                                onClick={() => this.setState({ deleteOpen: false })}
                            >
                                Cancel
                            </SmallButton>
                        </FlexDiv>
                    </ModalBody>
                </Modal>
            </Body>
        )
    }
}

const mapStateToProps = (state) => ({
    project: state.project.data,
});

const mapDispatchToProps = (dispatch) => ({
    dispatchRestoreTickets: (id: string, ticketNumbers: number[]) => dispatch(restoreTickets(id, ticketNumbers)),
    dispatchFetchArchivedTickets: (id: string) => dispatch(fetchArchivedTickets(id)),
    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean) => dispatch(setArchivedTickets(id, ticketNumbers, archived)),
    dispatchDeleteTickets: (id: string, ticketNumbers: number[]) => dispatch(deleteTickets(id, ticketNumbers))
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(withRouter(ArchivedTicketsBody));