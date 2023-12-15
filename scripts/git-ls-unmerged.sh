# Given a list of commits $COMMITS, 
#  list all commits not merged into $BASE_REF

for commit in ${COMMITS//,/ }; do
  commit=$(git merge-base --is-ancestor $commit ${BASE_REF:-"origin/main"} || echo $commit)
  if [ ! -z $commit ]; then
    FILTER+="$commit "
  fi
done

echo "$FILTER"