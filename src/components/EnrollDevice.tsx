import {ActionIcon, Box, Group, Stack, Text, Title, Tooltip} from "@mantine/core";
import {useClipboard} from "@mantine/hooks";
import QRCodeSVG from "qrcode.react";
import {Copy, Edit} from "tabler-icons-react";

export function CopyCodeButton(props: { code: string }) {
    const clipboard = useClipboard({timeout: 500});
    return (
        <Tooltip label="Copy the secret code to enter manually to your app.">
            <ActionIcon
                color={'gray'}
                variant={clipboard.copied ? 'filled' : 'subtle'}
                onClick={() => clipboard.copy(props.code)}>
                <Copy/>
            </ActionIcon>
        </Tooltip>)
}

export function EditButton(props: { onClick: () => void }) {
    return (
        <Tooltip label="Copy the secret code to enter manually to your app.">
            <ActionIcon
                color={'gray'}
                onClick={props.onClick}
            >
                <Edit/>
            </ActionIcon>
        </Tooltip>)
}


export function EnrollDevice(props: { url: string, code: string, onEditClicked: () => void }) {
    return (
        <>
            <Stack>
                <Title order={4}>1. Scan QR code with Authenticator app</Title>
                <Text size={"sm"} pb="lg">works with Authy, Microsoft Authenticator and Google Authenticator</Text>
                <Group position={"center"}>
                    <Box ml={44}>
                        <QRCodeSVG value={props.url}/>
                    </Box>
                    <Stack>
                        <EditButton onClick={props.onEditClicked}/>
                        <CopyCodeButton code={props.code}/>
                    </Stack>
                </Group>
            </Stack>
        </>
    )
}
