import './App.css'
import {MantineProvider, Modal, Space, Stack, TextInput, Notification} from "@mantine/core";
import {NotificationsProvider, showNotification} from '@mantine/notifications';

import {useForm} from '@mantine/form';
import {generate_url} from "./totp/totp";
import {VerifyOTP} from "./components/VerifyOTP";
import {EnrollDevice} from "./components/EnrollDevice";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useInterval} from "@mantine/hooks";

const queryClient = new QueryClient()

function App() {
    const {values, getInputProps} = useForm({
        initialValues: {
            issuer: '32 Bytes AB',
            user: 'magnus@wahlstrand.dev',
            secret: "123456"
        },
    });
    const {issuer, user, secret} = values
    const url = generate_url(issuer, user, secret)
    const [opened, setOpened] = useState(true);


    const [milliseconds, setMillisecondsLeft] = useState(0);

    const interval = useInterval(() => setMillisecondsLeft((s) => s - 100), 100);
    useEffect(() => {
        interval.start();
        return interval.stop;
    }, []);

    // const [state, setState] = useState<null | number>(null);
    const notification = () => {
        showNotification({
            id: 'data-loading',
            color: 'cyan',
            loading: true,
            title: 'Loading your data',
            message: 'Data will be loaded in 3 seconds, you cannot close this yet',
            autoClose: false,
            disallowClose: true,
        })};

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <NotificationsProvider>

                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Update QR code"
                >
                    <form onChange={() => {
                        console.log('udated')
                        setMillisecondsLeft(1500)
                        notification()
                    }}>
                        <TextInput label="Issuer" {...getInputProps('issuer')} />
                        <TextInput label="User" {...getInputProps('user')}/>
                        <TextInput label="Secret" {...getInputProps('secret')}/>
                        {milliseconds >= 0 ? <div>QR code updated    </div> : <div>&nbsp;</div>}
                    </form>

                    <Notification
                        title="QR code updated"
                        disallowClose
                    >
                        Please wait until data is uploaded, you cannot close this notification yet
                    </Notification>
                </Modal>
                {/*<Portal>*/}
                {/*    <Affix position={{right: -20}}*/}
                {/*           sx={{width: "250px", border: "2px solid black", borderRadius: "10px", padding: "30px"}}>*/}
                {/*        */}
                {/*    </Affix>*/}
                {/*</Portal>*/}
                <Stack align="center">
                    <EnrollDevice url={url} code={secret} onEditClicked={() => setOpened(true)}/>
                    <Space h="xl"/>
                    <VerifyOTP secret={secret}/>
                </Stack>
                </NotificationsProvider>
            </MantineProvider>

        </QueryClientProvider>
    )
}

export default App;
