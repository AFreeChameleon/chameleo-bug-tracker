import React from 'react';
import NextLink from 'next/link';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setAlerts } from '../../redux/alerts/actions';
import { fetchUserData } from '../../redux/user/actions';

import { styled, alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';

import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import DestroyProjectModal from './DestroyProjectModal';

type ProjectBodyProps = {
    user: any
}

type ProjectBodyState = {
    creatingProject: boolean;
    anchorEl: any;
    editingProject: any | null;
    destroyProject: any | null;
}

const Root = styled('div')(({ theme }) => ({
    marginTop: '25px'
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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

const SmallButton = styled(Button)(({ theme }) => ({
    width: '150px',
    height: '50px',
    textTransform: 'none',
    fontSize: theme.typography.body2.fontSize,
}));

const ProjectItem = styled(Paper)(({ theme }) => ({
    width: '200px',
    height: '50px',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: '0.25s',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    '&:hover': {
        boxShadow: theme.shadows[3],
    }
}))

class ProjectBody extends React.Component<ProjectBodyProps, ProjectBodyState> {
    constructor(props) {
        super(props);

        this.state = {
            creatingProject: false,
            editingProject: null,
            destroyProject: null,
            anchorEl: null,
        }
    }

    render() {
        const { user, } = this.props;
        const { creatingProject, anchorEl, editingProject, destroyProject } = this.state;
        console.log(editingProject, anchorEl, anchorEl && anchorEl.id)

        return (
            <Root>
                <Box display="flex" columnGap={'25px'} mt={'25px'}>
                    {(user && user.projects) && user.projects.map((project, i) => (
                        <NextLink
                            shallow 
                            key={i}
                            href={`/projects/${project.id}`} 
                        >
                            <ProjectItem key={project.id}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" height="100%">
                                    <Typography
                                        variant="body1"
                                    >
                                        {project.name}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        id={`project-btn-${i}`}
                                        onClick={(e) => {e.preventDefault();this.setState({ anchorEl: e.currentTarget })}}
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                </Box>
                            </ProjectItem>
                        </NextLink>
                    )) }
                    <SmallButton
                        disableElevation
                        variant="outlined"
                        onClick={(e) => this.setState({ creatingProject: true })}
                    >
                        <AddIcon/>
                    </SmallButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => this.setState({ anchorEl: null })}
                        onClick={() => this.setState({ anchorEl: null })}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 22,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {(() => {
                            if (!anchorEl) {
                                return null;
                            }
                            const selectedProject = anchorEl ? user.projects[parseInt(anchorEl.id.split('project-btn-')[1])] : user.projects[0];
                            return [
                                <ListItem key={0}>
                                    <ListItemIcon sx={{  minWidth: 'fit-content' }}>
                                        <Avatar>
                                            {selectedProject.user.firstName.slice(0, 1)}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography noWrap>
                                            Owned by: {`${selectedProject.user.firstName} ${selectedProject.user.lastName}`}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>,
                                <Divider key={1}/>,
                                <MenuItem key={2} onClick={() => {
                                    this.setState({ editingProject: selectedProject })
                                }}>
                                    <ListItemIcon>
                                        <EditIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Edit
                                    </ListItemText>
                                </MenuItem>,
                                <MenuItem key={3} onClick={() => this.setState({
                                    destroyProject: selectedProject
                                })} >
                                    <ListItemIcon>
                                        <DeleteIcon sx={{ fill: (theme) => theme.palette.error.main }} />
                                    </ListItemIcon>
                                    <ListItemText sx={{ color: (theme) => theme.palette.error.main }}>
                                        Destroy
                                    </ListItemText>
                                </MenuItem>
                            ]
                        })()} 
                    </Menu>
                </Box>
                <CreateProjectModal open={creatingProject} onClose={() => this.setState({ creatingProject: false })} />
                <EditProjectModal 
                    open={Boolean(editingProject)} 
                    onClose={() => this.setState({ editingProject: null })} 
                    project={editingProject || {}} 
                    setProject={(key: string, value: any) => this.setState({ editingProject: {
                        ...editingProject,
                        [key]: value
                    } })}
                />
                <DestroyProjectModal open={Boolean(destroyProject)} onClose={() => this.setState({ destroyProject: null })} project={destroyProject || {}} />
            </Root>
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
)(ProjectBody);