#!
id_dir_name=$1
jmodel=$2
weights_file_path=$3
jsettings=$4

echo $jmodel > codegen/$id_dir_name/model.json
python3 codegen/codegen_convert.py codegen/$id_dir_name/model.json codegen/$id_dir_name $weights_file_path $jsettings
python3 codegen/$id_dir_name/convert.py
rm -rf codegen/$id_dir_name/tfjs
mkdir codegen/$id_dir_name/tfjs
tensorflowjs_converter --input_format=tf_saved_model codegen/$id_dir_name/model/ codegen/$id_dir_name/tfjs/
printf Success