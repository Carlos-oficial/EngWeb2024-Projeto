if [ -z "$1" ]; then
    echo "Usage: $0 <database_name>"
    exit 1
fi

# Define the MongoDB database name and collections
db_name="$1"

collection_list=$(mongosh $db_name --eval "show collections")
echo  $collection_list
# Iterate through the collections and export each one using mongoexport
for collection in $collection_list; do
    echo $collection
    echo "Exporting $collection..."
    mongoexport -d $db_name -c $collection -o $db_name/$collection.json 

done