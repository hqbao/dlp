#!
cd codegen
rm -rf $1
mkdir $1
echo $2 > $1/model.json
python3 main.py $1/model.json $1 $3
ipynb-py-convert $1/play.py $1/play.ipynb
cd ..
echo Success