import express from "express";
import {
    getCoursesByTag,
    getAllCourses,
    getCourseBySlug,
} from "../controllers/course.controller.js";

const router = express.Router();

// Public routes
router.get("/by-tag", getCoursesByTag);
router.get("/", getAllCourses);
router.get("/:slug", getCourseBySlug);

export default router;
