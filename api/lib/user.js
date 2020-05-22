module.exports = {
    getUsername(headers) {
        if (process.env.AZURE_FUNCTIONS_ENVIRONMENT === 'Development') {
            return 'test-user';
        }

        const clientPrincipalHeader = req.headers["x-ms-client-principal"];
        if (!clientPrincipalHeader) {
            return;
        }

        const user = JSON.parse(Buffer.from(clientPrincipalHeader, 'base64').toString('ascii'));
        return user.userDetails;
    }
}