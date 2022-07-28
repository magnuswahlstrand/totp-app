import {Text, Title} from "@mantine/core";
import QRCodeSVG from "qrcode.react";


export function EnrollDevice(props: { url: string }) {
    return (
        <>
            <Title order={4}>1. Scan QR code with Authenticator app</Title>
            <Text size={"sm"} pb="lg">works with Authy, Microsoft Authenticator and Google Authenticator</Text>
            <QRCodeSVG value={props.url}/>
        </>
    )
}
