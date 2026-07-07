export function emptyPlannerData() {
  return {
    top_priorities: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
    appointments: [
      { time: "", note: "" },
      { time: "", note: "" },
      { time: "", note: "" },
    ],
    personal_todo: Array.from({ length: 5 }, () => ({ text: "", done: false })),
    life_balance: { health: "", family: "", fun: "", spiritual: "" },
    todo_list: Array.from({ length: 8 }, () => ({ text: "", done: false })),
    meals: { breakfast: "", lunch: "", snacks: "", dinner: "" },
    schedule: {},
    water: 0,
    notes: "",
    contacts: [
      { type: "call", name: "" },
      { type: "email", name: "" },
      { type: "call", name: "" },
    ],
    tomorrow_notes: "",
    expenses: [
      { item: "", amount: "" },
      { item: "", amount: "" },
      { item: "", amount: "" },
    ],
    rating: { productivity: 0, mood: 0, health: 0 },
  };
}

export const SCHEDULE_HOURS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00",
];
