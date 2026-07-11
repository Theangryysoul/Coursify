import { useCourses } from "@/hooks/course/useCourses";

import { CourseCard } from "@/components/course/CourseCard";

export default function CoursesPage() {
  const { data, isPending } = useCourses();

  if (isPending) {
    return (
      <div className="text-center text-muted-foreground">
        Loading courses...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No courses imported yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          My Courses
        </h1>

        <p className="mt-2 text-muted-foreground">
          Continue learning where you left off.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
          />
        ))}
      </div>
    </div>
  );
}