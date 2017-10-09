find . -type f -regex ".*\.\(js\|jsx\|scss\)" | while read FILENAME; do
    CREATED_AT=`date -d @$(git log --format="%at" $FILENAME | tail -1) +%B\ %d,\ %Y`;
    mkdir -p "$(dirname "../parsed/$FILENAME")"
    (sed "s/{{date}}/$CREATED_AT/" header.txt ; cat $FILENAME) > ../parsed/$FILENAME;
done