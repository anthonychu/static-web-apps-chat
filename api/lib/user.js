module.exports = {
    getUser(headers) {
        if (process.env.AZURE_FUNCTIONS_ENVIRONMENT === 'Development') {
            return {
                identityProvider: 'github',
                userId: '583231',
                userDetails: 'octocat',
                userRoles: ['admin', 'anonymous'],
            };
        }

        const clientPrincipalHeader = headers['x-ms-client-principal'];
        if (!clientPrincipalHeader) {
            return;
        }

        return JSON.parse(Buffer.from(clientPrincipalHeader, 'base64').toString('ascii'));
    }
}