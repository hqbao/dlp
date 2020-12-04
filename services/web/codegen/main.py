import dlp.codegen as codegen
import sys
import os

model_file_path = sys.argv[1]
output_dir_path = sys.argv[2]
model_id = sys.argv[3]
token = sys.argv[4]
codegen.generate(json_model_file=model_file_path, output_path=output_dir_path, id=model_id, token=token)
