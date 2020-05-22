const { getUsername } = require('../lib/user');

module.exports = async function (context, req) {
  const sender = getUsername(req.headers);
  const { text } = req.body;
  if (text) {
    return {
      "target": "newMessage",
      "arguments": [{ sender, text }]
    };
  }
};