import { redirect } from "next/navigation";

export default async function ProductRedirect({ params }) {
    redirect(`/courses/${params.slug}`);
}
