from datetime import datetime, timedelta, timezone

def calc_grade_of_students(user_grade: str) -> str:
    #  JTC
    now = datetime.now(tz=timezone(timedelta(hours=9)))

    # "2023-04-01T00:00:00+09:00" の形式
    user_joined_date = datetime.strptime(user_grade, "%Y-%m-%dT%H:%M:%S%z")
    list_of_grade = ["B3", "B4", "M1", "M2", "D1", "D2", "D3", "D4", "D5", "D6"]

    time_passed = now - user_joined_date

    # マイナスの場合はB3
    if time_passed.days < 0:
        return list_of_grade[0]
    # n年生を計算
    grade = time_passed.days // 365
    return list_of_grade[grade + 1]
