import './App.css'
import {Box, Center, Chip, Group, MantineProvider, Modal, Space, Stack, TextInput,Grid} from "@mantine/core";

import {useForm} from '@mantine/form';
import {encodeSecretAndGenerateURL} from "./totp/totp";
import {VerifyOTP} from "./components/VerifyOTP";
import {EnrollDevice} from "./components/EnrollDevice";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useInterval} from "@mantine/hooks";
import {Copy} from "tabler-icons-react";
import {CopyCodeButton} from "./components/CopyCodeButton";

const queryClient = new QueryClient()

function App() {
    const {values, getInputProps} = useForm({
        initialValues: {
            issuer: '32 Bytes AB',
            user: 'magnus@wahlstrand.dev',
            secret: "12345678901234567890"
        },
    });
    const {issuer, user, secret} = values
    const {url, encodedSecret} = encodeSecretAndGenerateURL(issuer, user, secret)
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
                        <Grid gutter="xs" justify={"space-between"}>
                            <Grid.Col span={11}><TextInput label="Secret (32-bit encoded)" disabled value={encodedSecret}/></Grid.Col>
                            <Grid.Col span={1} pt={32}><CopyCodeButton code={encodedSecret}/></Grid.Col>
                        </Grid>

                        <Center>
                            <Box sx={{visibility: milliseconds >= 0 ? "visible" : "hidden"}} mt="md">
                                <Chip color="teal" variant="filled" radius="sm" checked>QR Code updated</Chip>
                            </Box>
                        </Center>
                    </form>
                </Modal>
                <Stack align="center">
                    <EnrollDevice url={url} encodedSecret={encodedSecret} onEditClicked={() => setOpened(true)}/>
                    <Space h="xl"/>
                    <VerifyOTP secret={secret}/>
                </Stack>
            </MantineProvider>

        </QueryClientProvider>
    )
}

export default App;
