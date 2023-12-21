# Given a list of commits $COMMITS, 
#  find all commits not merged into $BASE_REF

REF=""
OUTPUT=""
COUNT=""

eval "arr=($COMMITS)"
for commit in "${arr[@]}"; do
  git fetch --depth=1 origin $commit
  commit=$(git merge-base --is-ancestor $commit ${BASE_REF:-"origin/main"} || echo $commit)
  if [ ! -z $commit ]; then
    REF+="$commit "
    OUTPUT+="$(git rev-parse --short $commit) "
    COUNT=$((COUNT + 1))
  fi
done

OUTPUT=$(echo $OUTPUT | tr " " -)