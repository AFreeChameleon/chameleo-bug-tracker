import React from 'react';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setAlerts } from '../../redux/alerts/actions';
import { setTicketFilterOwners } from '../../redux/ticket-filters/actions';
import { fetchProjectDetails } from '../../redux/project/actions';

import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { styled, alpha } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';

const ModalCard = styled(Box)(({ theme }) => ({
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    outline: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '20px 30px'
}));

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

type ProjectFiltersProps = {
    user: any;
    project: any;
    ticketFilter: any;

    dispatchSetTicketFilterOwners: (values: any[]) => void;
    dispatchFetchProjectDetails: (id: string) => void;
    dispatchSetAlerts: (value: any) => void;
}

type ProjectFiltersState = {
    addTagModalOpen: boolean;
    newTagValue: string;
};

class ProjectFilters extends React.Component<ProjectFiltersProps, ProjectFiltersState> {
    constructor(props) {
        super(props);

        this.changeUserFilter = this.changeUserFilter.bind(this);
        this.removeUserFromFilter = this.removeUserFromFilter.bind(this);
        this.addUserToFilter = this.addUserToFilter.bind(this);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);

        this.state = {
            addTagModalOpen: false,
            newTagValue: ''
        };
    }

    removeUserFromFilter(user) {
        const { 
            ticketFilter,
            dispatchSetTicketFilterOwners 
        } = this.props;

        dispatchSetTicketFilterOwners([ ...ticketFilter.owners.filter(o => o.user.email !== user.email) ]);
    }

    addUserToFilter(user) {
        const { 
            ticketFilter,
            dispatchSetTicketFilterOwners 
        } = this.props;

        if (ticketFilter.owners.filter(o => o.user.email === user.email).length === 0) {
            dispatchSetTicketFilterOwners([ ...ticketFilter.owners, {user: user} ]);
        }
    }

    changeUserFilter(...args) {
        const { 
            ticketFilter,
            dispatchSetTicketFilterOwners 
        } = this.props;
        const action = args[2];
        
        switch (action) {
            case 'clear':
                dispatchSetTicketFilterOwners([]);
                return;
            case 'removeOption':
                this.removeUserFromFilter(args[args.length - 1] && args[args.length - 1].option.user);
                return;
            case 'selectOption':
                this.addUserToFilter(args[args.length - 1] && args[args.length - 1].option.user);
                return;
            default:
                return;
        }
    }

    addTag() {
        const { project, ticketFilter, dispatchFetchProjectDetails, dispatchSetAlerts } = this.props;
        const { 
            addTagModalOpen,
            newTagValue 
        } = this.state;

        axios.post(`/api/project/${project.id}/tag/new`, {
            name: newTagValue,
        }, { withCredentials: true })
        .then((res) => {
            console.log(res.data);
            dispatchFetchProjectDetails(project.id);
        })
        .catch((err) => {
            if (err.response) {
                dispatchSetAlerts([ ...err.response.data.errors.map((message) => ({
                    type: "error",
                    message: message
                })) ]);
            } else {
                dispatchSetAlerts([ { type: 'error', message: 'An error occurred while creating your tag, please try again later.' } ]);
            }
        });

        this.setState({ addTagModalOpen: false });
    }

    removeTag(tag) {
        const { project, ticketFilter, dispatchFetchProjectDetails, dispatchSetAlerts } = this.props;
        const { 
            addTagModalOpen,
            newTagValue 
        } = this.state;

        axios.post(`/api/project/${project.id}/tag/destroy`, {
            name: tag.name,
        }, { withCredentials: true })
        .then((res) => {
            console.log(res.data);
            dispatchFetchProjectDetails(project.id);
        })
        .catch((err) => {
            if (err.response) {
                dispatchSetAlerts([ ...err.response.data.errors.map((message) => ({
                    type: "error",
                    message: message
                })) ]);
            } else {
                dispatchSetAlerts([ { type: 'error', message: 'An error occurred while creating your tag, please try again later.' } ]);
            }
        });

        this.setState({ addTagModalOpen: false });
    }

    render() {
        const { project, ticketFilter } = this.props;
        const { 
            addTagModalOpen,
            newTagValue 
        } = this.state;

        console.log(project);

        return (
            <Box>
                <Modal
                    open={addTagModalOpen}
                    onClose={() => this.setState({ addTagModalOpen: false })}
                >
                    <ModalCard>
                        <Typography variant="h5">
                            Add new tag
                        </Typography>
                        <Box marginTop="10px">
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Tag name"
                                value={newTagValue}
                                onChange={(e) => this.setState({ newTagValue: e.target.value })}
                            />
                        </Box>
                        <Box display="flex" columnGap="10px" marginTop="20px">
                            <Button variant="contained" sx={{ textTransform: 'none' }} onClick={this.addTag}>
                                Add
                            </Button>
                            <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={() => this.setState({ addTagModalOpen: false })}>
                                Cancel
                            </Button>
                        </Box>
                    </ModalCard>
                </Modal>
                <Box display="flex" columnGap="20px">
                    <OutlinedInput size="small" placeholder="Search..." endAdornment={<SearchIcon />} />
                    <Autocomplete
                        multiple
                        limitTags={2}
                        value={ticketFilter.owners}
                        options={project.users || []}
                        getOptionLabel={(option) => `${option.user.firstName} ${option.user.lastName}`}
                        onChange={this.changeUserFilter}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                placeholder="Filter by user"
                                size="small"
                            />
                        )}
                        style={{ width: '240px' }}
                    />
                </Box>
                <Box display="flex" columnGap="10px" alignItems="center" marginTop="20px">
                    { project.tags.length > 0 && (
                        <Typography>
                            Tags:
                        </Typography>
                    )}
                    { project.tags.map((tag, i) => (
                        <Chip
                            key={i}
                            label={tag.name}
                            onDelete={() => this.removeTag(tag)}
                        />
                    )) }
                    <Link 
                        variant="body2"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => this.setState({ addTagModalOpen: true })}
                    >
                        Add new tag
                    </Link>
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    project: state.project.data,
    ticketFilter: state.ticketFilter
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (values: any[]) => dispatch(setAlerts(values)),
    dispatchSetTicketFilterOwners: (values: any[]) => dispatch(setTicketFilterOwners(values)),
    dispatchFetchProjectDetails: (id: string) => dispatch(fetchProjectDetails(id))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(ProjectFilters);