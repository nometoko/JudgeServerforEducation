#include <math.h>
#include <stdio.h>
#include <stdlib.h>

long double func(int n, long double* a)
{
    if (a[n] != INFINITY)
    {
        return a[n];
    }

    long double val = 2 * cos(M_PI / 16) * cos(func(n - 1, a)) - func(n - 2, a) + 0.1 * sin(n * M_PI / 16);
    a[n] = val;
    return val; 
}

int main(void)
{
    int n;
    scanf("%d", &n);
    
    long double* a = (long double*)calloc(n + 1, sizeof(long double));
    for (int i = 0; i <= n; i++)
    {
        a[i] = INFINITY;
    }
    a[0] = 1;
    a[1] = cos(M_PI / 16);

    printf("%.3Lf\n", func(n, a));

    // long double max = 0;
    // long double min = 0;
    // for (int i = 0; i <= n; i++)
    // {
    //     if (max < a[i])
    //     {
    //         max = a[i];
    //     }
    //     else if (min > a[i])
    //     {
    //         min = a[i];
    //     }
    // }
    // printf("%Lf %Lf\n", max, min);
    free(a);
}

