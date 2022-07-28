import './App.css'
import {Affix, MantineProvider, Portal, Space, Stack, TextInput} from "@mantine/core";
import {useForm} from '@mantine/form';
import {generate_url} from "./totp/totp";
import {VerifyOTP} from "./components/VerifyOTP";
import {EnrollDevice} from "./components/EnrollDevice";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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
    const url = generate_url(issuer, user, secret)

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <Portal>
                    <Affix position={{bottom: -20}}
                           sx={{width: "250px", border: "2px solid black", borderRadius: "10px", padding: "30px"}}>
                        <TextInput label="Issuer" {...getInputProps('issuer')} />
                        <TextInput label="User" {...getInputProps('user')}/>
                        <TextInput label="Secret" {...getInputProps('secret')}/>
                    </Affix>
                </Portal>
                <Stack align="center">
                    <EnrollDevice url={url}/>
                    <Space h="xl"/>
                    <VerifyOTP secret={secret}/>
                </Stack>

            </MantineProvider>

        </QueryClientProvider>
    )
}

export default App
