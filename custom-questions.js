(() => {
  const CUSTOM_API = "https://xjehryhkqvjpbduqumso.supabase.co/functions/v1/yarper-custom-questions";
  const $custom = (id) => document.getElementById(id);
  let ownQuestions = [];
  let editingQuestionId = null;
  let customMode = "mixed";
  let poolCache = new Map();
  let customReturnToGame = false;

  async function customRequest(action, payload = {}) {
    if (!token) throw new Error("Reconnect to your couple space first.");
    const response = await fetch(CUSTOM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-yarper-token": token },
      body: JSON.stringify({ action, ...payload })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) throw new Error(data.error || "Could not complete that request.");
    return data;
  }

  function modeLabel(value) {
    return ({ questions: "Questions", challenges: "Challenges", truth: "Truth or Dare", cards: "Couple Cards", date: "Date Night" })[value] || value;
  }

  function renderOwnQuestions() {
    const list = $custom("customQuestionList");
    if (!list) return;
    if (!ownQuestions.length) {
      list.innerHTML = '<div class="custom-empty">You have not added any questions yet. Create your first one above.</div>';
      return;
    }
    list.innerHTML = ownQuestions.map((item) => `
      <article class="custom-manage-item">
        <p>${escapeCustom(item.question)}</p>
        <div class="custom-manage-meta"><span class="custom-pill">${modeLabel(item.game_mode)}</span><span class="custom-pill">${item.visibility === "private" ? "Private · partner only" : "Shared · both of you"}</span></div>
        <div class="custom-manage-actions"><button type="button" data-edit-custom="${item.id}">Edit</button><button type="button" data-delete-custom="${item.id}">Delete</button></div>
      </article>`).join("");
    list.querySelectorAll("[data-edit-custom]").forEach((button) => button.addEventListener("click", () => editCustomQuestion(button.dataset.editCustom)));
    list.querySelectorAll("[data-delete-custom]").forEach((button) => button.addEventListener("click", () => deleteCustomQuestion(button.dataset.deleteCustom)));
  }

  function escapeCustom(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  async function loadOwnQuestions() {
    const status = $custom("customQuestionStatus");
    status.textContent = "Loading your questions…";
    try {
      const result = await customRequest("list");
      ownQuestions = result.questions || [];
      renderOwnQuestions();
      status.textContent = ownQuestions.length + " of 100 questions saved.";
    } catch (error) {
      status.textContent = error.message;
      $custom("customQuestionList").innerHTML = '<div class="custom-empty">Your questions could not be loaded. Check your connection and try again.</div>';
    }
  }

  window.openCustomQuestions = async function(fromGame = false) {
    customReturnToGame = Boolean(fromGame);
    resetCustomForm();
    $custom("customQuestionsModal").classList.add("show");
    await loadOwnQuestions();
  };

  window.closeCustomQuestions = function() {
    $custom("customQuestionsModal").classList.remove("show");
    if (customReturnToGame && $custom("gameModal").classList.contains("show")) window.renderGame();
    customReturnToGame = false;
  };

  function resetCustomForm() {
    editingQuestionId = null;
    $custom("customQuestionText").value = "";
    $custom("customQuestionMode").value = customReturnToGame ? mode : "questions";
    $custom("customQuestionVisibility").value = "private";
    $custom("customQuestionSave").textContent = "Save question";
    $custom("customQuestionCancel").classList.add("hidden");
    $custom("customQuestionFormTitle").textContent = "Write your own";
    $custom("customQuestionFormStatus").textContent = "Private questions are sent only to your partner. Shared questions can be picked by either of you.";
  }

  function editCustomQuestion(id) {
    const item = ownQuestions.find((question) => question.id === id);
    if (!item) return;
    editingQuestionId = item.id;
    $custom("customQuestionText").value = item.question;
    $custom("customQuestionMode").value = item.game_mode;
    $custom("customQuestionVisibility").value = item.visibility;
    $custom("customQuestionSave").textContent = "Save changes";
    $custom("customQuestionCancel").classList.remove("hidden");
    $custom("customQuestionFormTitle").textContent = "Edit your question";
    $custom("customQuestionText").focus();
  }

  window.cancelCustomQuestionEdit = function() { resetCustomForm(); };

  window.saveCustomQuestion = async function() {
    const question = $custom("customQuestionText").value.trim();
    const game_mode = $custom("customQuestionMode").value;
    const visibility = $custom("customQuestionVisibility").value;
    const button = $custom("customQuestionSave");
    if (question.length < 5 || question.length > 240) {
      $custom("customQuestionFormStatus").textContent = "Write between 5 and 240 characters.";
      return;
    }
    button.disabled = true;
    button.textContent = "Saving…";
    try {
      await customRequest(editingQuestionId ? "update" : "create", {
        ...(editingQuestionId ? { id: editingQuestionId } : {}),
        question, game_mode, visibility
      });
      resetCustomForm();
      poolCache.clear();
      await loadOwnQuestions();
      $custom("customQuestionFormStatus").textContent = "Saved successfully.";
      toast("Your question is saved");
      if ($custom("gameModal").classList.contains("show")) window.renderGame();
    } catch (error) {
      $custom("customQuestionFormStatus").textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = editingQuestionId ? "Save changes" : "Save question";
    }
  };

  async function deleteCustomQuestion(id) {
    if (!confirm("Delete this question?")) return;
    try {
      await customRequest("delete", { id });
      ownQuestions = ownQuestions.filter((item) => item.id !== id);
      poolCache.clear();
      renderOwnQuestions();
      $custom("customQuestionStatus").textContent = ownQuestions.length + " of 100 questions saved.";
      toast("Question deleted");
      if ($custom("gameModal").classList.contains("show")) window.renderGame();
    } catch (error) {
      toast(error.message);
    }
  }

  window.setCustomQuestionMode = function(value) {
    if (!["mixed", "custom_only"].includes(value)) return;
    customMode = value;
    window.renderGame();
  };

  async function loadCustomPool(gameMode) {
    const key = [state.me?.id, gameMode].join(":");
    const cached = poolCache.get(key);
    if (cached && Date.now() - cached.time < 5000) return cached.questions;
    const result = await customRequest("pool", { game_mode: gameMode });
    const questions = result.questions || [];
    poolCache.set(key, { time: Date.now(), questions });
    return questions;
  }

  async function renderCustomPicker(container, gameMode) {
    const key = [state.me?.id, gameMode, customMode].join(":");
    container.innerHTML = '<div class="custom-empty">Loading your custom questions…</div>';
    try {
      const questions = await loadCustomPool(gameMode);
      if (!container.isConnected || key !== [state.me?.id, gameMode, customMode].join(":")) return;
      if (!questions.length) {
        container.innerHTML = customMode === "custom_only"
          ? '<div class="custom-empty">No eligible custom questions in this category yet. Add one, or switch back to Mixed Mode.</div>'
          : '<div class="custom-empty">No custom questions available for this game yet. Your built-in prompts are ready above.</div>';
        return;
      }
      container.innerHTML = '<div class="custom-prompt-label">YOUR CUSTOM PROMPTS</div><div class="custom-prompt-list">' +
        questions.map((item) => `<button class="pick" type="button" data-custom-prompt="${item.id}"><span style="font-size:19px">✍</span><div><strong>${escapeCustom(item.question)}</strong><small>${item.visibility === "private" ? "PRIVATE · FOR YOUR PARTNER" : "SHARED · BOTH OF YOU"}</small></div></button>`).join("") +
        '</div>';
      container.querySelectorAll("[data-custom-prompt]").forEach((button) => {
        button.addEventListener("click", () => {
          const item = questions.find((question) => question.id === button.dataset.customPrompt);
          if (item) chooseCustomQuestion(item.question);
        });
      });
    } catch (error) {
      if (container.isConnected) container.innerHTML = '<div class="custom-empty">' + escapeCustom(error.message) + '</div>';
    }
  }

  async function chooseCustomQuestion(question) {
    try {
      const result = await api("start_game", { mode, question });
      apply(result);
      toast("Custom prompt sent");
    } catch (error) {
      toast(error.message || "Could not send that prompt.");
    }
  }

  const originalRenderGame = window.renderGame;
  window.renderGame = function() {
    originalRenderGame();
    const stage = $custom("gameStage");
    if (!$custom("gameModal").classList.contains("show")) return;
    const canChoose = (!state.game || (state.game.status === "answered" && state.picker_ready)) &&
      state.current_turn === state.role;
    if (!canChoose) return;

    const builtInGrid = stage.querySelector(".pickgrid");
    if (builtInGrid) builtInGrid.style.display = customMode === "custom_only" ? "none" : "grid";

    const controls = document.createElement("div");
    controls.className = "custom-mode-switch";
    controls.innerHTML = `
      <button type="button" data-custom-mode="mixed" class="${customMode === "mixed" ? "active" : ""}">Mixed Mode</button>
      <button type="button" data-custom-mode="custom_only" class="${customMode === "custom_only" ? "active" : ""}">Custom Only</button>`;
    controls.querySelectorAll("[data-custom-mode]").forEach((button) => button.addEventListener("click", () => window.setCustomQuestionMode(button.dataset.customMode)));
    stage.appendChild(controls);

    const customArea = document.createElement("div");
    customArea.id = "customPromptArea";
    stage.appendChild(customArea);
    const manage = document.createElement("button");
    manage.type = "button";
    manage.className = "secondary";
    manage.textContent = "✍ Add or manage your own questions";
    manage.addEventListener("click", () => window.openCustomQuestions(true));
    stage.appendChild(manage);
    renderCustomPicker(customArea, mode);
  };

  const originalStartGame = window.startGame;
  window.startGame = function(gameMode) {
    customMode = "mixed";
    return originalStartGame(gameMode);
  };
})();