import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { CalendarDays, LogOut, Save, Loader2 } from "lucide-react";
import PlannerBoard from "@/components/planner/PlannerBoard";
import { emptyPlannerData } from "@/components/planner/defaults";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(emptyPlannerData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedDates, setSavedDates] = useState([]);
  const [dirty, setDirty] = useState(false);
  const saveTimer = useRef(null);
  const skipNextSave = useRef(true);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const loadDay = useCallback(async (d) => {
    setLoading(true);
    skipNextSave.current = true;
    try {
      const { data: res } = await http.get(`/planner/${d}`);
      const def = emptyPlannerData();
      const incoming = res.data || {};
      // Merge: for list fields, empty from backend => use defaults (seed rows)
      const listKeys = [
        "top_priorities",
        "appointments",
        "personal_todo",
        "todo_list",
        "contacts",
        "expenses",
      ];
      const merged = { ...def, ...incoming };
      for (const k of listKeys) {
        if (!Array.isArray(incoming[k]) || incoming[k].length === 0) {
          merged[k] = def[k];
        }
      }
      // life_balance, meals, rating: merge object shallowly
      merged.life_balance = { ...def.life_balance, ...(incoming.life_balance || {}) };
      merged.meals = { ...def.meals, ...(incoming.meals || {}) };
      merged.rating = { ...def.rating, ...(incoming.rating || {}) };
      merged.schedule = { ...(incoming.schedule || {}) };
      setData(merged);
      setDirty(false);
    } catch {
      toast.error("Failed to load planner");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDates = useCallback(async () => {
    try {
      const { data: res } = await http.get("/planner/dates");
      setSavedDates(res.dates || []);
    } catch {}
  }, []);

  useEffect(() => {
    loadDay(dateStr);
  }, [dateStr, loadDay]);

  useEffect(() => {
    loadDates();
  }, [loadDates]);

  // Autosave on data change (debounced)
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveNow();
    }, 1200);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
    // eslint-disable-next-line
  }, [data]);

  const saveNow = async () => {
    setSaving(true);
    try {
      await http.put(`/planner/${dateStr}`, data);
      setDirty(false);
      if (!savedDates.includes(dateStr)) {
        setSavedDates((s) => [...s, dateStr]);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const savedDateObjects = useMemo(
    () => savedDates.map((d) => parseISO(d)),
    [savedDates]
  );

  return (
    <div className="paper-bg min-h-screen">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b-2 border-dashed border-gray-300 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h1 className="brand-title text-4xl">Daily Planner</h1>
            <span className="hidden sm:inline text-ink-muted text-sm font-nunito">
              Hi, {user?.name || user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-testid="date-picker-trigger"
                  className="bg-pastel-pink border-ink hover:bg-pastel-pink/80 font-nunito"
                >
                  <CalendarDays className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {format(selectedDate, "EEE, MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  modifiers={{ saved: savedDateObjects }}
                  modifiersClassNames={{
                    saved:
                      "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-washi-red",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              onClick={saveNow}
              data-testid="save-planner-button"
              disabled={saving || !dirty}
              className="bg-ink hover:bg-black text-white font-nunito"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
              )}
              {saving ? "Saving..." : dirty ? "Save" : "Saved"}
            </Button>

            <Button
              variant="ghost"
              onClick={logout}
              data-testid="logout-button"
              className="text-ink-muted hover:text-ink-red font-nunito"
            >
              <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-[1600px] mx-auto p-6" data-testid="planner-dashboard">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-ink-red" />
          </div>
        ) : (
          <PlannerBoard data={data} setData={setData} dateStr={dateStr} />
        )}
      </main>
    </div>
  );
}
