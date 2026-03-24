import { fetchApi } from "@/lib/utils";
import ProductContent from "@/app/products/[slug]/ProductContent";

const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export async function generateMetadata({ params }) {
    const { slug } = params;
    let title = "Course Details | CA-Maker";
    let description =
        "CA Inter Audit courses by CA Mohit Kukreja. Professional P.A systems, DJ speakers, amplifiers, driver units and audio equipment.";
    let image = null;

    try {
        const response = await fetchApi(`/public/products/${slug}`);
        const product = response.data.product;

        if (product) {
            title = product.metaTitle || `${product.name} | CA-Maker`;
            description =
                product.metaDescription || product.description || description;

            if (product.images && product.images.length > 0) {
                image = getImageUrl(product.images[0].url);
            }
        }
    } catch (error) {
        console.error("Error fetching product metadata:", error);
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: image ? [image] : [],
            type: "website",
        },
    };
}

export default function CourseDetailPage({ params }) {
    return <ProductContent slug={params.slug} />;
}
