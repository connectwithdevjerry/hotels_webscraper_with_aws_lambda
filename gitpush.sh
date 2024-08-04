git add .

echo 'Enter the commit message:'
read commitMessage

echo 'Do you want to backdate the commit? (y/n):'
read backdateChoice

if [ "$backdateChoice" == "y" ]; then
    echo 'Enter the date for the commit (e.g., "2023-10-01" or "2 days ago"):'
    read commitDate
    git commit -m "$commitMessage" --date="$commitDate"
else
    git commit -m "$commitMessage"
fi

echo 'Enter the name of the branch:'
read branch

git push origin "$branch"

read