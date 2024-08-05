import numpy as np
import pandas as pd


def Cal_rMSSD(ibi: list):  # 秒数個，格納されたlistからrMSSDを算出
    plus = 0
    for i in range(len(ibi)-1):
        plus += (ibi[i] - ibi[i+1]) ** 2
    plus = plus / (len(ibi) - 1)
    result = np.sqrt(plus)

    return result


def stimu_rMSSD(df: pd.DataFrame):
    page_list = []
    rMSSD_list = []

    feature_list = df['RMSSD']
    stimu_list = []
    rMSSD = []
    # df['event'] = df['event'].astype(int)

    for k, row in df.iterrows():
        rMSSD_time = []
        if k < 60:
            continue
        if (row['event'] == 100):
            stimu_list.append(k)
        if k != 0 and k % 30 == 0:
            rMSSD_time.append(feature_list[k])
            rMSSD_time.append(k)
            rMSSD.append(rMSSD_time)
    if k % 30 != 0:
        rMSSD_time.append(feature_list[k])
        rMSSD_time.append(k)
        rMSSD.append(rMSSD_time)

    stimu_list.append(k)
    # print(stimu_list)
    page_list.append(stimu_list)
    rMSSD_list.append(rMSSD)
    # print(page_list)
    return page_list, rMSSD_list


def rMSSD_time(df: pd.DataFrame, Cal_time: int):
    feature_name = 'IBI'
    result_list = []

    feature_list = df[feature_name]
    ibi_lists = []
    rM_ti = []
    result = []

    for j, ibi in enumerate(feature_list):
        if j > (60 - Cal_time):
            ibi_lists.append(ibi)
            if len(ibi_lists) == Cal_time:
                Caltime_rM = Cal_rMSSD(ibi_lists)
                rM_ti.append(Caltime_rM)
                rM_ti.append(j)
                result.append(rM_ti)
                rM_ti = []
                ibi_lists = []

    rM_ti = []
    ibi_lists = []

    if j % Cal_time != 0:
        last_time = j - Cal_time
        for _ in range(last_time, j):
            ibi_lists.append(feature_list[_])
        Caltime_rM = Cal_rMSSD(ibi_lists)
        rM_ti.append(Caltime_rM)
        rM_ti.append(j)
        result.append(rM_ti)

    result_list.append(result)

    return result_list


def Hcmp(df: pd.DataFrame):
    Cal_time = 30
    result = []

    page, rMSSD = stimu_rMSSD(df)
    # print(rMSSD)
    # ok
    rMSSD = rMSSD_time(df, Cal_time)
    # print(rMSSD)
    # ok

    rest_avg = df.loc[df['stimu_num'] == 0, 'RMSSD'].mean()
    rM_list = [rest_avg]

    B_end = rMSSD[0][-1][1]
    # print(page)
    for k in range(len(page[0])):
        if k == 24:
            break
        else:
            page_s = page[0][k]
            page_e = page[0][k+1]

        B_list = []
        rM = []
        num_list = []

        for _ in range(Cal_time):
            if page_s % Cal_time == 0:
                B_list.append(page_s)
                break
            page_s -= 1

        for _ in range(Cal_time):
            if page_e % Cal_time == 0 or page_e == B_end:
                B_list.append(page_e)
                break
            page_e += 1

        B = B_list[0]

        for _ in range(20):
            if B_list[1] % Cal_time == 0:
                num_list.append(B)
                B = B + Cal_time
                if B > B_list[1]:
                    break
            else:
                num_list.append(B)
                B = B + Cal_time
                if B > B_list[1]:
                    num_list.append(B_list[1])
                    break
        del num_list[0]

        for s in range(len(rMSSD[0])):
            for _ in range(len(num_list)):
                if rMSSD[0][s][1] == num_list[_]:
                    rM.append(rMSSD[0][s][0])

        rM_avg = np.mean(rM)
        rM_list.append(rM_avg)

    result.append(rM_list)
    # print(result)
    return result
