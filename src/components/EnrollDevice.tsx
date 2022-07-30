import {ActionIcon, Box, Group, Stack, Text, Title, Tooltip} from "@mantine/core";
import QRCodeSVG from "qrcode.react";
import {Edit} from "tabler-icons-react";
import {CopyCodeButton} from "./CopyCodeButton";

export function EditButton(props: { onClick: () => void }) {
    return (
        <Tooltip label="Edit QR code issuer, user or code.">
            <ActionIcon
                color={'gray'}
                onClick={props.onClick}
            >
                <Edit/>
            </ActionIcon>
        </Tooltip>)
}


export function EnrollDevice(props: { url: string, encodedSecret: string, onEditClicked: () => void }) {
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
                        <CopyCodeButton code={props.encodedSecret}/>
                    </Stack>
                </Group>
            </Stack>
        </>
    )
}
