import {useClipboard} from "@mantine/hooks";
import {ActionIcon, Tooltip} from "@mantine/core";
import {Copy} from "tabler-icons-react";

export function CopyCodeButton(props: { code: string }) {
    const clipboard = useClipboard({timeout: 500});
    return (
        <Tooltip label="Copy the secret code (32 bit encoded) to enter manually to your app.">
            <ActionIcon
                color={'gray'}
                variant={clipboard.copied ? 'filled' : 'subtle'}
                onClick={() => clipboard.copy(props.code)}>
                <Copy/>
            </ActionIcon>
        </Tooltip>)
}
