"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const port = process.env.PORT || 3000;
const baseUrl = `https://localhost:${port}`;
const keys = require("./kyes");
exports.default = {
    JTWSecretPivate: "mySecrtt",
    baseUrl: baseUrl,
    secretSession: "mySuberSecret",
    secreteKeyStripe: "sk_test_51IagleAfXdjHojpn4uKEvYySsIrDbh41FVSzAGI6UHzsyzPuZFiAmgkNHhBPholRClYswd6mRQBzPpCBN6KYG5wW00ZC1BN7bW",
    URL: `http//:localhost:${port}`,
    secretPassword: "DGYUHNJLORFF^$**^LVG:LFG++GKCFGW##WDGLKGL",
    secretToken: "DGYUHNJLORFF^$**^LVG:LFG++GKCFGW##W%$#$#FFF",
    apiKey: "f4a7b661d3c1cb84b5dd05768381413f-c4d287b4-527003ab",
    DOMAIN: "sandbox6fc20806f3ab479e95064c921add7e7d.mailgun.org",
    port: port,
    GEOCODER_PROVIDER: 'mapquest',
    GEOCODER_API_KEY: 'eNVkyidlqPESQLhGSa9B2Z8JfDGcWKmG',
    oauth2Credentials: {
        clinteId: keys.web.client_id,
        projectId: keys.web.project_id,
        authUri: keys.web.auth_uri,
        tockenUri: keys.web.token_uri,
        auth_provider_x509_cert_url: keys.web.auth_provider_x509_cert_url,
        client_secret: keys.web.client_secret,
        redirect_uris: [keys.web.redirect_uris[0]],
        scopes: [
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtube.force-ssl ",
        ],
    },
};
//# sourceMappingURL=config.js.map