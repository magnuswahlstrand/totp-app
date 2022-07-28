import {NumberInput, TextInput, Title, Text, ThemeIcon} from "@mantine/core";
import {useForm} from '@mantine/form';
import {Check, CircleCheck, CircleX, FaceId} from 'tabler-icons-react';
import {totp2} from "../totp/totp";
import {useEffect} from "react";


export function VerifyOTP() {

    const form = useForm({
        initialValues: {
            otp: ''
        },
        validate: {
            otp: (value: string) => (!value || value.length != 6 || !parseInt(value)) ? 'Please enter 6 digits' : null,
        }
    });

    const verifyOTP = (otp: string) => {

    }

    useEffect(() => {
        // declare the data fetching function
        const fetchData = async () => {
            const data = await totp2("12345678901234567890")
            console.log(data)
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, [])

    return (
        <>
            <Title order={4} pb="sm">2. Enter the code 6 digit code from your app</Title>
            <form onSubmit={form.onSubmit((values) => verifyOTP(values.otp))}>
                <TextInput
                    maxLength={6}
                    onChange={() => form.validate()}
                        placeholder="123456"
                    radius="xl"
                    size="xl"
                    pl={"xl"}
                    // hideControls
                    styles={{input: {width: 170, textAlign: 'center'}}}
                    {...form.getInputProps('otp')}
                    icon={<CircleX
                        size={48}
                        strokeWidth={2}
                        color={'#2d8647'}
                    />}
                />


                {
                    // The TextInput label appears if there are errors, and changes the overall layout. This is an ugly work around
                    Object.keys(form.errors).length === 0 ? <Text>&nbsp;</Text> : null
                }

            </form>
        </>
    )
}

// formatter={(value: string) => {
//     return value.replace(/\D/g,'');
// }}
