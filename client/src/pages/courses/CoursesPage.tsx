import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, SearchX } from "lucide-react";

import { useCourses } from "@/hooks/course/useCourses";
import { useFolders } from "@/hooks/folder/useFolders";

import { CourseCard } from "@/components/course/CourseCard";
import { CreateFolderDialog } from "@/components/folder/CreateFolderDialog";
import {
  FolderFilterBar,
  type FolderSelection,
} from "@/components/folder/FolderFilterBar";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

export default function CoursesPage() {
  const { data, isPending } = useCourses();
  const { data: folders } = useFolders();

  const [selected, setSelected] = useState<FolderSelection>("all");

  // Memoised so the derived lists below depend on one stable reference rather
  // than on a fresh `[]` each render.
  const courses = useMemo(() => data ?? [], [data]);

  const uncategorisedCount = useMemo(
    () => courses.filter((course) => !course.folder).length,
    [courses]
  );

  const visibleCourses = useMemo(() => {
    if (selected === "all") {
      return courses;
    }

    if (selected === "uncategorised") {
      return courses.filter((course) => !course.folder);
    }

    return courses.filter((course) => course.folder === selected);
  }, [courses, selected]);

  const selectedFolder =
    selected !== "all" && selected !== "uncategorised"
      ? folders?.find((folder) => folder._id === selected)
      : undefined;

  const hasFolders = Boolean(folders?.length) || uncategorisedCount > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            My Courses
          </h1>

          <p className="text-muted-foreground mt-2">
            Continue learning where you left off.
          </p>
        </div>

        <CreateFolderDialog />
      </div>

      {hasFolders && (
        <FolderFilterBar
          folders={folders ?? []}
          totalCount={courses.length}
          uncategorisedCount={uncategorisedCount}
          selected={selected}
          onSelect={setSelected}
        />
      )}

      {isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border-border/60 overflow-hidden rounded-3xl border"
            >
              <div className="aspect-video w-full animate-pulse bg-muted" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-2 w-full animate-pulse rounded bg-muted" />
                <div className="h-9 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : !courses.length ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No courses imported yet"
          description="Import a YouTube playlist or a single video to start building your library."
          action={
            <Button asChild className="rounded-xl">
              <Link to={ROUTES.IMPORT}>Import a course</Link>
            </Button>
          }
        />
      ) : !visibleCourses.length ? (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title={
            selectedFolder
              ? `"${selectedFolder.name}" is empty`
              : "Nothing here yet"
          }
          description="Use the menu on a course card to move it into this folder."
          action={
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setSelected("all")}
            >
              Show all courses
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-border/60 bg-card/40 flex flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-16 text-center">
      <div className="bg-primary/10 text-primary mb-5 flex h-12 w-12 items-center justify-center rounded-2xl">
        {icon}
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
