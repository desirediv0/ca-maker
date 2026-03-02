import api from "./api";

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  exam: string | null;
  result: string | null;
  text: string;
  rating: number;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type TestimonialInput = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const res = await api.get("/api/admin/testimonials");
  return res.data?.data?.testimonials ?? [];
};

export const createTestimonial = async (data: Partial<TestimonialInput>) => {
  const res = await api.post("/api/admin/testimonials", data);
  return res.data;
};

export const updateTestimonial = async (id: string, data: Partial<TestimonialInput>) => {
  const res = await api.put(`/api/admin/testimonials/${id}`, data);
  return res.data;
};

export const deleteTestimonial = async (id: string) => {
  const res = await api.delete(`/api/admin/testimonials/${id}`);
  return res.data;
};
