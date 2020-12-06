#!
id_dir_name=$1
jmodel=$2
encoded_token=$3

rm -rf codegen/$id_dir_name
mkdir codegen/$id_dir_name
echo $jmodel > codegen/$id_dir_name/model.json
python3 codegen/codegen_train.py codegen/$id_dir_name/model.json codegen/$id_dir_name $encoded_token
ipynb-py-convert codegen/$id_dir_name/train.py codegen/$id_dir_name/train.ipynb
printf Success