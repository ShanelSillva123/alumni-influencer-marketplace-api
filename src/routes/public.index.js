const express = require("express");
const router = express.Router();

const publicRoutes = require("./public.routes");

router.use("/", publicRoutes);

module.exports = router;