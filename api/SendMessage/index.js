const { getUser } = require('../lib/user');

module.exports = async function (context, req) {
  const sender = getUser(req.headers).userDetails;
  const { text } = req.body;
  const timestamp = new Date();

  const rowKey = new Date('2100-01-01T00:00:00Z').getTime() - new Date().getTime();

  const message = {
    sender,
    text,
    timestamp,
    PartitionKey: '0',
    RowKey: rowKey.toString()
  };

  if (text) {
    context.bindings.history = message;
    return {
      "target": "newMessage",
      "arguments": [ message ]
    };
  }
};