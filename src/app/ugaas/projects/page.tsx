"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Globe,
  Layers,
  Tags,
  GripVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { ToolBadge } from "./components/ToolIconHelper";
import { ProjectDialog } from "./components/ProjectDialog";
import { DeleteProjectConfirmModal, ProjectItem } from "./components/DeleteProjectConfirmModal";
import { ProjectsSkeleton } from "./components/ProjectsSkeleton";
import { ScrollableContainer } from "../components/ScrollableContainer";
import { ManageCategoriesModal, CategoryItem } from "./components/ManageCategoriesModal";

export default function ProjectsCMSPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories state
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Clean up if needed
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const draggedProject = filteredProjects[draggedIndex];
    const targetProject = filteredProjects[targetIndex];
    if (!draggedProject || !targetProject) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const oldIndex = projects.findIndex(
      (p) => (p.id || p._id || p.slug) === (draggedProject.id || draggedProject._id || draggedProject.slug)
    );
    const newIndex = projects.findIndex(
      (p) => (p.id || p._id || p.slug) === (targetProject.id || targetProject._id || targetProject.slug)
    );

    if (oldIndex === -1 || newIndex === -1) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedProjects = [...projects];
    const [moved] = updatedProjects.splice(oldIndex, 1);
    updatedProjects.splice(newIndex, 0, moved);

    const total = updatedProjects.length;

    // Number rows in descending order from total down to 1 (e.g. 5, 4, 3, 2, 1)
    const reordered = updatedProjects.map((p, idx) => ({
      ...p,
      sortOrder: idx + 1,
      order: idx + 1,
      projectNumber: total - idx,
    }));

    setProjects(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      const items = reordered.map((p, idx) => ({
        id: p.id || p._id || p.slug,
        sortOrder: idx + 1,
        projectNumber: total - idx,
      }));
      const res = await fetch("/api/ugaas/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project display order updated!");
      } else {
        toast.error(data.error || "Failed to save project order");
        fetchProjects();
      }
    } catch {
      toast.error("Failed to save project order");
      fetchProjects();
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/ugaas/projects/categories?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.categories) {
        setCategoriesList(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchProjects = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch(`/api/ugaas/projects?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      toast.error("Failed to load projects from server");
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, [fetchProjects, fetchCategories]);

  // Reset selected category to "All" if current category was deleted
  useEffect(() => {
    if (
      selectedCategory !== "All" &&
      categoriesList.length > 0 &&
      !categoriesList.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase())
    ) {
      setSelectedCategory("All");
    }
  }, [categoriesList, selectedCategory]);

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Category match
      const categoryMatch =
        selectedCategory === "All" ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Search match across title, description, slug, and tools
      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.slug.toLowerCase().includes(q) ||
        project.desc?.toLowerCase().includes(q) ||
        project.tools?.some((t) => t.toLowerCase().includes(q));

      return categoryMatch && searchMatch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Live Featured Switch Handler
  const handleToggleFeatured = async (project: ProjectItem) => {
    const targetId = project.id || project._id || project.slug;
    const newFeaturedState = !project.isFeatured;

    // Enforce max 6 limit when enabling featured status
    if (newFeaturedState) {
      const activeFeaturedCount = projects.filter((p) => p.isFeatured).length;
      if (activeFeaturedCount >= 6) {
        toast.error("Maximum 6 projects can be featured on the Home section.");
        return;
      }
    }

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        (p.id || p._id || p.slug) === targetId
          ? { ...p, isFeatured: newFeaturedState }
          : p
      )
    );

    try {
      const res = await fetch(`/api/ugaas/projects/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeaturedState }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          newFeaturedState
            ? `"${project.title}" marked as featured!`
            : `"${project.title}" removed from featured.`
        );
      } else {
        // Rollback
        setProjects((prev) =>
          prev.map((p) =>
            (p.id || p._id || p.slug) === targetId
              ? { ...p, isFeatured: !newFeaturedState }
              : p
          )
        );
        toast.error(data.error || "Failed to update featured status");
      }
    } catch {
      // Rollback
      setProjects((prev) =>
        prev.map((p) =>
          (p.id || p._id || p.slug) === targetId
            ? { ...p, isFeatured: !newFeaturedState }
            : p
        )
      );
      toast.error("Failed to update featured status");
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setIsEditorOpen(true);
  };

  const handleProjectSaved = (savedProject: ProjectItem, isNew: boolean) => {
    if (isNew) {
      // Place newly added project on top
      setProjects((prev) => [savedProject, ...prev]);
      fetchProjects();
    } else {
      const targetId = savedProject.id || savedProject._id || savedProject.slug;
      setProjects((prev) =>
        prev.map((p) =>
          (p.id || p._id || p.slug) === targetId ? savedProject : p
        )
      );
    }
  };

  const handleProjectDeleted = (deletedId: string) => {
    // Optimistically remove and re-number projects added after the deleted one
    setProjects((prev) => {
      const deletedItem = prev.find(
        (p) => (p.id || p._id || p.slug) === deletedId
      );
      const deletedNum = deletedItem?.projectNumber;
      return prev
        .filter((p) => (p.id || p._id || p.slug) !== deletedId)
        .map((p) => {
          if (
            deletedNum !== undefined &&
            p.projectNumber !== undefined &&
            p.projectNumber > deletedNum
          ) {
            return { ...p, projectNumber: p.projectNumber - 1 };
          }
          return p;
        });
    });
    fetchProjects();
    fetchCategories();
  };

  // Dynamic Categories Tabs derived directly from database categoriesList
  const categoryTabs = useMemo(() => {
    if (categoriesList && categoriesList.length > 0) {
      return ["All", ...categoriesList.map((c) => c.name)];
    }
    const fromProjects = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ["All", ...(fromProjects.length > 0 ? fromProjects : ["Web", "Mobile", "Design"])];
  }, [categoriesList, projects]);

  if (loading && projects.length === 0) {
    return <ProjectsSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primaryText">
              Projects Management<span className="text-[#0B82EC]">.</span>
            </h1>
            <Badge variant="teal" className="text-xs font-bold px-2.5 py-0.5">
              {projects.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-mutedText">
            Create, update, tag tools, and feature technical case studies on your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              fetchProjects(true);
              fetchCategories();
            }}
            disabled={refreshing}
            title="Refresh Projects & Categories"
            className="text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`} />
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
            className="border-borderSubtle bg-surface hover:bg-surface/80 text-primaryText gap-2 text-xs sm:text-sm h-10 px-3.5 font-semibold"
          >
            <Tags className="w-4 h-4 text-[#0B82EC]" />
            <span>Manage Categories</span>
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-bold shadow-lg shadow-[#0B82EC]/20 active:scale-[0.98] transition-all text-xs sm:text-sm h-10 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Button>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar Card */}
      <Card className="bg-surface/90 backdrop-blur-md">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs with Scroll Indicators (<< / >>) */}
          <div className="w-full md:w-auto min-w-0">
            <ScrollableContainer containerClassName="rounded-xl border border-borderSubtle bg-surface">
              <div className="flex items-center gap-1.5 p-1 min-w-max">
                {categoryTabs.map((cat) => {
                  const count =
                    cat === "All"
                      ? projects.length
                      : projects.filter(
                          (p) => p.category?.toLowerCase() === cat.toLowerCase()
                        ).length;

                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "bg-[#0B82EC] text-white shadow-sm"
                          : "text-mutedText hover:text-primaryText hover:bg-surface/50"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-surface border border-borderSubtle text-mutedText"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollableContainer>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search title, slug, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#111622] border-[#222938] text-white text-xs h-10 placeholder:text-mutedText/50 focus-visible:ring-[#0B82EC]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedText hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Projects DataTable */}
      <Card className="overflow-hidden">
        <ScrollableContainer>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-borderSubtle bg-[#111622]/70">
                <TableHead className="w-10 text-center font-semibold text-xs text-mutedText">
                  <span className="sr-only">Reorder</span>
                </TableHead>
                <TableHead className="w-12 text-center font-semibold text-xs text-mutedText">#</TableHead>
                <TableHead className="w-16 font-semibold text-xs text-mutedText">Thumb</TableHead>
                <TableHead className="font-semibold text-xs text-mutedText">Title & Slug</TableHead>
                <TableHead className="font-semibold text-xs text-mutedText">Category</TableHead>
                <TableHead className="font-semibold text-xs text-mutedText hidden md:table-cell">Tools & Stack</TableHead>
                <TableHead className="font-semibold text-xs text-mutedText text-center">Featured</TableHead>
                <TableHead className="font-semibold text-xs text-mutedText text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-b border-borderSubtle/50">
                    <TableCell colSpan={8} className="py-5">
                      <div className="h-5 bg-[#111622] rounded animate-pulse w-4/5 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => {
                  const targetId = project.id || project._id || project.slug;
                  const isDragging = draggedIndex === index;
                  const isOver = dragOverIndex === index;

                  return (
                    <TableRow
                      key={targetId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`border-b border-borderSubtle/50 hover:bg-surface/80 transition-colors group cursor-default ${
                        isDragging ? "opacity-40 bg-surface/30" : ""
                      } ${
                        isOver ? "border-t-2 border-t-[#0B82EC] bg-[#0B82EC]/5" : ""
                      }`}
                    >
                      {/* Drag Handle */}
                      <TableCell className="py-3.5 pl-3 pr-1 text-center w-10">
                        <div
                          className="cursor-grab active:cursor-grabbing text-mutedText/60 hover:text-white p-1 rounded hover:bg-[#111622] inline-flex items-center justify-center transition-colors"
                          title="Drag to reorder display position"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                      </TableCell>

                      {/* Project Number (Descending: latest on top) */}
                      <TableCell className="py-3.5 px-2 text-center w-12">
                        <span
                          className="inline-block font-mono text-[11px] font-bold text-[#0B82EC] bg-[#0B82EC]/10 px-2 py-0.5 rounded border border-[#0B82EC]/20"
                          title={`Project #${String(
                            project.projectNumber !== undefined && project.projectNumber !== null
                              ? project.projectNumber
                              : (filteredProjects.length - index)
                          ).padStart(2, "0")}`}
                        >
                          {String(
                            project.projectNumber !== undefined && project.projectNumber !== null
                              ? project.projectNumber
                              : (filteredProjects.length - index)
                          ).padStart(2, "0")}
                        </span>
                      </TableCell>

                      {/* Thumbnail */}
                      <TableCell className="py-3.5 pl-2">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#111622] border border-borderSubtle shrink-0">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={() => {}}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-mutedText text-xs font-bold">
                              {project.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Title & Slug */}
                      <TableCell className="py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-primaryText text-sm group-hover:text-[#0B82EC] transition-colors truncate max-w-xs">
                            {project.title}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-mutedText">
                            <span className="font-mono text-[11px] text-mutedText/80 truncate max-w-[140px]">
                              /work/{project.slug}
                            </span>
                            <Link
                              href={`/work/${project.slug}`}
                              target="_blank"
                              title="Preview on live site"
                              className="text-mutedText hover:text-primaryText"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="py-3.5">
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-surface text-primaryText border-borderSubtle"
                        >
                          {project.category || "Web"}
                        </Badge>
                      </TableCell>

                      {/* Tools & Tech Stack */}
                      <TableCell className="py-3.5 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.tools && project.tools.length > 0 ? (
                            project.tools.slice(0, 4).map((tool) => (
                              <ToolBadge
                                key={tool}
                                tool={tool}
                                className="px-2 py-0.5 text-[11px]"
                              />
                            ))
                          ) : (
                            <span className="text-xs text-mutedText">No tags</span>
                          )}
                          {project.tools && project.tools.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111622] border border-borderSubtle text-mutedText font-medium">
                              +{project.tools.length - 4}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Featured Toggle Switch */}
                      <TableCell className="py-3.5 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={Boolean(project.isFeatured)}
                            onCheckedChange={() => handleToggleFeatured(project)}
                            aria-label={`Toggle featured status for ${project.title}`}
                          />
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {project.liveUrl && (
                            <Button
                              asChild
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-mutedText hover:text-[#2DD4BF] hover:bg-[#2DD4BF]/10"
                              title="Visit live app"
                            >
                              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                                <Globe className="w-4 h-4" />
                              </a>
                            </Button>
                          )}

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenEditModal(project)}
                            className="h-8 w-8 text-mutedText hover:text-white hover:bg-[#0B82EC]/15"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeletingProject(project)}
                            className="h-8 w-8 text-mutedText hover:text-red-400 hover:bg-red-500/10"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-mutedText">
                    <FolderKanban className="w-10 h-10 text-mutedText/40 mx-auto mb-3" />
                    <p className="text-base font-semibold text-white">No projects found</p>
                    <p className="text-xs text-mutedText mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? `No projects matched "${searchQuery}". Try changing your search or category filter.`
                        : "Start by creating your first showcase project."}
                    </p>
                    <Button
                      onClick={handleOpenCreateModal}
                      className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-semibold text-xs mt-4"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollableContainer>

        {/* Footer Statistics Bar */}
        <div className="p-4 bg-[#0E131D]/80 border-t border-borderSubtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-mutedText">
          <div>
            Showing <strong className="text-white">{filteredProjects.length}</strong> of{" "}
            <strong className="text-white">{projects.length}</strong> projects
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <strong className="text-white">
                {projects.filter((p) => p.isFeatured).length}
              </strong>{" "}
              Featured
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0B82EC]" />
              Syncs with MongoDB Atlas
            </span>
          </div>
        </div>
      </Card>

      {/* 4. Modals */}
      <ProjectDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={editingProject}
        onSuccess={(savedProject, isNew) => {
          handleProjectSaved(savedProject, isNew);
          fetchCategories();
        }}
        availableCategories={categoriesList.map((c) => c.name)}
        onCategoriesChanged={() => {
          fetchCategories();
          fetchProjects();
        }}
      />

      <ManageCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categoriesList}
        onCategoriesChanged={() => {
          fetchCategories();
          fetchProjects();
        }}
      />

      <DeleteProjectConfirmModal
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        project={deletingProject}
        onSuccess={handleProjectDeleted}
      />
    </div>
  );
}
