
const current = async (req, res) => {
    res.sendSuccess(req.user); 
};

export { current }