import os
import pandas as pd
import numpy as np
from scipy import interpolate
import rmssd_Cal as rm
import requests
import argparse
import json


# 3sigma法による外れ値の除去
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

# 縦軸


def Arousal(data_file: list, base_dir: str):
    result = []

    for file in data_file:
        stimu_ba = []
        each_result = []

        data = pd.read_csv(base_dir+file)
        stimu_max = data['stimu_num'].max()
        arousal = data['low_beta'] / data['low_alpha']
        arousal = Sigma_3(arousal)
        # check ok
        # print(arousal)
        page_list = data['stimu_num']

        beta_alpha = pd.merge(pd.DataFrame(arousal, columns=['b_a']), pd.DataFrame(
            page_list), left_index=True, right_index=True)

        for stimu in range(stimu_max+1):
            stimu_ba.append(
                beta_alpha.loc[beta_alpha['stimu_num'] == stimu, 'b_a'].mean())

        for i in range(len(stimu_ba)):
            sub_rest = stimu_ba[i] - stimu_ba[0]
            if np.sign(sub_rest) == 0:
                continue
            else:
                each_result.append(np.sign(sub_rest))
        result.append(each_result)
    # print(result)
    return result


# 横軸
def Valence(data_file: list, base_dir: str):
    rmssd = rm.Hcmp(data_file, base_dir)
    # print(rmssd)
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
    result = []
    base_dir = '../../data/emotion_csv/'
    data_file = os.listdir(base_dir)

    b_a = Arousal(data_file, base_dir)
    rmssd = Valence(data_file, base_dir)
    # print(b_a)
    # print(rmssd)
    for i, data in enumerate(b_a):
        each_result = []
        for j in range(len(data)):
            if data[j] > 0 and rmssd[i][j] > 0:
                each_result.append(1)
            elif data[j] > 0 and rmssd[i][j] < 0:
                each_result.append(2)
            elif data[j] < 0 and rmssd[i][j] < 0:
                each_result.append(3)
            else:
                each_result.append(4)
        result.append(each_result)
    print(result)
