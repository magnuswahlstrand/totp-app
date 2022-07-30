import './App.css'
import {Box, Center, Chip, MantineProvider, Modal, Space, Stack, TextInput} from "@mantine/core";

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
    const [opened, setOpened] = useState(false);


    const [milliseconds, setMillisecondsLeft] = useState(0);

    const interval = useInterval(() => setMillisecondsLeft((s) => s - 100), 100);
    useEffect(() => {
        interval.start();
        return interval.stop;
    }, []);


    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Update QR code"
                >
                    <form onChange={() => {
                        setMillisecondsLeft(1500)
                    }}>
                        <TextInput label="Issuer" {...getInputProps('issuer')} />
                        <TextInput label="User" {...getInputProps('user')}/>
                        <TextInput label="Secret" {...getInputProps('secret')}/>
                        <Center>
                            <Box sx={{visibility: milliseconds >= 0 ? "visible" : "hidden"}} mt="md">
                                <Chip color="teal" variant="filled" radius="sm" checked>QR Code updated</Chip>
                            </Box>
                        </Center>
                    </form>
                </Modal>
                <Stack align="center">
                    <EnrollDevice url={url} code={secret} onEditClicked={() => setOpened(true)}/>
                    <Space h="xl"/>
                    <VerifyOTP secret={secret}/>
                </Stack>
            </MantineProvider>

        </QueryClientProvider>
    )
}

export default App;
