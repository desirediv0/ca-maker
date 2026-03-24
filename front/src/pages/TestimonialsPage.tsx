import { useState, useEffect, useCallback } from "react";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  Testimonial,
} from "@/api/testimonialService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Edit,
  Plus,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Quote,
  Search,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  role: "",
  exam: "",
  result: "",
  text: "",
  rating: 5,
  isPublished: true,
  order: 0,
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role ?? "",
      exam: t.exam ?? "",
      result: t.result ?? "",
      text: t.text,
      rating: t.rating,
      isPublished: t.isPublished,
      order: t.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Name and testimonial text are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        role: form.role.trim() || undefined,
        exam: form.exam.trim() || undefined,
        result: form.result.trim() || undefined,
      };

      if (editing) {
        await updateTestimonial(editing.id, payload);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(payload);
        toast.success("Testimonial added");
      }
      setDialogOpen(false);
      load();
    } catch {
      toast.error("Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTestimonial(deleteId);
      toast.success("Testimonial deleted");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (t: Testimonial) => {
    try {
      await updateTestimonial(t.id, { isPublished: !t.isPublished });
      toast.success(t.isPublished ? "Unpublished" : "Published");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.role ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.exam ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const StarRating = ({ value }: { value: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Quote className="h-6 w-6 text-orange-500" />
            Testimonials
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage student testimonials shown on the homepage
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total", value: testimonials.length },
          { label: "Published", value: testimonials.filter((t) => t.isPublished).length },
          { label: "Hidden", value: testimonials.filter((t) => !t.isPublished).length },
        ].map((s) => (
          <Card key={s.label} className="border border-gray-100">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Search + Table Card ── */}
      <Card className="border border-gray-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, role or exam…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Quote className="h-12 w-12 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No testimonials found</p>
              <p className="text-sm text-gray-400 mt-1">
                {search ? "Try a different search term" : "Click 'Add Testimonial' to get started"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                      {t.role && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {t.role}
                        </span>
                      )}
                      {t.exam && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {t.exam}
                        </span>
                      )}
                      {t.result && (
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                          {t.result}
                        </span>
                      )}
                    </div>

                    <StarRating value={t.rating} />

                    <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                      "{t.text}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-xs cursor-pointer select-none ${t.isPublished
                        ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                        : "border-gray-200 text-gray-400"
                        }`}
                      onClick={() => togglePublish(t)}
                    >
                      {t.isPublished ? (
                        <><Eye className="h-3 w-3 mr-1" />Live</>
                      ) : (
                        <><EyeOff className="h-3 w-3 mr-1" />Hidden</>
                      )}
                    </Badge>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-orange-600"
                      onClick={() => openEdit(t)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the student's testimonial details."
                : "Add a new student testimonial to showcase on the homepage."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="t-name">Student Name *</Label>
              <Input
                id="t-name"
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Role + Exam (2 cols) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-role">Role / Designation</Label>
                <Input
                  id="t-role"
                  placeholder="e.g. CA Final Student"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-exam">Exam / Batch</Label>
                <Input
                  id="t-exam"
                  placeholder="e.g. CA Final May 2025"
                  value={form.exam}
                  onChange={(e) => setForm((f) => ({ ...f, exam: e.target.value }))}
                />
              </div>
            </div>

            {/* Result */}
            <div className="space-y-1.5">
              <Label htmlFor="t-result">Result / Achievement</Label>
              <Input
                id="t-result"
                placeholder="e.g. AIR 5, Cleared in first attempt"
                value={form.result}
                onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
              />
            </div>

            {/* Testimonial text */}
            <div className="space-y-1.5">
              <Label htmlFor="t-text">Testimonial Text *</Label>
              <Textarea
                id="t-text"
                placeholder="What the student said about CA Maker…"
                rows={4}
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <Label>Rating</Label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: i }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${i <= form.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200 hover:text-yellow-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">Publish on website</p>
                <p className="text-xs text-gray-500">Show this testimonial on the homepage</p>
              </div>
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              This testimonial will be permanently removed from the website. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
