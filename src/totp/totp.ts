import * as base32 from "hi-base32";

export async function hotp(secret: string, counter: number, digits = 6) {
    const key = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        {name: "HMAC", hash: "SHA-1"},
        true,
        ["sign", "verify"])

    // Prepare counter value
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint32(4, counter)

    // Create HMAC
    const hmacResult = await window.crypto.subtle.sign("HMAC", key, view)
    const hmacBytes = new Uint8Array(hmacResult);

    // Find offset and BDC
    // // From https://datatracker.ietf.org/doc/html/rfc4226#section-5.4
    const offset = hmacBytes[19] & 0xf
    const dynamicBinaryCode = (hmacBytes[offset] & 0x7f) << 24
        | (hmacBytes[offset + 1] & 0xff) << 16
        | (hmacBytes[offset + 2] & 0xff) << 8
        | (hmacBytes[offset + 3] & 0xff);

    // Truncate
    return (dynamicBinaryCode % (10 ** digits)).toString(10).padStart(6, "0")
}

export const counterFromDate = (now: number, time_step = 30) => {
    return Math.trunc(now / (time_step * 1000));
}

export async function totp(secret: string, time_step = 30, digits = 6) {
    const counter = counterFromDate(Date.now(), time_step)
    return hotp(secret, counter, digits)
}

export function generate_url(issuer: string, user: string, secret: string) {
    const secretEncoded = base32.encode(secret)
    return `otpauth://totp/${issuer}:${user}?secret=${secretEncoded}&issuer=${issuer}`;
}
