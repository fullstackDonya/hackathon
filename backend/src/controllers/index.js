class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the Node.js backend!');
    }
}

module.exports = IndexController;