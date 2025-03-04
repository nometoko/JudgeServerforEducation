from datetime import datetime

import auth

def check_b3(user: auth.TokenData) -> bool:
  joined_date = datetime.strptime(user.authJoinedDate, "%Y-%m-%dT%H:%M:%S")
  now = datetime.now()
  if (joined_date.year == now.year):
    return True
  else:
    return False
