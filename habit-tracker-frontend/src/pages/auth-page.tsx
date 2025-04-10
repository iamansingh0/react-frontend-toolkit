import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react'
import LoginForm from '../components/login-form';
import RegisterForm from '../components/register-form';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

const AuthPage = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const switchToLogin = () => {
        setTabValue(0);
    };
    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Habit Tracker
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                    Track and build better habits
                </Typography>
            </Box>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="auth tabs"
                        centered
                    >
                        <Tab label="Login" id="auth-tab-0" />
                        <Tab label="Register" id="auth-tab-1" />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <LoginForm />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <RegisterForm onSuccess={switchToLogin} />
                </TabPanel>
            </Box>
        </Container>
    )
}

export default AuthPage