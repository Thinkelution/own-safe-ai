"use strict";

(() => {
  const contexts = {
    travel: {
      name: "Travel",
      request: "Use OwnSafeAI’s Travel context to help plan my trip.",
      notes: [
        { type: "Preference", text: "I prefer quiet places, local food and a little room to explore." },
        { type: "Budget", text: "Keep hotels under $120 a night. Walkable neighbourhoods are a plus." },
        { type: "Upcoming", text: "Planning a 5-day trip to Kyoto in November." }
      ]
    },
    work: {
      name: "Work",
      request: "Use OwnSafeAI’s Work context to help draft my project update.",
      notes: [
        { type: "Project", text: "We’re building a small open-source developer tool. The first release should do one thing well." },
        { type: "Style", text: "Keep updates short: what changed, what we learned, and what comes next." },
        { type: "Decision", text: "Start with a simple API and write the documentation before adding more integrations." }
      ]
    },
    personal: {
      name: "Personal",
      request: "Use OwnSafeAI’s Personal context to help plan my week.",
      notes: [
        { type: "Routine", text: "I do my best focused work in the morning. Keep afternoons flexible." },
        { type: "Learning", text: "I’m learning Spanish. Aim for 20 minutes of practice each day." },
        { type: "Preference", text: "Make plans realistic, with time for a walk and a proper lunch." }
      ]
    }
  };

  const get = (id) => document.getElementById(id);
  const tabs = Array.from(document.querySelectorAll(".context-tab"));
  const panel = get("context-panel");
  const list = get("notes-list");
  const form = get("note-form");
  const input = get("new-note");
  const brief = get("context-brief");
  const copyButton = get("copy-brief");
  let active = "travel";
  let copyReset;

  const announce = (message) => { get("demo-status").textContent = message; };

  function updateBrief() {
    const context = contexts[active];
    get("brief-title").textContent = `Prompt for ${get("host-select").value}`;
    get("brief-content").textContent = `${context.request}\n\n${context.name} context (sample notes):\n${context.notes.map((note) => `• ${note.text}`).join("\n")}`;
    copyButton.textContent = "Copy prompt";
  }

  function renderNotes() {
    const context = contexts[active];
    list.replaceChildren();
    for (const note of context.notes) {
      const card = document.createElement("article");
      card.className = "note-card";
      const type = document.createElement("span");
      type.className = "note-type";
      type.textContent = note.type.toUpperCase();
      const text = document.createElement("p");
      text.textContent = note.text;
      card.append(type, text);
      list.append(card);
    }
    get("notes-label").textContent = `${context.notes.length} notes · ${context.name}`;
    get("prompt-text").textContent = context.request;
    if (!brief.hidden) updateBrief();
  }

  function closeForm(returnFocus = false) {
    form.hidden = true;
    form.reset();
    input.setCustomValidity("");
    get("add-note").setAttribute("aria-expanded", "false");
    if (returnFocus) get("add-note").focus();
  }

  function selectContext(tab) {
    active = tab.dataset.context;
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    }
    panel.setAttribute("aria-labelledby", tab.id);
    closeForm();
    brief.hidden = true;
    renderNotes();
    announce(`${contexts[active].name} context selected. ${contexts[active].notes.length} sample notes.`);
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => selectContext(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      const index = tabs.indexOf(tab);
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        selectContext(next);
        next.focus();
      }
    });
  }

  get("add-note").setAttribute("aria-controls", "note-form");
  get("add-note").setAttribute("aria-expanded", "false");
  get("add-note").addEventListener("click", () => {
    if (!form.hidden) {
      closeForm(true);
      return;
    }
    form.hidden = false;
    get("add-note").setAttribute("aria-expanded", "true");
    input.focus();
  });
  get("cancel-note").addEventListener("click", () => closeForm(true));
  input.addEventListener("input", () => input.setCustomValidity(""));
  form.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeForm(true);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.setCustomValidity("Enter a note before saving.");
      input.reportValidity();
      return;
    }
    contexts[active].notes.push({ type: "Your sample note", text });
    renderNotes();
    closeForm(true);
    list.scrollTop = list.scrollHeight;
    announce(`Sample note added to ${contexts[active].name}. It will reset when the page reloads.`);
  });

  get("use-context").setAttribute("aria-controls", "context-brief");
  get("use-context").addEventListener("click", () => {
    brief.hidden = false;
    updateBrief();
    announce(`Prompt prepared for ${get("host-select").value} with ${contexts[active].notes.length} ${contexts[active].name} notes. No data was sent to an AI tool.`);
  });
  get("host-select").addEventListener("change", () => {
    if (!brief.hidden) {
      updateBrief();
      announce(`Prompt prepared for ${get("host-select").value}.`);
    }
  });

  copyButton.addEventListener("click", async () => {
    clearTimeout(copyReset);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(get("brief-content").textContent);
      copyButton.textContent = "Copied ✓";
      announce("Sample prompt copied to clipboard.");
      copyReset = setTimeout(() => { copyButton.textContent = "Copy prompt"; }, 2500);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(get("brief-content"));
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = "Select & copy";
      announce("Clipboard access is unavailable. The prompt is selected; use your browser’s Copy command.");
    }
  });
})();
