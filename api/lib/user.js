module.exports = {
    getUser(headers) {
        const clientPrincipalHeader = headers['x-ms-client-principal'];
        if (!clientPrincipalHeader) {
            return;
        }

        return JSON.parse(Buffer.from(clientPrincipalHeader, 'base64').toString('ascii'));
    }
}