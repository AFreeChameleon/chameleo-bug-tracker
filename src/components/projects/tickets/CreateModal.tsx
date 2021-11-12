import React from 'react';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { styled, alpha } from '@mui/system';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { setAlerts } from '../../../redux/alerts/actions';
import { fetchProjectDetails } from '../../../redux/project/actions';

import {
    validateTime
} from '../../../lib/ticket';

const filter = createFilterOptions<any>();

type CreateModalProps = {
    open: boolean;
    onClose: () => void;
    user: any;
    project: any;
    dispatchSetAlerts: (value: any) => void;
    dispatchFetchProjectDetails: (id: string) => void;
}

type CreateModalState = {
    ticket: any;
    attachments: any[];
}

const ModalBody = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    padding: '20px'
}));

const GridBody = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'auto 300px',
    columnGap: '20px'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const SmallButton = styled(Button)(({ theme }) => ({
    width: '100px'
}));

const NoArrowAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-endAdornment': {
        display: 'none'
    }
}));

const AttachmentContainer = styled('div')(({ theme }) => ({
    height: '100px',
    width: '100px',
    boxShadow: theme.shadows[2],
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
}));

const AttachmentDescription = styled(Typography)(({ theme }) => ({
    width: '100%',
    backgroundColor: alpha(theme.palette.primary.main, 0.7),
    padding: '2px 5px',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
    }
}));

const AttachmentClose = styled('div')(({ theme }) => ({
    textAlign: 'right',
    width: '100%'
}));

class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
    constructor(props) {
        super(props);

        this.createTicket = this.createTicket.bind(this);
        this.addAttachment = this.addAttachment.bind(this);
        this.submitNewTicket = this.submitNewTicket.bind(this);
        this.createNewTag = this.createNewTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.state = {
            ticket: {
                name: '',
                description: '',
                status: this.props.project.details.columnOrder[0] || 0,
                priority: 2,
                tags: [],
                assignedTo: '',
                estimate: ''
            },
            attachments: [],
        }
    }

    async createTicket(e) {
        const { onClose, project, user, dispatchSetAlerts, dispatchFetchProjectDetails } = this.props;
        const { ticket, attachments } = this.state;
        if (!Boolean(ticket.name)) {
            dispatchSetAlerts([ {
                type: 'error',
                message: 'Name is required.'
            } ]);
            return;
        } else {
            let formData = new FormData();
            const jsonData = {
                name: ticket.name,
                description: ticket.description,
                tags: [],
                status: ticket.status,
                priority: ticket.priority,
                assignedTo: ticket.assignedTo,
                estimate: ticket.estimate,
                // attachments: attachments.map((a) => a.file)
            }
            console.log(ticket.status)
            for (const key in jsonData) {
                formData.append(key, jsonData[key])
            }
            for (const attachment of attachments) {
                formData.append('attachments', attachment.file, attachment.name);
            }
            const res = await axios.post(`/api/project/${project.id}/ticket/new`, formData, { withCredentials: true, headers: {
                'Content-Type': 'multipart/form-data'
            } });
            console.log(res)
            dispatchFetchProjectDetails(project.id);
            onClose();
        }
    }

    async createNewTag(value) {
        console.log(value)
        const { project, dispatchSetAlerts } = this.props;
        const { ticket, attachments } = this.state;
        // console.log(e.target.value)
        if (!ticket.tags.includes(value)) {
            console.log(ticket)
            axios.post(`/api/project/${project.id}/tag/new`, {
                name: value,
            }, { withCredentials: true })
            .then((res) => {
                console.log(res.data)
                this.setState({ 
                    ticket: {
                        ...ticket,
                        tags: [ ...ticket.tags, {
                            name: res.data.name
                        } ]
                    }
                });
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
        } else {
            dispatchSetAlerts([ { type: 'error', message: 'Tag already exists.' } ]);
        }
    }

    addTag(e, value, reason) {
        const { ticket } = this.state;
        console.log(e, value, reason)
        if (value[0].create || reason === 'createOption') {
            this.createNewTag(value[0].inputValue);
        } else {
            this.setState({ 
                ticket: {
                    ...ticket,
                    tags: [ ...ticket.tags, {
                        name: value[0].inputValue || value[0]
                    } ]
                }
            });
        }
    }

    addAttachment(e) {
        const { attachments } = this.state;
        console.log(e.target.files)
        this.setState({
            attachments: [...attachments, ...Array.from(e.target.files).map((file, i) => ({
                id: attachments.length + i,
                data: URL.createObjectURL(file),
                file: file
            }))]
        })
    }

    submitNewTicket(e) {
        e.preventDefault();
        const { dispatchSetAlerts } = this.props;
        const { ticket } = this.state;
        const validEstimate = validateTime(ticket.estimate);
        if (!validEstimate && ticket.estimate !== '') {
            dispatchSetAlerts([ {type: 'error', message: 'Estimate not correct format: 10m, 1h, 12d, 14w, 1m and 1y are examples of what can be accepted. '} ])
        }
        this.createTicket(e);
    }

    render() {
        const { open, onClose, user, project } = this.props;
        const { ticket, attachments } = this.state;
        return (project && project.user) ? (
            <Modal
                open={open}
                onClose={onClose}
            >
                <ModalBody>
                    <Typography
                        gutterBottom
                        variant="h5"
                    >
                        New ticket
                    </Typography>
                    <form action="" method="POST" onSubmit={this.submitNewTicket}>
                        <GridBody>
                            <div>
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="standard"
                                        value={ticket.name}
                                        onChange={(e) => this.setState({
                                            ticket: {
                                                ...ticket,
                                                name: e.target.value
                                            }
                                        })}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        label="Description"
                                        variant="outlined"
                                        value={ticket.description}
                                        onChange={(e) => this.setState({
                                            ticket: {
                                                ...ticket,
                                                description: e.target.value
                                            }
                                        })}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        Attachments
                                    </Typography>
                                    <FlexDiv
                                        sx={{
                                            justifyContent: 'normal',
                                            columnGap: '10px'
                                        }}
                                    >
                                        { attachments.map((a, i) => (
                                            <AttachmentContainer
                                                key={a.id}
                                                sx={{
                                                    backgroundImage: `url('${a.data}')`,
                                                }}
                                            >
                                                <AttachmentClose sx={{ height: '100%', backgroundColor: 'rgb(0, 0, 0, 0.3)' }}>
                                                    <CloseIcon 
                                                        fontSize="small" 
                                                        sx={{
                                                            fill: (theme) => theme.palette.error.main
                                                        }}
                                                        onClick={(e) => this.setState({
                                                            attachments: [ ...attachments.filter(attachment => attachment.id !== a.id) ]
                                                        })}
                                                    />
                                                </AttachmentClose>
                                                <AttachmentDescription
                                                    variant="caption"
                                                    color="white"
                                                    noWrap
                                                >
                                                    {a.file.name}
                                                </AttachmentDescription>
                                            </AttachmentContainer>
                                        )) }
                                    </FlexDiv>
                                    <label htmlFor="new-ticket-upload-button" style={{ width: 'fit-content' }}>
                                        <input 
                                            type="file"
                                            accept="*/*"
                                            style={{ display: 'none' }} 
                                            id="new-ticket-upload-button"
                                            onChange={this.addAttachment}
                                            multiple
                                            name="new-ticket-upload-button"
                                        />
                                        <IconButton color="primary" component="span" size="small">
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </label>
                                    <SmallButton
                                        variant="contained"
                                        onClick={this.createTicket}
                                    >
                                        CREATE
                                    </SmallButton>
                                </Stack>
                            </div>
                            <div>
                                <Stack spacing={2} sx={{marginTop: '45px'}}>
                                    {/* <Typography
                                        variant="subtitle1"
                                        sx={{
                                            marginTop: '2px'
                                        }}
                                    >
                                        {project.name}
                                    </Typography> */}
                                    <Paper variant="outlined" sx={{
                                        padding: '10px'
                                    }}>
                                        <Stack spacing={2}>
                                            <FlexDiv>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    Status:
                                                </Typography>
                                                <Select
                                                    variant="standard"
                                                    size="small"
                                                    fullWidth
                                                    value={ticket.status}
                                                    onChange={(e) => this.setState({
                                                        ticket: {
                                                            ...ticket,
                                                            status: e.target.value
                                                        }
                                                    })}
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    {project.details.columnOrder.map((colId, i) => (
                                                       <MenuItem value={colId} key={colId}>{project.details.columns[colId].name}</MenuItem> 
                                                    ))}
                                                </Select>
                                            </FlexDiv>
                                            <FlexDiv>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    Priority:
                                                </Typography>
                                                <Select
                                                    variant="standard"
                                                    size="small"
                                                    fullWidth
                                                    value={ticket.priority}
                                                    onChange={(e) => this.setState({
                                                        ticket: {
                                                            ...ticket,
                                                            priority: e.target.value
                                                        }
                                                    })}
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    <MenuItem value={0}>Critical</MenuItem>
                                                    <MenuItem value={1}>High</MenuItem>
                                                    <MenuItem value={2}>Medium</MenuItem>
                                                    <MenuItem value={3}>Low</MenuItem>
                                                </Select>
                                            </FlexDiv>
                                            <FlexDiv>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    Tags:
                                                </Typography>
                                                <NoArrowAutocomplete
                                                    multiple
                                                    fullWidth
                                                    freeSolo
                                                    selectOnFocus
                                                    clearOnBlur
                                                    handleHomeEndKeys
                                                    size="small"
                                                    value={ticket.tags}
                                                    options={project.tags}
                                                    onChange={this.addTag}
                                                    getOptionLabel={(option: any) => {
                                                        // Value selected with enter, right from the input
                                                        if (typeof option === 'string') {
                                                          return option;
                                                        }
                                                        // Add "xxx" option created dynamically
                                                        if (option.inputValue) {
                                                          return option.inputValue;
                                                        }
                                                        // Regular option
                                                        return option.name;
                                                    }}
                                                    filterOptions={(options: any, params) => {
                                                        const { inputValue } = params;
                                                        const filtered = filter(options, params);
                                                        
                                                        // Suggest the creation of a new value
                                                        const isExisting = options.some((option) => inputValue === option.name);
                                                        if (inputValue !== '' && !isExisting) {
                                                            filtered.push({
                                                                inputValue,
                                                                name: `Create "${inputValue}"`,
                                                                create: true
                                                            });
                                                        }
                                                
                                                        return filtered;
                                                    }}
                                                    renderOption={(props, option: any) => <li {...props}>{option.name}</li>}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                        />
                                                    )}
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                />
                                            </FlexDiv>
                                            <FlexDiv>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    Estimate:
                                                </Typography>
                                                <TextField
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                    fullWidth
                                                    variant="standard"
                                                    value={ticket.estimate}
                                                    onChange={(e) => this.setState({
                                                        ticket: {
                                                            ...ticket,
                                                            estimate: e.target.value
                                                        }
                                                    })}
                                                />
                                            </FlexDiv>
                                            <FlexDiv>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    Assigned To:
                                                </Typography>
                                                <NoArrowAutocomplete
                                                    fullWidth
                                                    size="small"
                                                    defaultValue={`${project.user.firstName} ${project.user.lastName}`}
                                                    options={[]}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                        />
                                                    )}
                                                    sx={{
                                                        width: '50%'
                                                    }}
                                                />
                                            </FlexDiv>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </div>
                        </GridBody>
                    </form>
                </ModalBody>
            </Modal>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    project: state.project.data
})

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (value: any[]) => dispatch(setAlerts(value)),
    dispatchFetchProjectDetails: (id: string) => dispatch(fetchProjectDetails(id))
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateModal);