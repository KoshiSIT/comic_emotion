from pymongo import MongoClient

MONGODB_URI = "mongodb+srv://testuser:password1008@cluster0.naxn3it.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(MONGODB_URI)
    db = client["test"]
    collection = db["mangas"]
    document_count = collection.count_documents({})
    print(
        f"Successfully connected to MongoDB. Document count: {document_count}")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
