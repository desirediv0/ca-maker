import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

// ─── Public ──────────────────────────────────────────────────────────────────

export const getPublishedTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, { testimonials }, "Testimonials fetched successfully"));
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, { testimonials }, "All testimonials fetched"));
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  res
    .status(200)
    .json(new ApiResponsive(200, { testimonial }, "Testimonial fetched"));
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, exam, result, text, rating = 5, isPublished = true } = req.body;

  if (!name || !text) throw new ApiError(400, "Name and testimonial text are required");

  const last = await prisma.testimonial.findFirst({ orderBy: { order: "desc" } });
  const order = last ? last.order + 1 : 1;

  const testimonial = await prisma.testimonial.create({
    data: {
      name,
      role:        role        || null,
      exam:        exam        || null,
      result:      result      || null,
      text,
      rating:      parseInt(rating)  || 5,
      isPublished: Boolean(isPublished),
      order,
    },
  });

  res
    .status(201)
    .json(new ApiResponsive(201, { testimonial }, "Testimonial created successfully"));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, exam, result, text, rating, isPublished, order } = req.body;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Testimonial not found");

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      ...(name        !== undefined && { name }),
      ...(role        !== undefined && { role: role || null }),
      ...(exam        !== undefined && { exam: exam || null }),
      ...(result      !== undefined && { result: result || null }),
      ...(text        !== undefined && { text }),
      ...(rating      !== undefined && { rating: parseInt(rating) }),
      ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      ...(order       !== undefined && { order: parseInt(order) }),
    },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, { testimonial }, "Testimonial updated successfully"));
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Testimonial not found");

  await prisma.testimonial.delete({ where: { id } });

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Testimonial deleted successfully"));
});

export const bulkUpdateOrder = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ id, order }]

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "items array is required");
  }

  await Promise.all(
    items.map(({ id, order }) =>
      prisma.testimonial.update({ where: { id }, data: { order: parseInt(order) } })
    )
  );

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Order updated successfully"));
});
