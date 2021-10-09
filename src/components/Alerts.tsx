import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { setAlerts } from '../redux/alerts/actions';
import Alert from '@mui/material/Alert';

type Alert = {
    type: 'success' | 'error';
    message: string;
}

type AlertsProps = {
    alerts: Alert[];
    dispatchSetAlerts: (a: any[]) => void;
}

class Alerts extends React.Component<AlertsProps> {
    constructor(props: AlertsProps) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e?: React.SyntheticEvent, reason?: string) {
        const { dispatchSetAlerts } = this.props;
        if (reason === 'clickaway') {
            return;
        }

        dispatchSetAlerts([])
    }

    render() {
        const { alerts, dispatchSetAlerts } = this.props;
        return alerts.map((alert, i) => (
            <Snackbar
                key={i}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={Boolean(alert)}
                onClose={this.handleClose}
            >
                <Alert severity={alert.type} onClose={this.handleClose} elevation={6} variant="filled">
                    {alert.message}
                </Alert>
            </Snackbar>
        ))
    }
}

const mapStateToProps = (state: any) => ({
    alerts: state.alerts
});

const mapDispatchToProps = (dispatch: any) => ({
    dispatchSetAlerts: (values: Alert[]) => dispatch(setAlerts(values))
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(Alerts);