import * as base32 from "hi-base32";
// import createHmac from "crypto-browserify";

// export function hmac_sha_1(secret: string, counter: number) {
//     // Counter should be 8-byte value, according to spec
//     const buffer = new ArrayBuffer(8);
//     const view = new DataView(buffer);
//
//     view.setUint32(4, counter)
//     return createHmac("sha1", secret)
//         .update(view)
//         .digest()
// }
//
// export function hotp(secret: string, counter: number, digits = 6) {
//     const hmacResult = hmac_sha_1(secret, counter)
//
//     var enc = new TextEncoder();
//
//     window.crypto.subtle.sign("HMAC", )
//     // From https://datatracker.ietf.org/doc/html/rfc4226#section-5.4
//     const offset = hmacResult[19] & 0xf
//     const dynamicBinaryCode = (hmacResult[offset] & 0x7f) << 24
//         | (hmacResult[offset + 1] & 0xff) << 16
//         | (hmacResult[offset + 2] & 0xff) << 8
//         | (hmacResult[offset + 3] & 0xff);
//
//     return dynamicBinaryCode % (10 ** digits)
// }

export async function hotp2(secret: string, counter: number, digits = 6) {
    // const buff = Buffer.from(secret, "utf-8");
    const key = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        {name: "HMAC", hash: "SHA-1"},
        true,
        ["sign", "verify"])

    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);

    view.setUint32(4, counter)

    const hmacResult = await window.crypto.subtle.sign("HMAC", key, view)
    // const hmacResult = hmac_sha_1(secret, counter)


    const hmacResult2 = new Uint8Array(hmacResult);
    console.log(hmacResult2)

    // // From https://datatracker.ietf.org/doc/html/rfc4226#section-5.4
    const offset = hmacResult2[19] & 0xf
    const dynamicBinaryCode = (hmacResult2[offset] & 0x7f) << 24
        | (hmacResult2[offset + 1] & 0xff) << 16
        | (hmacResult2[offset + 2] & 0xff) << 8
        | (hmacResult2[offset + 3] & 0xff);
    //
    return dynamicBinaryCode % (10 ** digits)
}


export const counterFromDate = (now: number, time_step = 30) => {
    return Math.trunc(now / (time_step * 1000));
}


// export function totp(secret: string, time_step = 30, digits = 6) {
//     const counter = counterFromDate(Date.now(), time_step)
//     return hotp(secret, counter, digits)
// }

export async function totp2(secret: string, time_step = 30, digits = 6) {
    const counter = counterFromDate(Date.now(), time_step)
    return hotp2(secret, counter, digits)
}

export function generate_url(issuer: string, user: string, secret: string) {
    const secretEncoded = base32.encode(secret)
    return `otpauth://totp/${issuer}:${user}?secret=${secretEncoded}&issuer=${issuer}`;
}
