# Given a list of commits $COMMITS, 
#  find all commits not merged into $BASE_REF

REF=""
OUTPUT=""

for commit in ${COMMITS//,/ }; do
  commit=$(git merge-base --is-ancestor $commit ${BASE_REF:-"origin/main"} || echo $commit)
  if [ ! -z $commit ]; then
    REF+="$commit "
    OUTPUT+="$(git rev-parse --short $commit) "
  fi
done

OUTPUT=$(echo $OUTPUT | tr " " -)