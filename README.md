## Git

- Git is a open-source distributed version control system or we can say using git we can manage and keep track of our code over a time what is added, what is edited, what is deleted.
- Git is a content tracker and this content means any kind of content not just only software development.

## Github

- Github is platform that build on top of git and use git to store and share code with other so that other can also suggest changes, see, and also contribute. On github developers can also do team collaboration.
- Github brings git capabilities to the cloud.
- Github is git repository hosting provider.

- When we create a file and create commit for that git create a snapshot of that. Once you made another change to the file and commit git doesn't create a new file but create a snapshot again that tells what are the things that has been changed after first commit.

- The most important thing is working directory in git. Working directory is just working project folder.

- Another main concept in git is branch using which git manage to have commit history.

- By default git has main branch or master branch as default branch name on first commit. You can change it if needed.

## How git works internally?
- There are three main key ideas:
1. Snapshots
- Git stores snapshots of each commit.
- Git stores everything using a structure called object database.
- Git stores data as objects with unique hash so when you run `git commit -m "your message"` it returns the hash of that commit.
- So when you commit first git create a blobs and trees then git create a commit object pointing to them.
- In blob, git has stores the content of file.
- In Tree, git stores folders and structure.
- In commit object, git has snapshot pointer to tree, author info, commit message, timestamp, parent commit.
- Git use SHA-1 hashes while commit. And it has feature that if you change anything even one character or remove space then this hash change in next commit.
- A hash key is a small value that is used to represent a large piece of data in a hash system.
- Git has a table that map means key value pair in whih value is our content and keys are this hashes.
- Git uses this keys to identify which content is stored. 
- So, If the values are same we always get the same keys as output from git.


- Github only give a visual re-presentation of what .git folder has.

## Git Commands
- There are basically six-seven commands only that are mostly used.
- `git add .`, `git commit -m "your message"`, `git push`, `git pull`, `git clone`, `git checkout -b <branch_name>`, `git merge`, `git reset`, `git status` this are the commands that only used most of the time.
- When we do `git init` a new .git folder is created which is hidden by default.
- That object database is stored inside `objects/` folder when we do `ls .git` then we can see this objects/ folder.
- This objects folders has two another folder inside it named `info and pack` which is used by git to do the low-level optimization so ignore them.
- When we do `git status` git tells which files are untracked by putting that files into red color and if we want to add that file into the next commit we must run the `git add .` command then you can see files which are not tracked means which are in red now in green.
- `git add .` command tells git that please track this files into next commit and we can also replace the dot with file name. here dot means all files that are in current working directory.
- When you do `git add .` the files are pushed into staged area and when you run `git commit -m "your message"` simply tells git please create a snapshot of this file that I have staged.
- When you run git commit actually objects has been created in the objects directory. run the ls .git again and see.
- When git create a hash it appends the folder name at prefix of that hash to that it will be easy for git to track it.
- If you go to that folder containing hash file of the commit and run `git cat-file <put your hash>` you will see the author commiter tree id.
- In git file names are controlled by tree object not by files.
- A commit points to the tree which captures a snapshot of entire state of repository. Tree points to blob or it can points to other trees to create a hierarchichal structure.
- If you create a two files with same content inside then git only create one reference to it it does not create another one. It doesn't matter if the second file is created in another folder
- so means two files are in different folder then git create a different tree structure but does not create different blob but that both trees points to that same blob and that's why the names of files are controlled by trees not by blob.

- All braches are stored inside the heads folder which is inside refs folder in .git.
- If you open this then you will notice something new that branch is nothing but latest commit hash which is in human readable format.
- Git get to know that which branch is current one using HEAD file which is inside the .git folder.
- You can also create tag but keep in mind that it is immutable means once you create it doesn't change.

- HEAD is always pointing specific branch latest commits.
- If we have three branches and we can different commit history then HEAD always changes if you switch between branches.

- Detached HEAD is HEAD when you checkout specific commit in current working branch then that head becomes the Detached HEAD.
- Detached HEAD simply telling that this commit is not part of any branch. It stat that we are working with specific commit not with latest commit.

## Local Repository and Remote Repository
- local repository means repository which is on our local machine.
- remote repository means repository on github / gitlab.
- we need to connect to them in order to push our code to the github.
- in order to do that the command is used that is `git remote add origin <URL>`.
- Here the remote means repository is remote repository.
- add means establish the connection.
- origin means alias to that url means in future if we want to perform any action then we can use this origin instead of that long url.
- git push and git pull is two commands that used to push the local codebase to the github and get the codebase from github to local respectively.

## Stash and Stage
- Stash means putting changes into stash stack like structure that can be take back when needed.
- Stage means these changes are ready to commit.
- In Stage you can handle what need to changes need to commit and what doesn't need to commit.
- Stash simply means save my work in protected and safe area I will use it after some time.
- Stage means these are the changes that I need to make or I want to push it to the github or gitlab.
- In order to check the staging area we run the command `git ls-files`.
- If you delete any files files from directory then also that files in staging area and if you commit the new changes then that deleted files can also be commit so if you want to delete that files from staging area also you need to run the `git rm` command.