const { getUser } = require('../lib/user');

module.exports = async function (context, req) {
  const sender = getUser(req.headers).userDetails;
  const { text } = req.body;
  const timestamp = new Date();
  if (text) {
    return {
      "target": "newMessage",
      "arguments": [{ sender, text, timestamp }]
    };
  }
};