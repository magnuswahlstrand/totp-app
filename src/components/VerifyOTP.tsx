import {Text, TextInput, Title} from "@mantine/core";
import {useForm} from '@mantine/form';
import {CircleCheck, CircleDashed, CircleX} from 'tabler-icons-react';
import {totp} from "../totp/totp";
import {QueryClient, useQuery, useQueryClient} from "@tanstack/react-query";


export function VerifyOTP(props: { secret: string }) {
    const form = useForm({
        initialValues: {
            otp: ''
        },
        validate: {
            otp: (value: string) => (!value || value.length != 6 || !parseInt(value)) ? 'Please enter 6 digits' : null,
        }
    });

    const verifyOTP = async () => {
        const res = await totp(props.secret)
        console.log(form.values.otp === res)

        return form.values.otp === res
    }

    const {data, refetch, isLoading, isError} = useQuery(["data"], verifyOTP, {
        refetchOnWindowFocus: false,
        enabled: false
    });

    const retriggerVerifyOTP = (otp: string) => {
        console.log(otp)
        refetch();
    }


    const getIcon = () => {
        if (isLoading)
            return <CircleDashed size={48} strokeWidth={2} color={'lightgray'} />
        if (isError || data === false)
            return <CircleX size={48} strokeWidth={2} color={'red'}/>
        return <CircleCheck size={48} strokeWidth={2} color={'#2d8647'}/>
    }

    const icon = getIcon()

    const resetQuery = () => {
        if (typeof data === "boolean") {
            queryClient.resetQueries(['data'])
        }
    }


        const queryClient = useQueryClient()
    return (
        <>
            <Title order={4} pb="sm">2. Enter the code 6 digit code from your app</Title>
            <form
                onSubmit={form.onSubmit((values) => retriggerVerifyOTP(values.otp))}
                onChange={resetQuery}
            >
                <TextInput
                    maxLength={6}
                    onChange={() => {
                        console.log('hej')
                        queryClient.resetQueries(['data'])
                    } }
                    placeholder="123456"
                    radius="xl"
                    size="xl"
                    pl={"xl"}
                    // hideControls
                    styles={{input: {width: 170, textAlign: 'center'}}}
                    {...form.getInputProps('otp')}
                    icon={icon}
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
