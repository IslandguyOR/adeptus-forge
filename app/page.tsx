"use client";
<button
  onClick={() => alert("tap works")}
  className="rounded-2xl bg-emerald-500 px-4 py-2 text-black"
>
  Tap Test
</button>
import React, { useMemo, useState } from "react";
import {
  Flame,
  Dumbbell,
  LayoutDashboard,
  History,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

type ExerciseResult = {
  weight: number;
  reps: number;
};

type HistoryEntry = {
  date: string;
  dayId: string;
  exerciseResults: Record<string, ExerciseResult[]>;
  notes: string;
};

const initialProgram = {
  name: "Adeptus Forge Split",
  days: [
    {
      id: "push-heavy",
      name: "Upper Push (Heavy + Volume)",
      exercises: [
        { id: "db-bench", name: "Dumbbell Bench Press", sets: 4, repMin: 6, repMax: 10 },
        { id: "db-shoulder", name: "Standing Dumbbell Shoulder Press", sets: 4, repMin: 6, repMax: 10 },
        { id: "skull", name: "Skull Crushers", sets: 4, repMin: 8, repMax: 12 },
        { id: "lat-raise", name: "Lateral Raises", sets: 4, repMin: 12, repMax: 15 },
        { id: "rear-fly", name: "Rear Delt Flys", sets: 4, repMin: 12, repMax: 15 },
      ],
    },
    {
      id: "legs-heavy",
      name: "Lower Body (Heavy Legs)",
      exercises: [
        { id: "front-squat", name: "Dumbbell Front Squats", sets: 3, repMin: 6, repMax: 10 },
        { id: "rdl", name: "Romanian Deadlifts", sets: 3, repMin: 8, repMax: 10 },
        { id: "lunges", name: "Reverse Lunges", sets: 3, repMin: 8, repMax: 12 },
        { id: "calves", name: "Calf Raises", sets: 3, repMin: 12, repMax: 15 },
        { id: "core", name: "Core (RKC Plank / Hanging Knee Raises)", sets: 3, repMin: 10, repMax: 20 },
      ],
    },
    {
      id: "pull-heavy",
      name: "Upper Pull (Heavy Back)",
      exercises: [
        { id: "pullups", name: "Pull Ups", sets: 3, repMin: 6, repMax: 10 },
        { id: "1arm-row", name: "One Armed Dumbbell Rows", sets: 3, repMin: 8, repMax: 12 },
        { id: "chest-row", name: "Chest Supported Dumbbell Rows", sets: 3, repMin: 8, repMax: 12 },
        { id: "facepull", name: "Rear Delt / Face Pulls", sets: 3, repMin: 12, repMax: 15 },
        { id: "curl", name: "Strict Curls", sets: 3, repMin: 10, repMax: 12 },
      ],
    },
    {
      id: "upper-hypertrophy",
      name: "Upper Hypertrophy",
      exercises: [
        { id: "incline", name: "Incline Dumbbell Bench", sets: 3, repMin: 8, repMax: 12 },
        { id: "arnold", name: "Arnold Press", sets: 3, repMin: 8, repMax: 12 },
        { id: "lat-raise2", name: "Lateral Raises", sets: 3, repMin: 12, repMax: 15 },
        { id: "pushups", name: "Push Ups", sets: 3, repMin: 10, repMax: 20 },
        { id: "hammer", name: "Hammer Curls", sets: 3, repMin: 10, repMax: 12 },
        { id: "tri-ext", name: "Triceps Extensions", sets: 3, repMin: 10, repMax: 12 },
      ],
    },
    {
      id: "cardio",
      name: "Cardio",
      exercises: [
        { id: "cardio-main", name: "Peloton / Run / Walk / Row", sets: 1, repMin: 1, repMax: 1 },
      ],
    },
  ],
};

const initialHistory:istoryEntry[] = [
  {
    date: "2026-03-12",
    dayId: "push-heavy",
    exerciseResults: {
      "db-bench": [
        { weight: 70, reps: 10 },
        { weight: 75, reps: 8 },
        { weight: 75, reps: 7 },
        { weight: 80, reps: 6 },
      ],
      "db-shoulder": [
        { weight: 45, reps: 9 },
        { weight: 45, reps: 8 },
        { weight: 50, reps: 6 },
        { weight: 50, reps: 6 },
      ],
      skull: [
        { weight: 60, reps: 12 },
        { weight: 65, reps: 10 },
        { weight: 65, reps: 9 },
        { weight: 70, reps: 8 },
      ],
      "lat-raise": [
        { weight: 20, reps: 15 },
        { weight: 20, reps: 14 },
        { weight: 25, reps: 12 },
        { weight: 25, reps: 10 },
      ],
      "rear-fly": [
        { weight: 20, reps: 15 },
        { weight: 20, reps: 14 },
        { weight: 25, reps: 12 },
        { weight: 25, reps: 11 },
      ],
    },
    notes: "Good push day.",
  },
];

type SetEntry = {
  weight: string;
  reps: string;
};

function getCardioFields(dayId: string) {
  return dayId === "cardio";
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"today" | "dashboard" | "history" | "notes">("today");
  const [program] = useState(initialProgram);
  const [selectedDayId, setSelectedDayId] = useState(program.days[0].id);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetEntry[]>>({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [cardioMinutes, setCardioMinutes] = useState("");
  const [cardioDistance, setCardioDistance] = useState("");
  const [cardioNotes, setCardioNotes] = useState("");
  
  const todayWorkout = program.days.find((d) => d.id === selectedDayId)!;
  const lastSession = history.find((h) => h.dayId === selectedDayId);

  function getDefaultSets(exerciseId: string): SetEntry[] {
    const exercise = todayWorkout.exercises.find((e) => e.id === exerciseId)!;
    const prior = lastSession?.exerciseResults?.[exerciseId] || [];
    return Array.from({ length: exercise.sets }, (_, i) => ({
      weight: prior[i]?.weight?.toString() || "",
      reps: "",
    }));
  }

  function getLoggedSets(exerciseId: string) {
    return exerciseLogs[exerciseId] || getDefaultSets(exerciseId);
  }

  function updateSet(exerciseId: string, index: number, field: "weight" | "reps", value: string) {
    setExerciseLogs((prev) => {
      const existing = prev[exerciseId] || getDefaultSets(exerciseId);
      const updated = existing.map((s, i) => (i === index ? { ...s, [field]: value } : s));
      return { ...prev, [exerciseId]: updated };
    });
  }

  function checkBeatLast(exerciseId: string, setIndex: number) {
    const current = getLoggedSets(exerciseId)[setIndex];
    const prior = lastSession?.exerciseResults?.[exerciseId]?.[setIndex];
    if (!current || !prior) return false;

    const currentWeight = Number(current.weight || 0);
    const currentReps = Number(current.reps || 0);

    return currentWeight > prior.weight || (currentWeight === prior.weight && currentReps > prior.reps);
  }

  function getSuggestedJump(exerciseId: string, setIndex: number) {
    const prior = lastSession?.exerciseResults?.[exerciseId]?.[setIndex];
    if (!prior?.weight) return null;
    return prior.weight + 5;
  }

  function finishWorkout() {
    if (selectedDayId === "cardio") {
      const cardioEntry = {
        date: new Date().toISOString().slice(0, 10),
        dayId: selectedDayId,
        exerciseResults: {},
        notes: `Minutes: ${cardioMinutes || "-"}, Distance: ${cardioDistance || "-"}, Notes: ${cardioNotes || "-"}`,
      };
      setHistory((prev) => [cardioEntry, ...prev]);
      setCardioMinutes("");
      setCardioDistance("");
      setCardioNotes("");
      return;
    }

    const exerciseResults: Record<string, { weight: number; reps: number }[]> = {};
    todayWorkout.exercises.forEach((ex) => {
      exerciseResults[ex.id] = getLoggedSets(ex.id).map((set) => ({
        weight: Number(set.weight || 0),
        reps: Number(set.reps || 0),
      }));
    });

    setHistory((prev) => [
      {
        date: new Date().toISOString().slice(0, 10),
        dayId: selectedDayId,
        exerciseResults,
        notes: sessionNotes,
      },
      ...prev,
    ]);

    setSessionNotes("");
    setExerciseLogs({});
  }

  const sessionsThisWeek = history.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
              <Flame className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Adeptus Forge</h1>
              <p className="text-sm text-zinc-400">Boring. Consistent. Relentless.</p>
            </div>
          </div>
          <div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
            Prototype V1
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <TabButton active={activeTab === "today"} onClick={() => setActiveTab("today")} icon={<Dumbbell className="h-4 w-4" />} label="Today" />
          <TabButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")} icon={<History className="h-4 w-4" />} label="History" />
          <TabButton active={activeTab === "notes"} onClick={() => setActiveTab("notes")} icon={<CalendarDays className="h-4 w-4" />} label="Notes" />
        </div>

        {activeTab === "today" && (
            <div key={selectedDayId} className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-1 text-sm text-zinc-400">Start Workout</div>
                  <div className="text-2xl font-semibold">{todayWorkout.name}</div>
                  <div className="text-xs text-zinc-500">DEBUG: {selectedDayId}</div>
                  <div className="text-sm text-zinc-500">Open workout. Log fast. Beat last time.</div>
                </div>
                <div className="flex flex-wrap gap-2 md:w-[520px]">
                  {program.days.map((d) => (
                  <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDayId(d.id);
                    setExerciseLogs({});
                    setSessionNotes("");
                  }}
                  className={`rounded-2xl border px-3 py-2 text-sm transition ${
                    selectedDayId === d.id
                      ? "border-orange-500 bg-orange-500 text-black"
                      : "border-zinc-700 bg-zinc-950 text-white"
                  }`}
                >
                  {d.name}
                </button>
            ))}
          </div>
              </div>
            </div>

            {getCardioFields(selectedDayId) ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                <h2 className="mb-4 text-xl font-semibold">Cardio Session</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={cardioMinutes}
                    onChange={(e) => setCardioMinutes(e.target.value)}
                    placeholder="Minutes"
                    className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                  />
                  <input
                    value={cardioDistance}
                    onChange={(e) => setCardioDistance(e.target.value)}
                    placeholder="Distance"
                    className="rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                  />
                </div>
                <textarea
                  value={cardioNotes}
                  onChange={(e) => setCardioNotes(e.target.value)}
                  placeholder="Peloton ride, run, row, long walk, effort, intervals..."
                  className="mt-3 min-h-[120px] w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                />
                <button
                  onClick={finishWorkout}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 font-medium text-black hover:bg-orange-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save Cardio Session
                </button>
              </div>
            ) : (
              <>
                {todayWorkout.exercises.map((ex) => {
                  const sets = getLoggedSets(ex.id);
                  const priorSets = lastSession?.exerciseResults?.[ex.id] || [];

                  return (
                    <div key={ex.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">{ex.name}</h2>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs">
                            <Pill>{ex.sets} sets</Pill>
                            <Pill>
                              {ex.repMin}-{ex.repMax} reps
                            </Pill>
                            {selectedDayId === "push-heavy" && ex.sets === 4 && <Pill>4th set finisher</Pill>}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 text-sm text-zinc-400">
                        Last week:{" "}
                        {priorSets.length
                          ? priorSets.map((s, i) => `S${i + 1} ${s.weight} x ${s.reps}`).join(" • ")
                          : "No prior data yet"}
                      </div>

                      <div className="space-y-3">
                        {sets.map((set, i) => {
                          const prior = priorSets[i];
                          const suggested = getSuggestedJump(ex.id, i);
                          const beatLast = checkBeatLast(ex.id, i);

                          return (
                            <div
                              key={i}
                              className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-12 md:items-center"
                            >
                              <div className="md:col-span-2 text-sm text-zinc-400">Set {i + 1}</div>

                              <div className="md:col-span-2">
                                <input
                                  value={set.weight}
                                  onChange={(e) => updateSet(ex.id, i, "weight", e.target.value)}
                                  placeholder={prior?.weight ? `Last ${prior.weight}` : "Weight"}
                                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <input
                                  value={set.reps}
                                  onChange={(e) => updateSet(ex.id, i, "reps", e.target.value)}
                                  placeholder={prior?.reps ? `Last ${prior.reps}` : "Reps"}
                                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
                                />
                              </div>

                              <div className="md:col-span-3 text-xs text-zinc-500">
                                {prior ? `Last: ${prior.weight} x ${prior.reps}` : "No previous set"}
                                {suggested ? <div>Suggested jump: {suggested}</div> : null}
                              </div>

                              <div className="md:col-span-3">
                                {beatLast ? (
                                  <div className="inline-block rounded-full bg-emerald-700 px-3 py-1 text-xs font-medium text-white">
                                    Achievement: Beat Last Session
                                  </div>
                                ) : (
                                  <div className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                                    Match or beat last time
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                  <h2 className="mb-3 text-xl font-semibold">Finish Workout</h2>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Quick notes: energy, aches, substitutions, wins..."
                    className="min-h-[120px] w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                  />
                  <button
                    onClick={finishWorkout}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 font-medium text-black hover:bg-orange-400"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Save Session
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard title="Sessions Logged" value={String(history.length)} />
            <DashboardCard title="This Week" value={String(sessionsThisWeek)} />
            <DashboardCard title="Current Split Days" value={String(program.days.length)} />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {history.map((h, idx) => (
              <div key={idx} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-lg font-semibold">
                  {program.days.find((d) => d.id === h.dayId)?.name || "Workout"}
                </div>
                <div className="text-sm text-zinc-400">{h.date}</div>
                <div className="mt-2 text-sm text-zinc-500">{h.notes || "No notes"}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-300">
            Session notes and programming notes can live here later.
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${
        active
          ? "border-orange-500 bg-orange-500 text-black"
          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-200">
      {children}
    </span>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}