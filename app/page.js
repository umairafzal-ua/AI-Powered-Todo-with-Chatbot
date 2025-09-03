"use client";

import { useState, useMemo } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [draft, setDraft] = useState("");

  // === Plain UI handlers ===
  const addOne = (text) => {
    const t = String(text || "").trim();
    if (!t) return;
    setTodos((prev) => [...prev, t]);
    setDraft("");
  };

  const addMany = (items) => {
    const arr = Array.isArray(items) ? items : [];
    const clean = arr.map((x) => String(x).trim()).filter(Boolean);
    if (!clean.length) return;
    setTodos((prev) => [...prev, ...clean]);
  };

  const removeAt = (idx) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
  };

  // === AI actions (called by the model) ===
  // 1) add a single todo
  useCopilotAction({
    name: "addTodoItem",
    description:
      "Add a single todo item to the list. Use this when the user asks to add one item.",
    parameters: [
      {
        name: "todoText",
        type: "string",
        description: "The todo text to add",
        required: true,
      },
    ],
    handler: async ({ todoText }) => {
      addOne(todoText);
      return { ok: true };
    },
  });

 useCopilotAction({
  name: "deleteTodoItem",
  description: "Delete a todo item from the list.",
  parameters: [
    {
      name: "todoIndex",
      type: "number", // change from string → number
      description: "The index of the todo item to delete (0-based index).",
      required: true,
    },
  ],
  handler: async ({ todoIndex }) => {
    const idx = Number(todoIndex); // ensure it's a number
    if (!isNaN(idx)) {
      removeAt(idx);
      return { ok: true, deletedIndex: idx };
    }
    return { ok: false, error: "Invalid index" };
  },
});

  

  // 2) add multiple todos at once
  useCopilotAction({
    name: "addMultipleTodos",
    description:
      "Add multiple todo items to the list at once. Use this when the user specifies several todos.",
    parameters: [
      {
        name: "items",
        type: "array",
        description:
          "An array of todo strings, e.g., ['buy milk','call mom']",
        required: true,
      },
    ],
    handler: async ({ items }) => {
      addMany(items);
      return { ok: true, added: items.length };
    },
  });

  const instructionText = useMemo(
    () =>
      [
        "You are an AI copilot inside a TODO app.",
        "When the user says things like 'add the todo X' or 'add multiple todos: A, B, C',",
        "call the appropriate action:",
        "- If it's a single item → call addTodoItem({ todoText: '...' })",
        "- If there are multiple items → call addMultipleTodos({ items: ['A','B','C'] })",
        "Return concise confirmations. Do not ask for API keys.",
      ].join("\n"),
    []
  );

  return (
    <main className=" bg-blue-100 container mx-auto my-15 rounded-xl p-10 md:w-[50vw]">
      <div className="font-bold max-w-2xl  mx-auto p-6">
        <center><h1 className="text-2xl font-bold mb-3">AI-Powered TODO</h1></center>

        {/* Input + Add */}
        <div className="flex gap-2 mb-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your todo…"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={() => addOne(draft)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* List */}
        {todos.length === 0 ? (
          <p className="text-gray-600"><center>No todos yet!!.</center> </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((t, i) => (
              <li
                key={`${t}-${i}`}
                className="flex items-center justify-between bg-white border rounded px-3 py-2"
              >
                <span>{t}</span>
                <button
                  onClick={() => removeAt(i)}
                  className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* AI Popup (press / or click) */}
        <CopilotPopup
          instructions={instructionText}
          labels={{
            title: "Todo Copilot",
            initial: "How can I help with your todos?",
          }}
        />
      </div>
    </main>
  );
}
