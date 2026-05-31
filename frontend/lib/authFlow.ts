// Tracks whether the user just triggered an explicit logout, so that the
// AuthGuard redirect that follows does not also fire a "Please login first"
// toast on top of the "Logged out" toast. One user action -> one toast.

let intentionalLogout = false;
let resetTimer: ReturnType<typeof setTimeout> | null = null;

export function markIntentionalLogout(): void {
  intentionalLogout = true;
  if (resetTimer) clearTimeout(resetTimer);
  // Safety net: if no AuthGuard consumes the flag (e.g. logging out from a
  // public page), auto-clear it so a later, legitimate prompt isn't swallowed.
  resetTimer = setTimeout(() => {
    intentionalLogout = false;
    resetTimer = null;
  }, 1000);
}

export function consumeIntentionalLogout(): boolean {
  const was = intentionalLogout;
  intentionalLogout = false;
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
  return was;
}
