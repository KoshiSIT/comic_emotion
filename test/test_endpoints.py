import requests
import argparse
import json


# BASE_URL = 'http://localhost:3000'
BASE_URL = 'https://comic-emotion-bcf21a2c3dda.herokuapp.com/'
jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWQyMzU2ZTU0Njg4MGZjMmE0NTJjZiIsImlhdCI6MTcyMTczNDUzMywiZXhwIjoxNzIyMzM5MzMzfQ.NpdTtHN0mMOjXbl16KfNahSGyJwtCHkN5uNyd1FM6WI'

# test ok


def test_register():
    url = f'{BASE_URL}/register'
    data = {
        "name": "testuser101",
        "email": "testuser101@example.com",
        "password": "password"
    }
    response = requests.post(url, json=data)
    try:
        json_response = response.json()
        print('Register Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('Register Endpoint Response:', response.status_code)
        print(response.text)

# test ok


def test_login():
    url = f'{BASE_URL}/login'
    data = {
        "email": "testuser6@example.com",
        "password": "password"
    }
    response = requests.get(url, json=data)
    try:
        json_response = response.json()
        print('Login Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('Login Endpoint Response:', response.status_code)
        print(response.text)

# test ok


def test_post_measurement():
    url = f'{BASE_URL}/measurement'
    params = {
        "bookId": "spi_family-1"
    }
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    print('Posting measurement data ')
    try:
        with open('../static/json/emotion.json', 'r') as file:
            print('Reading emotion.json file')
            data = json.load(file)
            # cal calculate the size of the data
            json_data = json.dumps(data)
            data_size = len(json_data.encode('utf-8'))
            print('Data size:', data_size, 'bytes')
            response = requests.post(
                f"{url}/{params['bookId']}", json=data, headers=headers)
            try:
                json_response = response.json()
                print('Measurement Endpoint Response:', response.status_code)
                print(json.dumps(json_response, indent=2))
            except requests.exceptions.JSONDecodeError:
                print('Measurement Endpoint Response:', response.status_code)
                print(response.text)
    except FileNotFoundError:
        print('Error: emotion.json file not found')
    except json.JSONDecodeError:
        print('Error: Failed to decode JSON from emotion.json')

# test ok


def test_getOwnedMangaEpisode():
    url = f'{BASE_URL}/mangaEpisode/owned'
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.get(url, headers=headers)
    try:
        json_response = response.json()
        print('Owned Manga Episode Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('Owned Manga Episode Endpoint Response:', response.status_code)
        print(response.text)

# test ok


def test_getMangaEpisode():
    title = 'spy_family'
    url = f'{BASE_URL}/mangaEpisode/{title}'
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.get(url, headers=headers)
    try:
        json_response = response.json()
        print('Manga Episode Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('Manga Episode Endpoint Response:', response.status_code)
        print(response.text)

# test ok


def test_getMangaEpisodeContents():
    title = 'spy_family'
    userMangaId = 'testuser6-spy_family-1'
    url = f'{BASE_URL}/mangaEpisode/contents/{userMangaId}'
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.get(url, headers=headers)
    try:
        json_response = response.json()
        print('Manga Episode Contents Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('Manga Episode Contents Endpoint Response:', response.status_code)
        print(response.text)

# test ok


def test_getUserMangaEmotion():
    bookId = 'spy_family-1'
    url = f'{BASE_URL}/userManga/myEmotion/{bookId}'
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.get(url, headers=headers)
    try:
        json_response = response.json()
        print('Manga Emotion Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('Manga Emotion Endpoint Response:', response.status_code)
        print(response.text)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Test API endpoints')
    parser.add_argument('action', choices=[
                        'register', 'login', 'post_measurement', 'getOwnedMangaEpisode', 'getMangaEpisode', 'getMangaEpisodeContents', 'getUserMangaEmotion'
                        ], help='The action to perform')

    args = parser.parse_args()

    if args.action == 'register':
        test_register()
    elif args.action == 'login':
        test_login()
    elif args.action == 'post_measurement':
        test_post_measurement()
    elif args.action == 'getOwnedMangaEpisode':
        test_getOwnedMangaEpisode()
    elif args.action == 'getMangaEpisode':
        test_getMangaEpisode()
    elif args.action == 'getMangaEpisodeContents':
        test_getMangaEpisodeContents()
    elif args.action == 'getUserMangaEmotion':
        test_getUserMangaEmotion()
