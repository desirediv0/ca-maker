import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { getFileUrl } from "../utils/deleteFromS3.js";

// Get courses by tag (hot-selling, new-launch, trending, best-seller)
export const getCoursesByTag = asyncHandler(async (req, res) => {
    const { tag, limit = 8 } = req.query;

    if (!tag) {
        throw new ApiError(400, "Tag is required");
    }

    const courses = await prisma.product.findMany({
        where: {
            isActive: true,
            courseTags: {
                has: tag,
            },
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            images: {
                orderBy: { order: "asc" },
                take: 1,
            },
            variants: {
                where: { isActive: true },
                orderBy: { price: "asc" },
                take: 1,
                include: {
                    images: {
                        orderBy: { order: "asc" },
                        take: 1,
                    },
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: {
                            status: "APPROVED",
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
    });

    const formattedCourses = courses.map((course) => {
        const primaryCategory =
            course.categories.length > 0 ? course.categories[0].category : null;

        // Resolve image: product-level first, then first variant image as fallback
        let imageUrl = null;
        if (course.images && course.images.length > 0) {
            imageUrl = course.images[0].url;
        } else if (course.variants && course.variants.length > 0) {
            for (const variant of course.variants) {
                if (variant.images && variant.images.length > 0) {
                    imageUrl = variant.images[0].url;
                    break;
                }
            }
        }

        const basePrice =
            course.variants.length > 0
                ? parseFloat(course.variants[0].salePrice || course.variants[0].price)
                : null;
        const regularPrice =
            course.variants.length > 0 ? parseFloat(course.variants[0].price) : null;
        const hasSale =
            course.variants.length > 0 && course.variants[0].salePrice !== null;

        return {
            id: course.id,
            name: course.name,
            slug: course.slug,
            description: course.description,
            courseType: course.courseType,
            facultyName: course.facultyName,
            duration: course.duration,
            batchStartDate: course.batchStartDate,
            batchEndDate: course.batchEndDate,
            attempts: course.attempts,
            modes: course.modes,
            bookOptions: course.bookOptions,
            courseTags: course.courseTags,
            category: primaryCategory
                ? {
                    id: primaryCategory.id,
                    name: primaryCategory.name,
                    slug: primaryCategory.slug,
                }
                : null,
            image: imageUrl ? getFileUrl(imageUrl) : null,
            basePrice,
            regularPrice,
            hasSale,
            reviewCount: course._count.reviews,
            digitalEnabled: course.digitalEnabled,
        };
    });

    res.status(200).json(
        new ApiResponsive(
            200,
            {
                courses: formattedCourses,
                tag,
            },
            `Courses with tag "${tag}" fetched successfully`
        )
    );
});

// Get all courses with course-specific filters
export const getAllCourses = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        courseType,
        attempt,
        mode,
        bookOption,
        tag,
        featured,
        categoryId,
        sort = "createdAt",
        order = "desc",
    } = req.query;

    const normalizedSearch =
        typeof search === "string" ? search.replace(/\+/g, " ") : "";

    const whereConditions = {
        isActive: true,
        // Only get products that are courses
        courseType: { not: null },
        // Search
        ...(normalizedSearch && {
            OR: [
                { name: { contains: normalizedSearch, mode: "insensitive" } },
                { description: { contains: normalizedSearch, mode: "insensitive" } },
                { facultyName: { contains: normalizedSearch, mode: "insensitive" } },
            ],
        }),
        // Filter by course type
        ...(courseType && { courseType }),
        // Filter by attempt
        ...(attempt && {
            attempts: {
                has: attempt,
            },
        }),
        // Filter by mode
        ...(mode && {
            modes: {
                has: mode,
            },
        }),
        // Filter by book option
        ...(bookOption && {
            bookOptions: {
                has: bookOption,
            },
        }),
        // Filter by tag
        ...(tag && {
            courseTags: {
                has: tag,
            },
        }),
        // Filter by featured
        ...(featured === "true" && { isFeatured: true }),
        // Filter by category
        ...(categoryId && {
            categories: {
                some: {
                    categoryId,
                },
            },
        }),
    };

    const totalCourses = await prisma.product.count({
        where: whereConditions,
    });

    const courses = await prisma.product.findMany({
        where: whereConditions,
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            images: {
                orderBy: { order: "asc" },
                take: 1,
            },
            variants: {
                where: { isActive: true },
                orderBy: { price: "asc" },
                include: {
                    images: {
                        orderBy: { order: "asc" },
                        take: 1,
                    },
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: {
                            status: "APPROVED",
                        },
                    },
                },
            },
        },
        orderBy: [{ [sort]: order }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
    });

    const formattedCourses = courses.map((course) => {
        const primaryCategory =
            course.categories.length > 0 ? course.categories[0].category : null;

        // Resolve image: product-level first, then first variant image as fallback
        let imageUrl = null;
        if (course.images && course.images.length > 0) {
            imageUrl = course.images[0].url;
        } else if (course.variants && course.variants.length > 0) {
            for (const variant of course.variants) {
                if (variant.images && variant.images.length > 0) {
                    imageUrl = variant.images[0].url;
                    break;
                }
            }
        }

        const basePrice =
            course.variants.length > 0
                ? parseFloat(course.variants[0].salePrice || course.variants[0].price)
                : null;
        const regularPrice =
            course.variants.length > 0 ? parseFloat(course.variants[0].price) : null;
        const hasSale =
            course.variants.length > 0 && course.variants[0].salePrice !== null;

        return {
            id: course.id,
            name: course.name,
            slug: course.slug,
            description: course.description,
            courseType: course.courseType,
            facultyName: course.facultyName,
            duration: course.duration,
            batchStartDate: course.batchStartDate,
            batchEndDate: course.batchEndDate,
            studentCapacity: course.studentCapacity,
            attempts: course.attempts,
            modes: course.modes,
            bookOptions: course.bookOptions,
            courseTags: course.courseTags,
            category: primaryCategory
                ? {
                    id: primaryCategory.id,
                    name: primaryCategory.name,
                    slug: primaryCategory.slug,
                }
                : null,
            image: imageUrl ? getFileUrl(imageUrl) : null,
            variants: course.variants.map((v) => ({
                id: v.id,
                sku: v.sku,
                price: parseFloat(v.price),
                salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
                quantity: v.quantity,
                images: v.images.map((img) => ({
                    url: getFileUrl(img.url),
                    isPrimary: img.isPrimary,
                })),
            })),
            basePrice,
            regularPrice,
            hasSale,
            reviewCount: course._count.reviews,
            digitalEnabled: course.digitalEnabled,
            digitalPdfUrls: course.digitalPdfUrls,
            accessDuration: course.accessDuration,
        };
    });

    res.status(200).json(
        new ApiResponsive(
            200,
            {
                courses: formattedCourses,
                pagination: {
                    total: totalCourses,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(totalCourses / parseInt(limit)),
                },
            },
            "Courses fetched successfully"
        )
    );
});

// Get course by slug with all variants
export const getCourseBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const course = await prisma.product.findUnique({
        where: {
            slug,
            isActive: true,
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            images: {
                orderBy: { isPrimary: "desc" },
            },
            variants: {
                where: { isActive: true },
                include: {
                    attributes: {
                        include: {
                            attributeValue: {
                                include: {
                                    attribute: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { price: "asc" },
            },
            reviews: {
                where: { status: "APPROVED" },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            _count: {
                select: {
                    reviews: {
                        where: {
                            status: "APPROVED",
                        },
                    },
                },
            },
        },
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Format images
    const images = course.images.map((image) => ({
        ...image,
        url: getFileUrl(image.url),
    }));

    // Format variants with attributes
    const variants = course.variants.map((variant) => {
        const attributes = {};
        variant.attributes.forEach((attr) => {
            attributes[attr.attributeValue.attribute.name] = attr.attributeValue.value;
        });

        return {
            id: variant.id,
            sku: variant.sku,
            price: parseFloat(variant.price),
            salePrice: variant.salePrice ? parseFloat(variant.salePrice) : null,
            quantity: variant.quantity,
            isActive: variant.isActive,
            attributes,
        };
    });

    // Calculate average rating
    const avgRating =
        course.reviews.length > 0
            ? (
                course.reviews.reduce((sum, review) => sum + review.rating, 0) /
                course.reviews.length
            ).toFixed(1)
            : null;

    const formattedCourse = {
        id: course.id,
        name: course.name,
        slug: course.slug,
        description: course.description,
        courseType: course.courseType,
        facultyName: course.facultyName,
        duration: course.duration,
        batchStartDate: course.batchStartDate,
        batchEndDate: course.batchEndDate,
        studentCapacity: course.studentCapacity,
        attempts: course.attempts,
        modes: course.modes,
        bookOptions: course.bookOptions,
        courseTags: course.courseTags,
        category:
            course.categories.length > 0 ? course.categories[0].category : null,
        images,
        variants,
        reviews: course.reviews,
        avgRating,
        reviewCount: course._count.reviews,
        digitalEnabled: course.digitalEnabled,
        digitalPdfUrls: course.digitalPdfUrls.map((url) => getFileUrl(url)),
        accessDuration: course.accessDuration,
        metaTitle: course.metaTitle || course.name,
        metaDescription: course.metaDescription || course.description,
        keywords: course.keywords || "",
    };

    res.status(200).json(
        new ApiResponsive(200, { course: formattedCourse }, "Course fetched successfully")
    );
});
