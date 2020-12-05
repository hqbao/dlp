import dlp.codegen as codegen
import sys
import os

model_file_path = sys.argv[1]
output_dir_path = sys.argv[2]
encoded_token = sys.argv[3]
codegen.generate_code_for_train(json_model_file=model_file_path, output_path=output_dir_path, encoded_token=encoded_token)
