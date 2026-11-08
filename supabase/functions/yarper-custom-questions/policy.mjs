export const CUSTOM_QUESTION_MODES = Object.freeze(["questions", "challenges", "truth", "cards", "date"]);
export const CUSTOM_QUESTION_VISIBILITIES = Object.freeze(["private", "shared"]);

export function cleanCustomQuestion(value) {
  const question = String(value ?? "").replace(/\\s+/g, " ").trim();
  if (question.length < 5 || question.length > 240) {
    throw new Error("Your question must be between 5 and 240 characters.");
  }
  return question;
}

export function isCustomQuestionEligible(question, member, gameMode) {
  if (!question || !member || question.couple_id !== member.couple_id) return false;
  if (question.game_mode !== gameMode) return false;
  if (question.visibility === "shared") return true;
  return question.visibility === "private" && question.creator_member_id !== member.id;
}

export function canManageCustomQuestion(question, member) {
  return Boolean(
    question &&
    member &&
    question.couple_id === member.couple_id &&
    question.creator_member_id === member.id
  );
}
