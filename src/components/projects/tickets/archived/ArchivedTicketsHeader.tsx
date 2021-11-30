import React from 'react';
import NextLink from 'next/link';

import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    styled,
    alpha
} from '@mui/material/styles';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography } from '@mui/material';

const HeadingDiv = styled('div')(({ theme }) => ({
    marginTop: '50px',
}));

const LinkDiv = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    textDecoration: 'underline'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

type ArchivedTicketsHeaderProps = {
    project: any;
    user: any;
};

type ArchivedTicketsHeaderState = {

};

class ArchivedTicketsHeader extends React.Component<ArchivedTicketsHeaderProps, ArchivedTicketsHeaderState> {
    constructor(props) {
        super(props);
    }

    render() {
        const { project } = this.props;

        return (
            <HeadingDiv>
                <Breadcrumbs>
                    <NextLink
                        shallow
                        href="/projects"
                    >
                        <LinkDiv>
                            Projects
                        </LinkDiv>
                    </NextLink>
                    <NextLink
                        shallow
                        href={`/projects/${project.id}`}
                    >
                        <LinkDiv>
                            {project.name}
                        </LinkDiv>
                    </NextLink>
                    <LinkDiv>
                        Archived
                    </LinkDiv>
                </Breadcrumbs>
                <Typography
                    variant="h1"
                    sx={{ marginTop: '30px' }}
                >
                    Archived Tickets
                </Typography>
            </HeadingDiv>
        )
    }
}

const mapStateToProps = (state) => ({
    project: state.project.data,
    user: state.user.data
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(ArchivedTicketsHeader);