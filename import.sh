if [ -z "$1" ]; then
    echo "Usage: $0 <folder>"
    exit 1
fi

# Define the MongoDB database name
db_name="$1"

# Iterate through the JSON files in the current directory
for file in $db_name/*.json; do
    collection_name="${file##*/}"  # Remove the folder path
    collection_name="${collection_name%.*}"  # Remove the.json extension
    echo "Importing $collection_name..."
    mongoimport --uri "mongodb://localhost:27017/$db_name" --collection $collection_name --file $file
done