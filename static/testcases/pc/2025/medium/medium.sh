for i in {1..30}; do
    mkdir -p $i
    echo $i >$i/input.txt
done

for i in {1..30}; do
    ./a.out <$i/input.txt >$i/output.txt
done
