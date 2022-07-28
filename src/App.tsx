import './App.css'
import QRCodeSVG from "qrcode.react";
import {Affix, MantineProvider, Portal, Space, Stack, Text, TextInput, Title} from "@mantine/core";
import {useForm} from '@mantine/form';
import {generate_url} from "./totp/totp";
import {VerifyOTP} from "./components/VerifyOTP";
import {EnrollDevice} from "./components/EnrollDevice";


function App() {
    const form = useForm({
        initialValues: {
            issuer: '32 Bytes AB',
            user: 'magnus@wahlstrand.dev',
            secret: "12345678901234567890"
        },
    });

    const url = generate_url(
        form.values.issuer,
        form.values.user,
        form.values.secret)

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Portal>
                <Affix position={{bottom: -20}}
                       sx={{width: "250px", border: "2px solid black", borderRadius: "10px", padding: "30px"}}>
                    <TextInput label="Issuer" {...form.getInputProps('issuer')} />
                    <TextInput label="User" {...form.getInputProps('user')}/>
                    <TextInput label="Secret" {...form.getInputProps('secret')}/>
                </Affix>

            </Portal>
            <Stack align="center">
                <EnrollDevice url={url}/>

                <Space h="xl"/>
                <VerifyOTP/>
            </Stack>

        </MantineProvider>
    )
}

export default App
