import express from "express";
import { getFilterOptions } from "../controllers/filter.controller.js";

const router = express.Router();

// Get filter options
router.get("/options", getFilterOptions);

export default router;
