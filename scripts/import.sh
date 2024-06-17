if [ -z "$1" ] || [ $1 = "--help" ] || [ $1 = "-h" ]; then
    echo "Usage: $0 <snapshot folder>"
    exit 1
fi

# Define the MongoDB database name
db_name=`cat $1/db_name`
echo db name is $db_name
db_folder=$1/$db_name
echo db folder is $db_folder
# Iterate through the JSON files in the current directory
for file in $db_folder/*.json; do
    collection_name="${file##*/}"  # Remove the folder path
    collection_name="${collection_name%.*}"  # Remove the.json extension
    echo "Importing $collection_name..."
    mongoimport --uri "mongodb://localhost:27017/$db_name" --collection $collection_name --file $file
done

unzip -d public/uploads $1/uploads.zip