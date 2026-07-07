import StickyNote from "./StickyNote";
import { SCHEDULE_HOURS } from "./defaults";
import { Textarea } from "@/components/ui/textarea";
import { Droplet, Star, Heart, Smile, Meh, Frown, Laugh, Angry } from "lucide-react";

// Helper – shallow update of nested field
const updateField = (setData, field, value) =>
  setData((d) => ({ ...d, [field]: value }));

const updateListItem = (setData, field, index, key, value) =>
  setData((d) => {
    const arr = [...d[field]];
    arr[index] = { ...arr[index], [key]: value };
    return { ...d, [field]: arr };
  });

// Checkable text line
function CheckLine({ value, done, onChange, onToggle, placeholder, testIdPrefix, index }) {
  return (
    <div className="flex items-center gap-2 border-b border-dashed border-black/10 py-1">
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => onToggle(e.target.checked)}
        data-testid={`${testIdPrefix}-check-${index}`}
        className="accent-ink-red w-4 h-4 shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`${testIdPrefix}-input-${index}`}
        className={`line-input ${done ? "line-through opacity-60" : ""}`}
      />
    </div>
  );
}

export default function PlannerBoard({ data, setData }) {
  const totalExpense = data.expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0
  );

  const moodIcons = [Angry, Frown, Meh, Smile, Laugh];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start auto-rows-min">
      {/* Top Priorities */}
      <StickyNote color="bg-pastel-yellow" tapeColor="bg-washi-red" title="Top Priorities" index={0} testId="card-top-priorities">
        {data.top_priorities.map((p, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-dashed border-black/10 py-1">
            <span className="handwritten text-lg w-5">{i + 1}</span>
            <input
              type="checkbox"
              checked={p.done}
              onChange={(e) => updateListItem(setData, "top_priorities", i, "done", e.target.checked)}
              data-testid={`priority-check-${i}`}
              className="accent-ink-red w-4 h-4"
            />
            <input
              type="text"
              value={p.text}
              onChange={(e) => updateListItem(setData, "top_priorities", i, "text", e.target.value)}
              placeholder="Priority..."
              data-testid={`priority-input-${i}`}
              className={`line-input ${p.done ? "line-through opacity-60" : ""}`}
            />
          </div>
        ))}
      </StickyNote>

      {/* Appointments */}
      <StickyNote color="bg-pastel-pink" tapeColor="bg-washi-blue" title="Appointments" index={1} testId="card-appointments">
        {data.appointments.map((a, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-dashed border-black/10 py-1.5">
            <input
              type="time"
              value={a.time}
              onChange={(e) => updateListItem(setData, "appointments", i, "time", e.target.value)}
              data-testid={`appointment-time-${i}`}
              className="line-input-body w-24 bg-transparent border-none outline-none text-sm"
            />
            <input
              type="text"
              value={a.note}
              onChange={(e) => updateListItem(setData, "appointments", i, "note", e.target.value)}
              placeholder="Appointment..."
              data-testid={`appointment-note-${i}`}
              className="line-input"
            />
          </div>
        ))}
      </StickyNote>

      {/* To Do List */}
      <StickyNote color="bg-pastel-mint" tapeColor="bg-washi-red" title="To Do List" index={2} testId="card-todo-list">
        {data.todo_list.map((t, i) => (
          <CheckLine
            key={i}
            index={i}
            testIdPrefix="todo"
            value={t.text}
            done={t.done}
            placeholder="Task..."
            onChange={(v) => updateListItem(setData, "todo_list", i, "text", v)}
            onToggle={(v) => updateListItem(setData, "todo_list", i, "done", v)}
          />
        ))}
      </StickyNote>

      {/* Daily Schedules */}
      <StickyNote color="bg-pastel-lavender" tapeColor="bg-washi-yellow" title="Daily Schedules" index={3} className="row-span-2" testId="card-schedule">
        <div className="schedule-scroll max-h-[520px] overflow-y-auto pr-1">
          {SCHEDULE_HOURS.map((h, i) => {
            const entry = data.schedule[h] || { task: "", done: false };
            return (
              <div key={h} className="flex items-center gap-2 border-b border-dashed border-black/10 py-1.5">
                <span className="handwritten text-base w-14 shrink-0">{h}</span>
                <input
                  type="text"
                  value={entry.task}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      schedule: { ...d.schedule, [h]: { ...entry, task: e.target.value } },
                    }))
                  }
                  placeholder="—"
                  data-testid={`schedule-task-${i}`}
                  className={`line-input ${entry.done ? "line-through opacity-60" : ""}`}
                />
                <input
                  type="checkbox"
                  checked={entry.done}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      schedule: { ...d.schedule, [h]: { ...entry, done: e.target.checked } },
                    }))
                  }
                  data-testid={`schedule-check-${i}`}
                  className="accent-ink-red w-4 h-4"
                />
              </div>
            );
          })}
        </div>
      </StickyNote>

      {/* Personal To-Do */}
      <StickyNote color="bg-pastel-peach" tapeColor="bg-washi-blue" title="Personal To-Do" index={4} testId="card-personal">
        {data.personal_todo.map((t, i) => (
          <CheckLine
            key={i}
            index={i}
            testIdPrefix="personal"
            value={t.text}
            done={t.done}
            placeholder="Personal task..."
            onChange={(v) => updateListItem(setData, "personal_todo", i, "text", v)}
            onToggle={(v) => updateListItem(setData, "personal_todo", i, "done", v)}
          />
        ))}
      </StickyNote>

      {/* Meal Planning */}
      <StickyNote color="bg-pastel-peach" tapeColor="bg-washi-red" title="Meal Planning" index={5} testId="card-meals">
        <div className="grid grid-cols-2 gap-3">
          {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
            <div key={meal} className="bg-white/60 rounded-md p-2">
              <div className="text-xs uppercase tracking-wider text-ink-muted font-nunito font-semibold">
                {meal}
              </div>
              <input
                type="text"
                value={data.meals[meal] || ""}
                onChange={(e) => updateField(setData, "meals", { ...data.meals, [meal]: e.target.value })}
                placeholder="..."
                data-testid={`meal-${meal}`}
                className="line-input mt-1"
              />
            </div>
          ))}
        </div>
      </StickyNote>

      {/* Water Tracker */}
      <StickyNote color="bg-pastel-blue" tapeColor="bg-washi-blue" title="Water Tracker" index={6} testId="card-water">
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => updateField(setData, "water", i + 1 === data.water ? i : i + 1)}
              data-testid={`water-drop-${i}`}
              className="transition-transform hover:scale-110"
              aria-label={`Water ${i + 1}`}
            >
              <Droplet
                className="w-7 h-7"
                strokeWidth={1.5}
                fill={i < data.water ? "#73C2FB" : "transparent"}
                color="#3A3A3A"
              />
            </button>
          ))}
          <span className="ml-2 handwritten text-lg">{data.water}/8</span>
        </div>
      </StickyNote>

      {/* Notes / Stuff */}
      <StickyNote color="bg-pastel-yellow" tapeColor="bg-washi-yellow" title="Notes / Stuff" index={7} testId="card-notes">
        <Textarea
          value={data.notes}
          onChange={(e) => updateField(setData, "notes", e.target.value)}
          placeholder="Jot anything down..."
          rows={5}
          data-testid="notes-textarea"
          className="bg-white/50 border-dashed handwritten !text-base"
        />
      </StickyNote>

      {/* Life Balance */}
      <StickyNote color="bg-pastel-mint" tapeColor="bg-washi-yellow" title="Life Balance" index={8} className="md:col-span-2" testId="card-life-balance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: "health", label: "Health & Fitness" },
            { key: "family", label: "Family & Friends" },
            { key: "fun", label: "Fun & Creation" },
            { key: "spiritual", label: "Spiritual" },
          ].map((c) => (
            <div key={c.key} className="bg-white/60 rounded-md p-2 min-h-24">
              <div className="text-xs uppercase tracking-wider text-ink-muted font-nunito font-semibold">
                {c.label}
              </div>
              <Textarea
                value={data.life_balance[c.key] || ""}
                onChange={(e) =>
                  updateField(setData, "life_balance", { ...data.life_balance, [c.key]: e.target.value })
                }
                data-testid={`life-${c.key}`}
                rows={3}
                placeholder="..."
                className="bg-transparent border-none handwritten !text-base p-0 resize-none focus-visible:ring-0"
              />
            </div>
          ))}
        </div>
      </StickyNote>

      {/* Calls / Email / Text */}
      <StickyNote color="bg-pastel-pink" tapeColor="bg-washi-yellow" title="Calls / Email / Text" index={9} testId="card-contacts">
        {data.contacts.map((c, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-dashed border-black/10 py-1">
            <select
              value={c.type}
              onChange={(e) => updateListItem(setData, "contacts", i, "type", e.target.value)}
              data-testid={`contact-type-${i}`}
              className="bg-transparent text-sm font-nunito focus:outline-none"
            >
              <option value="call">call</option>
              <option value="email">email</option>
              <option value="text">text</option>
            </select>
            <span className="text-ink-muted">—</span>
            <input
              type="text"
              value={c.name}
              onChange={(e) => updateListItem(setData, "contacts", i, "name", e.target.value)}
              placeholder="Name..."
              data-testid={`contact-name-${i}`}
              className="line-input"
            />
          </div>
        ))}
      </StickyNote>

      {/* Notes for Tomorrow */}
      <StickyNote color="bg-pastel-blue" tapeColor="bg-washi-red" title="Notes for Tomorrow" index={10} testId="card-tomorrow">
        <Textarea
          value={data.tomorrow_notes}
          onChange={(e) => updateField(setData, "tomorrow_notes", e.target.value)}
          placeholder="Anything for tomorrow..."
          rows={5}
          data-testid="tomorrow-textarea"
          className="bg-white/50 border-dashed handwritten !text-base"
        />
      </StickyNote>

      {/* Expense Tracker */}
      <StickyNote color="bg-pastel-yellow" tapeColor="bg-washi-blue" title="Expense Tracker" index={11} testId="card-expenses">
        {data.expenses.map((e, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-dashed border-black/10 py-1">
            <input
              type="text"
              value={e.item}
              onChange={(ev) => updateListItem(setData, "expenses", i, "item", ev.target.value)}
              placeholder="Item"
              data-testid={`expense-item-${i}`}
              className="line-input flex-1"
            />
            <input
              type="text"
              inputMode="decimal"
              value={e.amount}
              onChange={(ev) => updateListItem(setData, "expenses", i, "amount", ev.target.value)}
              placeholder="0"
              data-testid={`expense-amount-${i}`}
              className="line-input w-20 text-right"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            updateField(setData, "expenses", [...data.expenses, { item: "", amount: "" }])
          }
          data-testid="add-expense-button"
          className="mt-2 text-xs text-ink-muted hover:text-ink-red font-nunito"
        >
          + add row
        </button>
        <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-ink pt-2">
          <span className="handwritten text-lg text-ink">Total</span>
          <span data-testid="expense-total" className="handwritten text-xl text-ink-red">
            {totalExpense.toFixed(2)}
          </span>
        </div>
      </StickyNote>

      {/* Rate Your Day */}
      <StickyNote color="bg-pastel-pink" tapeColor="bg-washi-yellow" title="Rate Your Day" index={12} testId="card-rating">
        {/* Productivity */}
        <div className="mb-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted font-nunito font-semibold mb-1">
            Productivity
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateField(setData, "rating", { ...data.rating, productivity: n })}
                data-testid={`rating-productivity-${n}`}
              >
                <Star
                  className="w-6 h-6"
                  strokeWidth={1.5}
                  fill={n <= (data.rating.productivity || 0) ? "#F4D03F" : "transparent"}
                  color="#3A3A3A"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="mb-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted font-nunito font-semibold mb-1">
            Mood
          </div>
          <div className="flex gap-2">
            {moodIcons.map((Icon, i) => {
              const active = (data.rating.mood || 0) === i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateField(setData, "rating", { ...data.rating, mood: i + 1 })}
                  data-testid={`rating-mood-${i + 1}`}
                >
                  <Icon
                    className="w-7 h-7"
                    strokeWidth={1.5}
                    color={active ? "#D9534F" : "#6B7280"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Health */}
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted font-nunito font-semibold mb-1">
            Health
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateField(setData, "rating", { ...data.rating, health: n })}
                data-testid={`rating-health-${n}`}
              >
                <Heart
                  className="w-6 h-6"
                  strokeWidth={1.5}
                  fill={n <= (data.rating.health || 0) ? "#E85D75" : "transparent"}
                  color="#3A3A3A"
                />
              </button>
            ))}
          </div>
        </div>
      </StickyNote>
    </div>
  );
}
