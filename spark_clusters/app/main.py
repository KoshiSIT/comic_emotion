from pyspark.sql import SparkSession

MONGODB_URI = "mongodb+srv://testuser:password1008@cluster0.naxn3it.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"

spark = SparkSession.builder \
    .appName("example-pyspark-read-and-write") \
    .config("spark.mongodb.read.connection.uri", MONGODB_URI) \
    .config("spark.mongodb.write.connection.uri", MONGODB_URI) \
    .getOrCreate()

try:
    df_mongo = spark.read.format("mongodb").option("uri", MONGODB_URI).option(
        "database", "test").option("collection", "emotiondatas").load()
except Exception as e:
    print(f"Failed to load data from MongoDB: {e}")

df_mongo.show()
# SparkSessionの停止
spark.stop()
