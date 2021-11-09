import React from 'react';
import { withRouter } from 'next/router';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    styled
} from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoutIcon from '@mui/icons-material/Logout';

const Root = styled('div')(({ theme }: any) => ({
    width: '250px',
    borderRight: `1px solid ${theme.palette.grey['200']}`,
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.light,
    position: 'sticky'
}));

const Subtitle: typeof Typography = styled(Typography)(({ theme }) => ({
    marginTop: '30px !important',
    fontWeight: 600,
    paddingLeft: '25px',
}));

const SelectedListItem = styled(ListItemIcon)(({ theme }) => ({
    width: '2px',
    minWidth: '2px !important',
    height: '50px',
    backgroundColor: theme.palette.primary.main,
    // marginRight: '25px'
}));

const TicketLabel: typeof Typography = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.subtitle2.fontSize,
    color: theme.palette.text.secondary
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

type SidebarProps = {
    user: any;
    project: any;
}

class Sidebar extends React.Component<SidebarProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { user, project } = this.props;
        return (
            <Root>
                <Subtitle
                    variant="caption"
                    component="div"
                >
                    PROJECTS
                </Subtitle>
                <MenuList>
                    { user.projects.map((projectItem, i) => (
                        <MenuItem key={i} sx={{
                            padding: 0,
                            height: '50px'
                        }}>
                            { project.id === projectItem.id && <SelectedListItem/> }
                            <ListItemText sx={{
                                paddingLeft: project.id === projectItem.id ? '23px' : '25px',
                                fontSize: '16px'
                            }}>
                                {projectItem.name}
                            </ListItemText>
                        </MenuItem>
                    )) }
                </MenuList>
                <Subtitle
                    variant="caption"
                    component="div"
                >
                    RECENT
                </Subtitle>
                <MenuList>
                    <MenuItem sx={{
                        padding: 0,
                        height: '50px'
                    }}>
                        <SelectedListItem/>
                        <Box sx={{
                            paddingLeft: '25px',
                            fontSize: '16px'
                        }}>
                            {/* <TicketLabel
                                variant="caption"
                                component="div"
                            >
                                CH-50
                            </TicketLabel> */}
                            <Typography>
                                Yeet
                            </Typography>
                        </Box>
                    </MenuItem>
                </MenuList>
                <FlexGrow/>
                <MenuItem sx={{
                    // padding: 0,
                    height: '50px',
                    borderTop: (theme) => `1px solid ${theme.palette.grey['200']}`
                }}>
                    <ListItemIcon>
                        <LogoutIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText>
                        Logout
                    </ListItemText>
                </MenuItem>
            </Root>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    project: state.project.data
});

export default compose<any>(
    connect(mapStateToProps)
)(withRouter(Sidebar));