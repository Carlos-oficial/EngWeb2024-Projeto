if [ -z "$1" ] || [ $1 = "--help" ] || [ $1 = "-h" ]; then
    echo "Usage: $0 <database_name>"
    exit 1
fi

rand_id=`openssl rand -base64 8`
folder=`pwd`/snapshots/snapshot_$(date +"%Y-%m-%d_%H:%M:%S")

mkdir -p $folder
db_name="$1"

echo "created $folder"

collection_list=$(mongosh $db_name --eval "show collections")
for collection in $collection_list; do
    echo "Exporting $collection..."
    mongoexport -d $db_name -c $collection -o $folder/$db_name/$collection.json 

done 
echo $db_name > $folder/db_name
cd  public/uploads
zip -r $folder/uploads.zip ./*