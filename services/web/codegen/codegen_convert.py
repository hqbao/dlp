import dlp.codegen as codegen
import sys
import os

model_file_path = sys.argv[1]
output_dir_path = sys.argv[2]
weights_file_path = sys.argv[3]
jSettings = sys.argv[4]
codegen.generate_code_for_convert(json_model_file=model_file_path, output_path=output_dir_path, weights_file_path=weights_file_path, jSettings=jSettings)