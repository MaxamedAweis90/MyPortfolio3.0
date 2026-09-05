"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tags,
  Plus,
  Loader2,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Layers,
  FolderGit2,
} from "lucide-react";
import { toast } from "react-toastify";

export interface CategoryItem {
  id: string;
  _id: string;
  name: string;
  slug: string;
  order?: number;
  projectCount?: number;
}

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onCategoriesChanged: () => void;
}

export function ManageCategoriesModal({
  isOpen,
  onClose,
  categories,
  onCategoriesChanged,
}: ManageCategoriesModalProps) {
  const [newCatName, setNewCatName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete confirmation state
  const [deletingCat, setDeletingCat] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      toast.warning("Please provide a category name.");
      return;
    }

    if (trimmed.toLowerCase() === "all") {
      toast.error("'All' is a reserved system keyword.");
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Category "${trimmed}" already exists.`);
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/ugaas/projects/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || `Category "${trimmed}" created!`);
        setNewCatName("");
        onCategoriesChanged();
      } else {
        toast.error(data.error || "Failed to create category.");
      }
    } catch {
      toast.error("Network error while adding category.");
    } finally {
      setIsAdding(false);
    }
  };

  // 2. Start inline editing
  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id || cat._id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 3. Save inline edit
  const handleSaveEdit = async (cat: CategoryItem) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      toast.warning("Category name cannot be empty.");
      return;
    }

    if (trimmed.toLowerCase() === cat.name.toLowerCase()) {
      cancelEdit();
      return;
    }

    if (trimmed.toLowerCase() === "all") {
      toast.error("'All' is a reserved system keyword.");
      return;
    }

    if (
      categories.some(
        (c) =>
          (c.id || c._id) !== (cat.id || cat._id) &&
          c.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      toast.error(`Category "${trimmed}" already exists.`);
      return;
    }

    setIsSavingEdit(true);
    try {
      const res = await fetch("/api/ugaas/projects/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cat.id || cat._id,
          oldName: cat.name,
          name: trimmed,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || `Category renamed to "${trimmed}".`);
        cancelEdit();
        onCategoriesChanged();
      } else {
        toast.error(data.error || "Failed to rename category.");
      }
    } catch {
      toast.error("Network error while renaming category.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 4. Handle Delete Category
  const handleDeleteCategory = async () => {
    if (!deletingCat) return;

    if (categories.length <= 1) {
      toast.error("You must have at least one category.");
      return;
    }

    setIsDeleting(true);
    try {
      // Find a safe fallback category to reassign projects to
      const fallback =
        categories.find(
          (c) => (c.id || c._id) !== (deletingCat.id || deletingCat._id)
        )?.name || "Web";

      const deleteUrl = `/api/ugaas/projects/categories?id=${encodeURIComponent(
        deletingCat.id || deletingCat._id
      )}&name=${encodeURIComponent(deletingCat.name)}&reassignTo=${encodeURIComponent(
        fallback
      )}`;

      const res = await fetch(deleteUrl, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success(
          data.message || `Category "${deletingCat.name}" deleted.`
        );
        setDeletingCat(null);
        onCategoriesChanged();
      } else {
        toast.error(data.error || "Failed to delete category.");
      }
    } catch {
      toast.error("Network error while deleting category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <DialogHeader className="border-b border-borderSubtle pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC] shrink-0">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-primaryText flex items-center gap-2">
                  <span>Project Categories</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {categories.length} Total
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-mutedText mt-0.5">
                  Create, rename, or remove project categories. Renaming cascades to all active projects automatically.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <Input
                placeholder="e.g. AI & ML, Cloud Architecture, Desktop..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="bg-mainBg/80 border-borderSubtle text-primaryText text-xs sm:text-sm pl-9 h-10 rounded-xl"
                disabled={isAdding}
              />
              <Layers className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <Button
              type="submit"
              disabled={isAdding || !newCatName.trim()}
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white font-bold text-xs h-10 px-4 rounded-xl shrink-0 gap-1.5 shadow-md shadow-[#0B82EC]/20"
            >
              {isAdding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Add Category</span>
            </Button>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 pt-1">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-xs text-mutedText border border-dashed border-borderSubtle rounded-xl">
                No categories found. Add your first category above.
              </div>
            ) : (
              categories.map((cat) => {
                const catId = cat.id || cat._id;
                const isEditing = editingId === catId;
                const count = cat.projectCount ?? 0;

                return (
                  <div
                    key={catId}
                    className="flex items-center justify-between p-3 rounded-xl bg-mainBg/60 border border-borderSubtle hover:border-borderSubtle/80 transition-all gap-3"
                  >
                    {isEditing ? (
                      /* Inline Edit Mode */
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveEdit(cat);
                            } else if (e.key === "Escape") {
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          className="h-8 text-xs bg-surface border-borderSubtle text-primaryText rounded-lg flex-1"
                          disabled={isSavingEdit}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSaveEdit(cat)}
                          disabled={isSavingEdit}
                          className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                          title="Save Rename"
                        >
                          {isSavingEdit ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          disabled={isSavingEdit}
                          className="h-8 w-8 text-mutedText hover:text-primaryText hover:bg-surface"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      /* Normal Display Mode */
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-[#0B82EC]" />
                          <span className="text-sm font-semibold text-primaryText truncate">
                            {cat.name}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface border border-borderSubtle text-mutedText shrink-0 flex items-center gap-1">
                            <FolderGit2 className="w-3 h-3 text-[#2DD4BF]" />
                            {count} {count === 1 ? "project" : "projects"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(cat)}
                            className="h-8 w-8 text-mutedText hover:text-[#0B82EC] hover:bg-[#0B82EC]/10 rounded-lg"
                            title="Rename Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeletingCat(cat)}
                            disabled={categories.length <= 1}
                            className="h-8 w-8 text-mutedText hover:text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              categories.length <= 1
                                ? "Cannot delete the last category"
                                : "Delete Category"
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-borderSubtle/60 flex items-center justify-between sm:justify-between w-full">
            <span className="text-[11px] text-mutedText">
              Deletions reassign tagged projects to standard fallback.
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 px-4 rounded-xl border-borderSubtle"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Sub-Dialog */}
      {deletingCat && (
        <Dialog
          open={Boolean(deletingCat)}
          onOpenChange={(open) => !open && setDeletingCat(null)}
        >
          <DialogContent className="max-w-md bg-surface border-red-500/30 text-primaryText rounded-2xl shadow-2xl p-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-primaryText">
                    Delete Category &quot;{deletingCat.name}&quot;?
                  </DialogTitle>
                  <DialogDescription className="text-xs text-mutedText mt-0.5">
                    This action will permanently remove this category from the database.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 leading-relaxed my-2">
              {(deletingCat.projectCount ?? 0) > 0 ? (
                <span>
                  <strong>Notice:</strong> {deletingCat.projectCount} projects
                  are currently tagged with this category. They will automatically
                  be reassigned to a safe fallback category so they won&apos;t disappear.
                </span>
              ) : (
                <span>No projects are currently using this category. Safe to delete.</span>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setDeletingCat(null)}
                className="text-xs h-9 px-4 rounded-xl border-borderSubtle"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCategory}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md shadow-red-500/20 gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Confirm Delete</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
