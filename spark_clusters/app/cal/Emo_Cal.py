import pandas as pd
import pymongo
from scipy import interpolate
import numpy as np
import rmssd_Cal as rm
import time


def load_measurement_ids(uri, db_name, measurement_collection):
    client = pymongo.MongoClient(uri)
    db = client[db_name]
    collection = db[measurement_collection]
    measurement_ids = collection.distinct("measurementId")
    return measurement_ids


def load_data_from_mongodb(uri, db_name, collection_name, measurement_id):
    client = pymongo.MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]
    data = list(collection.find(
        {"measurementId": measurement_id}).sort("timestamp"))
    df = pd.DataFrame(data)
    return df


def Sigma_3(data_list):
    data = data_list.values.tolist()
    x = []
    y_news = []
    index_x = []
    sigma_avg = np.mean(data)
    sigma_mid = np.median(data)
    abs_mid = np.median(np.abs(data - sigma_mid))
    low = sigma_avg - 3 * abs_mid
    high = sigma_avg + 3 * abs_mid
    for k, value in enumerate(data):
        index_x.append(k)
        if value < low or value > high:
            continue
        y_news.append(value)
        x.append(k)
    y_new = interpolate.PchipInterpolator(x, y_news)
    data = (y_new(index_x)).tolist()
    return data


def Arousal(df: pd.DataFrame):
    result = []
    stimu_ba = []
    each_result = []
    stimu_max = df['stimu_num'].max()
    arousal = df['low_beta'] / df['low_alpha']
    arousal = Sigma_3(arousal)
    page_list = df['stimu_num']
    beta_alpha = pd.merge(pd.DataFrame(arousal, columns=['b_a']), pd.DataFrame(
        page_list), left_index=True, right_index=True)
    for stimu in range(stimu_max + 1):
        stimu_ba.append(
            beta_alpha.loc[beta_alpha['stimu_num'] == stimu, 'b_a'].mean())
    for i in range(len(stimu_ba)):
        sub_rest = stimu_ba[i] - stimu_ba[0]
        if np.sign(sub_rest) == 0:
            continue
        else:
            each_result.append(np.sign(sub_rest))
    result.append(each_result)
    return result


def Valence(df: pd.DataFrame):
    rmssd = rm.Hcmp(df)
    result = []
    for data in rmssd:
        each_result = []
        for i in range(len(data)):
            sub_rest = data[i] - data[0]
            if np.sign(sub_rest) == 0:
                continue
            else:
                each_result.append(np.sign(sub_rest))
        result.append(each_result)
    return result


if __name__ == '__main__':
    MONGODB_URI = "mongodb+srv://testuser:password1008@cluster0.naxn3it.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
    db_name = "test"
    measurement_collection = "measurements"
    collection_name = "emotiondatas"

    measurement_ids = load_measurement_ids(
        MONGODB_URI, db_name, measurement_collection)

    start_time = time.time()
    all_results = []
    measurement_ids = measurement_ids[:10]

    for measurement_id in measurement_ids:
        measurement_start_time = time.time()

        # MongoDBからデータを読み込み、DataFrameに変換
        data_time = time.time()
        df = load_data_from_mongodb(
            MONGODB_URI, db_name, collection_name, measurement_id)
        # print(f"Data for measurementId {measurement_id}:")
        # print(df)
        data_end_time = time.time()
        print(data_end_time - data_time)

        df['event'] = pd.to_numeric(df['event'], errors='coerce')

        b_a = Arousal(df)
        rmssd = Valence(df)

        result = []

        for i, data in enumerate(b_a):
            each_result = []
            for j in range(len(data)):
                if data[j] > 0 and rmssd[0][j] > 0:
                    each_result.append(1)
                elif data[j] > 0 and rmssd[0][j] < 0:
                    each_result.append(2)
                elif data[j] < 0 and rmssd[0][j] < 0:
                    each_result.append(3)
                else:
                    each_result.append(4)
            result.append(each_result)

        measurement_end_time = time.time()
        elapsed_time = measurement_end_time - measurement_start_time
        # print(
        #     f"Elapsed time for measurementId {measurement_id}: {elapsed_time:.2f} seconds")
        # print(f"Results for measurementId {measurement_id}: {result}")

        all_results.append((measurement_id, result, elapsed_time))

    total_end_time = time.time()
    total_elapsed_time = total_end_time - start_time

    print("Summary of results:")
    for measurement_id, result, elapsed_time in all_results:
        print(
            f"MeasurementId: {measurement_id}, Elapsed time: {elapsed_time:.2f} seconds, Result: {result}")
    print(f"Total execution time: {total_elapsed_time:.2f} seconds")
