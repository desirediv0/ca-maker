"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/utils";
import { MapPin, Plus, Edit, Trash2, Home, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AddressForm from "@/components/AddressForm";

export default function AddressesPage() {
  const [addresses,       setAddresses]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [showAddForm,     setShowAddForm]      = useState(false);
  const [editingAddress,  setEditingAddress]   = useState(null);
  const [deletingId,      setDeletingId]       = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/users/addresses", { credentials: "include" });
      if (res.success) setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to load your addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleFormSuccess = () => { setShowAddForm(false); setEditingAddress(null); fetchAddresses(); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    setDeletingId(id);
    try {
      const res = await fetchApi(`/users/addresses/${id}`, { method: "DELETE", credentials: "include" });
      if (res.success) { toast.success("Address deleted"); fetchAddresses(); }
    } catch (err) {
      toast.error(err.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetchApi(`/users/addresses/${id}/default`, { method: "PATCH", credentials: "include" });
      if (res.success) { toast.success("Default address updated"); fetchAddresses(); }
    } catch (err) {
      toast.error(err.message || "Failed to set default");
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Addresses</h1>
          <div className="w-10 h-1 bg-orange-500 rounded-full" />
        </div>
        {!showAddForm && !editingAddress && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Address
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(showAddForm || editingAddress) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 className="text-base font-bold text-gray-900 mb-5">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <AddressForm
            existingAddress={editingAddress}
            onSuccess={handleFormSuccess}
            onCancel={() => { setShowAddForm(false); setEditingAddress(null); }}
          />
        </div>
      )}

      {/* Empty */}
      {addresses.length === 0 && !showAddForm && !editingAddress ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No Addresses Yet</h2>
          <p className="text-gray-500 text-sm mb-6">Add a delivery address to speed up checkout.</p>
          <button onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors">
            <Plus className="h-4 w-4" /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div key={addr.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 relative hover:border-orange-200 hover:shadow-md transition-all duration-200"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Check className="h-3 w-3" /> Default
                </span>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Home className="h-4 w-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{addr.name}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{addr.street}</p>
                  <p className="text-gray-500 text-sm">{addr.city}, {addr.state} — {addr.postalCode}</p>
                  <p className="text-gray-500 text-sm">{addr.country}</p>
                  <p className="text-gray-600 text-sm font-medium mt-1">{addr.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 hover:border-orange-300 hover:text-orange-600 rounded-xl text-xs font-semibold text-gray-600 transition-colors">
                    <Home className="h-3.5 w-3.5" /> Set Default
                  </button>
                )}
                <button onClick={() => setEditingAddress(addr)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 hover:border-orange-300 hover:text-orange-600 rounded-xl text-xs font-semibold text-gray-600 transition-colors">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} disabled={deletingId === addr.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-100 hover:border-red-300 hover:text-red-600 rounded-xl text-xs font-semibold text-red-400 transition-colors disabled:opacity-60">
                  {deletingId === addr.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add tile */}
          <button onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-orange-500 transition-all min-h-[160px]">
            <Plus className="h-8 w-8" />
            <span className="text-sm font-semibold">Add New Address</span>
          </button>
        </div>
      )}
    </div>
  );
}
