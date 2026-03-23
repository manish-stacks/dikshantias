import { useState } from "react";
import { ChevronRight } from "lucide-react";

const SubjectsSection = ({ course }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleSubjects = showAll
    ? course.subjects
    : course.subjects.slice(0, 4); // 2 rows (3 per row)

  return (
    <>
      {course.subjects && course.subjects.length > 0 && (
        <div className="section-card mt-5">
          <h2 className="pb-5 font-bold text-red-500 text-2xl">Subjects Covered</h2>

          <div className="subjects-grid">
            {visibleSubjects.map((sub, i) => (
              <div
                key={sub.id}
                className="subject-chip"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <ChevronRight size={11} />
                {sub.name}
              </div>
            ))}
          </div>

          {/* See More Button */}
          {course.subjects.length > 6 && (
            <button
              className="see-more-btn text-rose-600 bg-rose-200 px-2 py-1 rounded-2xl mt-2"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "See Less" : "See More"}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default SubjectsSection;