import { Router } from "express";
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  bulkUpdateOrder,
} from "../controllers/testimonial.controller.js";
import { verifyAdminJWT } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyAdminJWT);

router.get("/",         getAllTestimonials);
router.post("/",        createTestimonial);
router.put("/reorder",  bulkUpdateOrder);
router.get("/:id",      getTestimonialById);
router.put("/:id",      updateTestimonial);
router.delete("/:id",   deleteTestimonial);

export default router;
