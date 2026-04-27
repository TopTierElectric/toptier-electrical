#!/usr/bin/env bash
set -euo pipefail

# Full 7-step Git cleanup and stabilization sequence.
# Usage: ./scripts/git-cleanup-stabilization.sh

REMOTE="origin"
MAIN_BRANCH="main"
BASE_BRANCH="codex/task-title-fp6kng"
BRANCHES=(
  "codex/add-canonical-urls-to-all-pages"
  "codex/task-title-fp6kng"
  "codex/fix-asset-path-references-in-css"
)

require_git_state() {
  git rev-parse --is-inside-work-tree >/dev/null
  if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
    echo "[error] Remote '$REMOTE' is not configured in this repository." >&2
    exit 1
  fi
}

run() {
  echo "+ $*"
  "$@"
}

echo "== Git cleanup + stabilization =="
require_git_state

# STEP 1 — Sync main
run git fetch "$REMOTE"
run git checkout "$MAIN_BRANCH"
run git pull "$REMOTE" "$MAIN_BRANCH"

# STEP 2 — Rebase each branch onto main
for branch in "${BRANCHES[@]}"; do
  run git checkout "$branch"
  run git fetch "$REMOTE"
  run git rebase "$REMOTE/$MAIN_BRANCH"
  run git push --force-with-lease "$REMOTE" "$branch"
done

# STEP 3 — Rebase dependent branch onto base branch
run git checkout "codex/fix-asset-path-references-in-css"
run git rebase "$REMOTE/$BASE_BRANCH"
run git push --force-with-lease "$REMOTE" "codex/fix-asset-path-references-in-css"

# STEP 4 — Merge branches into main in order
run git checkout "$MAIN_BRANCH"
run git pull "$REMOTE" "$MAIN_BRANCH"

run git merge --no-ff "codex/add-canonical-urls-to-all-pages"
run git push "$REMOTE" "$MAIN_BRANCH"

run git merge --no-ff "codex/task-title-fp6kng"
run git push "$REMOTE" "$MAIN_BRANCH"

run git merge --no-ff "codex/fix-asset-path-references-in-css"
run git push "$REMOTE" "$MAIN_BRANCH"

# STEP 5 — Delete merged branches (local + remote)
run git branch -d "codex/add-canonical-urls-to-all-pages"
run git branch -d "codex/task-title-fp6kng"
run git branch -d "codex/fix-asset-path-references-in-css"

run git push "$REMOTE" --delete "codex/add-canonical-urls-to-all-pages"
run git push "$REMOTE" --delete "codex/task-title-fp6kng"
run git push "$REMOTE" --delete "codex/fix-asset-path-references-in-css"

# STEP 6 — Create stabilization branch and open PR
run git checkout "$MAIN_BRANCH"
run git pull "$REMOTE" "$MAIN_BRANCH"
run git checkout -b stabilization

echo "[action required] Perform cleanup fixes before continuing."
echo "Then run:"
echo "  git commit -am \"Stabilization: post-merge cleanup and polish\""
echo "  git push $REMOTE stabilization"
echo "  Open PR: base=main compare=stabilization"
echo "           title=Stabilization: Post-merge cleanup and polish"

# STEP 7 — Finalize after PR merge
cat <<'POST_MERGE'
After the stabilization PR is merged, run:
  git branch -d stabilization
  git push origin --delete stabilization
POST_MERGE

echo "== Sequence completed through branch setup; waiting on manual cleanup/PR merge gates. =="
