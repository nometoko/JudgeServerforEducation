#include <stdio.h>
#include <stdlib.h>
#include <math.h>

double func(int n)
{
    if (n < 2)
    {
        return cos(n * M_PI / 16);
    }
    return 2 * cos(M_PI / 16) * cos(func(n - 1)) - func(n - 2) + 0.1 * sin(n * M_PI / 16);
}

int main(void)
{
    int n;
    scanf("%d", &n);

    printf("%.3f\n", func(n));
}

