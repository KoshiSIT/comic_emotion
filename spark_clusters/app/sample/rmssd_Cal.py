import numpy as np
import pandas as pd
import Emo_cal as ec


def Cal_rMSSD(ibi: list):  # 秒数個，格納されたlistからrMSSDを算出
    plus = 0
    for i in range(len(ibi)-1):
        plus += (ibi[i] - ibi[i+1]) ** 2
    plus = plus / (len(ibi) - 1)
    result = np.sqrt(plus)

    return result


def stimu_rMSSD(data_file: list, base_dir: str):
    page_list = []
    rMSSD_list = []

    for data in data_file:
        df = pd.read_csv(base_dir+data, header=0)
        feature_list = df['RMSSD']

        stimu_list = []
        rMSSD = []

        for k, row in df.iterrows():
            rMSSD_time = []
            if k < 60:
                continue
            if (row['event'] == 100):
                # sti_num += 1
                stimu_list.append(k)
            if k != 0 and k % 30 == 0:
                rMSSD_time = []
                rMSSD_time.append(feature_list[k])
                rMSSD_time.append(k)
                rMSSD.append(rMSSD_time)
        if k % 30 != 0:
            rMSSD_time.append(feature_list[k])
            rMSSD_time.append(k)
            rMSSD.append(rMSSD_time)

        stimu_list.append(k)
        page_list.append(stimu_list)
        rMSSD_list.append(rMSSD)

    return page_list, rMSSD_list


def rMSSD_time(data_file: list, Cal_time: int, base_dir: str):
    feature_name = 'IBI'
    result_list = []

    for file in data_file:
        df = pd.read_csv(base_dir+file, header=0)
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


def Hcmp(data_file: list, base_dir: str):
    Cal_time = 30
    result = []

    page, rMSSD = stimu_rMSSD(data_file, base_dir)
    rMSSD = rMSSD_time(data_file, Cal_time, base_dir)
    print(data_file)
    for i, file in enumerate(data_file):
        rest = []
        df = pd.read_csv(base_dir+file, header=0)

        rest_avg = df.loc[df['stimu_num'] == 0, 'RMSSD'].mean()

        rM_list = []
        B_end = rMSSD[i][-1][1]
        for k in range(len(page[i])):
            if k == 24:
                break
            else:
                page_s = page[i][k]
                page_e = page[i][k+1]

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

            for s in range(len(rMSSD[i])):
                for _ in range(len(num_list)):
                    if rMSSD[i][s][1] == num_list[_]:
                        rM.append(rMSSD[i][s][0])

            rM_avg = np.mean(rM)
            rM_list.append(rM_avg)
        rM_list.insert(0, rest_avg)

        result.append(rM_list)
    return result
