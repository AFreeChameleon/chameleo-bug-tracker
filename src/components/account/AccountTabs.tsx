import React from 'react';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none'
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
                    <StyledTab label="General" value={0} />
                    <StyledTab label="Billing" value={1} />
                    <StyledTab label="Security" value={2} />
                </Tabs>
            </Box>
        )
    }
}

export default AccountTabs;