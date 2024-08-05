import pandas as pd
import pymongo
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, mean, when
from pyspark.sql.types import DoubleType
import Emo_Cal as ec
import rmssd_Cal as rc
import numpy as np
import sys
import os

MONGODB_URI = "mongodb+srv://testuser:password1008@cluster0.naxn3it.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
measurement_id = "testuser6-2024-07-27T07:45:33.828Z"
db_name = "test"
collection_name = "emotiondatas"


def create_spark_session():
    spark = SparkSession.builder \
        .appName("EmotionClassification") \
        .getOrCreate()
    return spark


def load_data_from_mongodb(uri, db_name, collection_name, measurement_id):
    client = pymongo.MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]

    data = list(collection.find(
        {"measurementId": measurement_id}).sort("timestamp"))
    df = pd.DataFrame(data)
    return df


def process_data_with_spark(df, spark):
    # 必要な列を数値型に変換
    numeric_cols = ['low_beta', 'low_alpha',
                    'IBI', 'RMSSD', 'stimu_num', 'event']
    for col_name in numeric_cols:
        df = df.withColumn(col_name, col(col_name).cast(DoubleType()))

    # Arousal計算
    arousal_result = ec.Arousal_spark(df, spark)

    # rMSSD計算
    valence_result = rc.Hcmp_spark(df)

    return arousal_result, valence_result


if __name__ == '__main__':
    # PySparkセッションを作成
    spark = create_spark_session()

    # MongoDBからデータを読み込み、DataFrameに変換
    df = load_data_from_mongodb(
        MONGODB_URI, db_name, collection_name, measurement_id)
    print(df)
    df['event'] = pd.to_numeric(df['event'], errors='coerce')
    # pandas DataFrameをSpark DataFrameに変換
    pd.DataFrame.iteritems = pd.DataFrame.items
    df = df.drop(columns=['_id'])
    spark_df = spark.createDataFrame(df)

    # データを処理
    arousal_result, valence_result = process_data_with_spark(spark_df, spark)

    # 必要に応じて結果を表示
    print(arousal_result)
    print(valence_result)

    # SparkSessionの停止
    spark.stop()
