import React from 'react';
import NextLink from 'next/link';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    color: theme.palette.primary.main,
    opacity: 0.8
}));

type AccountTabsProps = {
    selectedTab: number;
}

class AccountTabs extends React.Component<AccountTabsProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { selectedTab } = this.props;

        return (
            <Box marginTop="30px" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={selectedTab}
                >
                    <NextLink href="/account">
                        <StyledTab label="General" value={0} />
                    </NextLink>
                    <NextLink href="/account/billing">
                        <StyledTab label="Billing" value={1} />
                    </NextLink>
                    <NextLink href="/account/security">
                        <StyledTab label="Security" value={2} />
                    </NextLink>
                </Tabs>
            </Box>
        )
    }
}

export default AccountTabs;