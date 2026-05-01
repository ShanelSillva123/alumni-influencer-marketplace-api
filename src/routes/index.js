const express = require("express");

const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const degreeRoutes = require("./degree.routes");
const employmentRoutes = require("./employment.routes");
const certificationRoutes = require("./certification.routes");
const courseRoutes = require("./course.routes");
const licenceRoutes = require("./licence.routes"); // ✅ ADD THIS
const biddingRoutes = require("./bidding.routes");
const notificationRoutes = require("./notification.routes");
const analyticsRoutes = require("./analytics.routes");
const adminRoutes = require("./admin.routes");
const apiKeyRoutes = require("./apiKey.routes");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API healthy",
    });
});

// Routes
router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/degrees", degreeRoutes);
router.use("/employment", employmentRoutes);
router.use("/certifications", certificationRoutes);
router.use("/courses", courseRoutes);
router.use("/licences", licenceRoutes); // ✅ ADD THIS LINE
router.use("/bids", biddingRoutes);
router.use("/notifications", notificationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admin", adminRoutes);
router.use("/api-keys", apiKeyRoutes);

module.exports = router;