"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2, Video, PlayCircle, BookMarked,
  ChevronRight, Layers, ArrowLeft,
} from "lucide-react";
import { useSubjectStore } from "@/lib/store/profile.store";
import { useAuthStore } from "@/lib/store/auth.store";
import VideoList from "./VideoList";

export default function CourseSubjectEnrolledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { batch, videos, loading, fetchBatchAndVideos } = useSubjectStore();

  const courseId = searchParams.get("courseId") ?? "";
  const unlocked = searchParams.get("unlocked") === "true";
  const subjectId = searchParams.get("subjectId");

  useEffect(() => {
    if (courseId) fetchBatchAndVideos(courseId, unlocked);
  }, [courseId, unlocked, fetchBatchAndVideos]);

  const videoCountBySubject = useMemo(() => {
    return videos.reduce<Record<string, number>>((acc, v) => {
      if (v.subjectId) acc[v.subjectId] = (acc[v.subjectId] ?? 0) + 1;
      return acc;
    }, {});
  }, [videos]);

  const subjectList = useMemo(() => {
    return (batch?.subjects ?? []).map((sub) => ({
      ...sub,
      videoCount: videoCountBySubject[String(sub.id)] ?? 0,
    }));
  }, [batch?.subjects, videoCountBySubject]);

  const sortedSubjects = useMemo(() => {
    return [...subjectList].sort((a, b) => {
      if (b.videoCount > 0 && a.videoCount === 0) return 1;
      if (a.videoCount > 0 && b.videoCount === 0) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [subjectList]);

  const selectedSubject = useMemo(() => {
    if (!subjectId) return null;
    return sortedSubjects.find((s) => String(s.id) === subjectId) ?? null;
  }, [sortedSubjects, subjectId]);

  const videosForSelectedSubject = useMemo(() => {
    if (!subjectId) return [];
    return videos.filter((v) => String(v.subjectId) === subjectId);
  }, [videos, subjectId]);

  const totalVideos = videos.length;

  const goToVideos = (subjId?: string | number) => {
    const base = `/my-course?courseId=${courseId}&unlocked=true`;
    router.push(subjId ? `${base}&subjectId=${subjId}` : base);
  };

  const goBackToSubjects = () => {
    router.push(`/my-course?courseId=${courseId}&unlocked=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 size={30} className="animate-spin text-indigo-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Preparing your course</p>
          <p className="text-xs text-slate-400 mt-1">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (!courseId || !unlocked || !batch?.id) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Video size={28} className="text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-500">Course not available</p>
      </div>
    );
  }

  const SubjectGrid = ({ cols }: { cols: string }) => (
    sortedSubjects.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Layers size={28} className="text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-500">No subjects available yet</p>
      </div>
    ) : (
      <div className={`grid ${cols} gap-4`}>
        {sortedSubjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => goToVideos(subject.id)}
            className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col items-start gap-4 text-left transition-all group ${
              subject.videoCount > 0
                ? "border-slate-100 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                : "border-slate-100 opacity-60 cursor-default"
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              subject.videoCount > 0 ? "bg-indigo-50 group-hover:bg-indigo-100 transition-colors" : "bg-slate-100"
            }`}>
              <BookMarked size={19} className={subject.videoCount > 0 ? "text-indigo-500" : "text-slate-300"} />
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-snug line-clamp-2 flex-1">
              {subject.name}
            </p>
            <div className="flex items-center justify-between w-full">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                subject.videoCount > 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {subject.videoCount} {subject.videoCount === 1 ? "video" : "videos"}
              </span>
              {subject.videoCount > 0 && (
                <ChevronRight size={15} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              )}
            </div>
          </button>
        ))}
      </div>
    )
  );

  const CourseHero = ({ heightClass }: { heightClass: string }) => (
    <div className={`relative ${heightClass} w-full bg-slate-200 overflow-hidden`}>
      {batch.imageUrl ? (
        <Image src={batch.imageUrl} alt={batch.name ?? "Course"} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-100 to-slate-100">
          <Video size={44} className="text-indigo-300" />
          <p className="text-xs font-medium text-slate-400">No thumbnail</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
        <h1 className="text-white font-bold leading-snug line-clamp-2">{batch.name ?? "Course"}</h1>
        {batch.program?.name && (
          <p className="text-white/70 text-xs mt-0.5 font-medium">{batch.program.name}</p>
        )}
      </div>
    </div>
  );

  const StatsRow = ({ divideClass }: { divideClass: string }) => (
    <div className={`grid grid-cols-3 ${divideClass} divide-slate-100 overflow-hidden`}>
      {[
        { label: "Subjects", value: sortedSubjects.length },
        { label: "Videos",   value: totalVideos },
        { label: "Active",   value: sortedSubjects.filter(s => s.videoCount > 0).length },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center py-4">
          <span className="text-lg font-bold text-slate-800">{value}</span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      <div className="lg:hidden">
        {subjectId && selectedSubject ? (
          <div className="px-4 pt-5">
            <button onClick={goBackToSubjects} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-5 text-sm font-semibold transition-colors">
              <ArrowLeft size={16} />
              Back to Subjects
            </button>
            <div className="mb-5">
              <h1 className="text-lg font-bold text-slate-800 line-clamp-2">{selectedSubject.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{videosForSelectedSubject.length} videos available</p>
            </div>
            <VideoList
              videos={videosForSelectedSubject}
              currentVideo={null}
              courseId={courseId}
              startDate={batch.startDate ?? ""}
              endDate={batch.endDate ?? ""}
              userId={useAuthStore.getState().user?.id ?? ""}
            />
          </div>
        ) : (
          <>
            <CourseHero heightClass="h-52" />
            <div className="mx-4 -mt-4 relative z-10 bg-white rounded-2xl border border-slate-100 shadow-md">
              <StatsRow divideClass="divide-x" />
            </div>
            <div className="px-4 pt-5 pb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Subjects</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{sortedSubjects.length} available</p>
                </div>
                <button
                  onClick={() => goToVideos()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <PlayCircle size={13} />
                  View All
                </button>
              </div>
              <SubjectGrid cols="grid-cols-2" />
            </div>
          </>
        )}
      </div>

      <div className="hidden lg:block max-w-6xl mx-auto px-8 py-10">
        {subjectId && selectedSubject ? (
          <div>
            <button onClick={goBackToSubjects} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-semibold transition-colors">
              <ArrowLeft size={16} />
              Back to All Subjects
            </button>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800">{selectedSubject.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{videosForSelectedSubject.length} videos available</p>
            </div>
            <VideoList
              videos={videosForSelectedSubject}
              currentVideo={null}
              courseId={courseId}
              startDate={batch.startDate ?? ""}
              endDate={batch.endDate ?? ""}
              userId={useAuthStore.getState().user?.id ?? ""}
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
              <CourseHero heightClass="h-64 text-2xl" />
              <div className="border-t border-slate-100">
                <StatsRow divideClass="divide-x" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">All Subjects</h2>
                <p className="text-sm text-slate-400 mt-0.5">Select a subject to start learning</p>
              </div>
              <button
                onClick={() => goToVideos()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
              >
                <PlayCircle size={16} />
                View All Videos
              </button>
            </div>

            <SubjectGrid cols="grid-cols-3 xl:grid-cols-4" />
          </>
        )}
      </div>
    </div>
  );
}