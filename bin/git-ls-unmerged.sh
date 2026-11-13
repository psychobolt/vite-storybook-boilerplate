# Given a list of commits $COMMITS,
#  find all commits not merged into $BASE_REF

REF=""
OUTPUT=""
COUNT=""

read -r -a arr <<< "${COMMITS//$'\n'/ }"
for commit in "${arr[@]}"; do
  git fetch --depth=1 --quiet -- origin "$commit" || return
  git merge-base --is-ancestor -- "$commit" "${BASE_REF:-origin/main}" && continue || {
    merge_base_status=$?
    [[ "$merge_base_status" -eq 1 ]] || return "$merge_base_status"
  }
  commit=$(
    git log --grep="$commit" --pretty=format:'%H' --end-of-options "${BASE_REF:-origin/main}" && echo "$commit"
  ) || return
  REF+="$commit "
  OUTPUT+="$(git rev-parse --short "$commit") "
  COUNT=$((COUNT + 1))
done

OUTPUT=${OUTPUT% }
OUTPUT=${OUTPUT// /-}
