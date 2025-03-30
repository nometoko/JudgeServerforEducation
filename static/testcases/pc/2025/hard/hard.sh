for i in {1..30}; do
    mkdir -p $i
    echo $i >$i/input.txt
done

for i in {31..45}; do
    mkdir -p $i
    echo $((RANDOM % 29969 + 31)) >$i/input.txt
done
mkdir -p 46
echo 30000 >46/input.txt

for i in {31..46}; do
    mkdir -p $i
    randnums=()
    for j in {1..15}; do
        randnums+=($((RANDOM % 29969 + 31)))
    done
    randnums+=("30000")
    printf "%s\n" $randnums >$i/input.txt
done

for i in {1..30}; do
    ./a.out <$i/input.txt >$i/output.txt
done
