module.exports = async function (context, req) {
    context.res.json(req.headers);
};