import sys
import os
import constants

def have_makefile(exec_dir: str) -> bool:
    # Check if the Makefile exists in exec dir
    return os.path.exists(os.path.join(exec_dir, constants.MAKEFILE_FILENAME))

def copy_makefile(exec_dir: str, makefile_filepath: str):
    # Copy the Makefile to the exec dir
    with open(makefile_filepath, "r") as f:
        with open(os.path.join(exec_dir, constants.MAKEFILE_FILENAME), "w") as f2:
            f2.write(f.read())
