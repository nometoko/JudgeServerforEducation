
import os

def get_root_dir():
    # get the root directory of the git repository
    root_dir = os.path.dirname(os.path.abspath(__file__))
    while not os.path.exists(os.path.join(root_dir, '.git')):
        root_dir = os.path.dirname(root_dir)
    return root_dir
