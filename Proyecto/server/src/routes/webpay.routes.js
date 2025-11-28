const {Router} = require("express");
const { createTransaction, commitTransaction } = require("../controllers/webpay.controller");

const router = Router();

router.post("/api/webpay/create", (req, res) => {
    createTransaction(req, res);
});

router.post("/api/webpay/commit", (req,res) =>{
    commitTransaction(req, res);
});

module.exports = router;