const { getUser } = require('../lib/user');

module.exports = async function (context, req) {
  const sender = getUser(req.headers).userDetails;
  const { text } = req.body;
  const timestamp = new Date();

  const message = {
    sender,
    text,
    timestamp
  };

  if (text) {
    context.bindings.history = message;
    return {
      "target": "newMessage",
      "arguments": [ message ]
    };
  }
};