import { CourseCard } from "./CourseCard";

export function RecentCourses() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        Recent Courses
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <CourseCard
          title="MERN Backend Bootcamp"
          playlist="Backend"
          progress={72}
        />

        <CourseCard
          title="React Masterclass"
          playlist="Frontend"
          progress={35}
        />

        <CourseCard
          title="System Design"
          playlist="Interview"
          progress={15}
        />

        <CourseCard
          title="Docker & DevOps"
          playlist="DevOps"
          progress={5}
        />
      </div>
    </section>
  );
}