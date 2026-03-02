import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

// Get available filter options from database
export const getFilterOptions = asyncHandler(async (req, res) => {
    // Get unique attempts from courses
    const attemptsData = await prisma.product.findMany({
        where: {
            isActive: true,
            courseType: { not: null },
            attempts: { isEmpty: false },
        },
        select: {
            attempts: true,
        },
    });

    const uniqueAttempts = [
        ...new Set(attemptsData.flatMap((p) => p.attempts)),
    ].sort();

    // Get unique course types
    const courseTypesData = await prisma.product.findMany({
        where: {
            isActive: true,
            courseType: { not: null },
        },
        select: {
            courseType: true,
        },
        distinct: ["courseType"],
    });

    const courseTypes = courseTypesData
        .map((p) => p.courseType)
        .filter(Boolean);

    // Get unique modes
    const modesData = await prisma.product.findMany({
        where: {
            isActive: true,
            courseType: { not: null },
            modes: { isEmpty: false },
        },
        select: {
            modes: true,
        },
    });

    const uniqueModes = [...new Set(modesData.flatMap((p) => p.modes))].sort();

    // Get unique book options
    const bookOptionsData = await prisma.product.findMany({
        where: {
            isActive: true,
            courseType: { not: null },
            bookOptions: { isEmpty: false },
        },
        select: {
            bookOptions: true,
        },
    });

    const uniqueBookOptions = [
        ...new Set(bookOptionsData.flatMap((p) => p.bookOptions)),
    ].sort();

    // Get unique faculty names
    const facultyData = await prisma.product.findMany({
        where: {
            isActive: true,
            courseType: { not: null },
            facultyName: { not: null },
        },
        select: {
            facultyName: true,
        },
        distinct: ["facultyName"],
    });

    const faculties = facultyData.map((p) => p.facultyName).filter(Boolean);

    // Get categories
    const categories = await prisma.category.findMany({
        where: {
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            slug: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    res.status(200).json(
        new ApiResponsive(
            200,
            {
                attempts: uniqueAttempts,
                courseTypes: courseTypes.map((type) => ({
                    value: type,
                    label:
                        type === "lecture"
                            ? "Single"
                            : type.charAt(0).toUpperCase() + type.slice(1),
                })),
                modes: uniqueModes.map((mode) => ({
                    value: mode,
                    label: formatModeLabel(mode),
                })),
                bookOptions: uniqueBookOptions.map((option) => ({
                    value: option,
                    label: formatBookOptionLabel(option),
                })),
                faculties,
                categories,
            },
            "Filter options fetched successfully"
        )
    );
});

// Helper functions to format labels
function formatModeLabel(mode) {
    const labels = {
        "online-live": "Regular In-depth",
        recorded: "Fasttrack",
        "hard-copy": "Exam-Oriented",
        "digital-only": "Digital Only",
        book: "Book Sale",
    };
    return labels[mode] || mode;
}

function formatBookOptionLabel(option) {
    const labels = {
        "with-books": "With Books",
        "without-books": "Without Books",
        "digital-only": "Digital Only",
    };
    return labels[option] || option;
}
