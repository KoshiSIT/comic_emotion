import requests
import json
import random
# BASE_URL = 'http://localhost:3000'
BASE_URL = 'https://comic-emotion-bcf21a2c3dda.herokuapp.com/'
Save_Dir = '../static/json/'


def register(user_number):
    url = f'{BASE_URL}/register'
    data = {
        "name": f"testuser{user_number}",
        "email": f"testuser{user_number}@example.com",
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


def get_jwt_token(user_number):
    url = f'{BASE_URL}/login'
    data = {
        "email": f"testuser{user_number}@example.com",
        "password": "password"
    }
    response = requests.get(url, json=data)
    try:
        json_response = response.json()
        print('Login Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
        jwt_token = json_response['token']
        return jwt_token
    except requests.exceptions.JSONDecodeError:
        print('Login Endpoint Response:', response.status_code)
        print(response.text)
        return None


def test_post_measurement(jwt_token, user_number):
    url = f'{BASE_URL}/measurement'
    params = {
        "bookId": "spy_family-1"
    }
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    print(f'Posting measurement data for testuser{user_number}')
    try:
        with open('../static/json/emotion.json', 'r') as file:
            print('Reading emotion.json file')
            data = json.load(file)
            json_data = json.dumps(data)
            data_size = len(json_data.encode('utf-8'))
            print(f'Data size for testuser{user_number}:', data_size, 'bytes')
            response = requests.post(
                f"{url}/{params['bookId']}", json=data, headers=headers)
            try:
                json_response = response.json()
                print(
                    f'Measurement Endpoint Response for testuser{user_number}:', response.status_code)
                print(json.dumps(json_response, indent=2))
            except requests.exceptions.JSONDecodeError:
                print(
                    f'Measurement Endpoint Response for testuser{user_number}:', response.status_code)
                print(response.text)
    except FileNotFoundError:
        print('Error: emotion.json file not found')
    except json.JSONDecodeError:
        print('Error: Failed to decode JSON from emotion.json')


def test_post_user_manga(jwt_token, book_id):
    url = f'{BASE_URL}/userManga/{book_id}'
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.post(url, headers=headers)
    try:
        json_response = response.json()
        print('User Manga Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('User Manga Endpoint Response:', response.status_code)
        print(response.text)


def test_post_user_manga_page(jwt_token, user_manga_id, user_manga_pages):
    url = f'{BASE_URL}/userMangaPage/{user_manga_id}'
    headers = {
        'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.post(url, json=user_manga_pages, headers=headers)
    try:
        json_response = response.json()
        print('User Manga Page Endpoint Response:', response.status_code)
        print(json.dumps(json_response, indent=2))
    except requests.exceptions.JSONDecodeError:
        print('User Manga Page Endpoint Response:', response.status_code)
        print(response.text)


def create_dummy_users():
    for user_number in range(6, 101):
        register(user_number)


def create_dummy_measurements():
    for user_number in range(6, 101):
        jwt_token = get_jwt_token(user_number)
        if jwt_token:
            test_post_measurement(jwt_token,  user_number)


def create_dumy_user_manga():
    book_id = 'spy_family-1'
    for user_number in range(6, 101):
        jwt_token = get_jwt_token(user_number)
        if jwt_token:
            test_post_user_manga(jwt_token, book_id)


def create_dummy_user_manga_page():
    num_pages = 36

    for user_number in range(6, 101):
        jwt_token = get_jwt_token(user_number)
        if jwt_token:
            user_manga_id = f'testuser{user_number}-spy_family-1'
            user_manga_pages = [{"pageNumber": i, "emotion": random.randint(
                0, 3)} for i in range(1, num_pages + 1)]
            test_post_user_manga_page(
                jwt_token, user_manga_id, user_manga_pages)


# create_dumy_users()
# create_dumy_measurements()
# create_dumy_user_manga()
create_dummy_user_manga_page()
