module.exports = async function (context, req) {
  const sender = (process.env.AZURE_FUNCTIONS_ENVIRONMENT === 'Development') ? 
    'test-user' : req.headers['x-ms-client-principal-name'];
  const { text } = req.body;
  if (text) {
    return {
      "target": "newMessage",
      "arguments": [{ sender, text }]
    };
  }
};