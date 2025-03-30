#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int main(void)
{
    int n = 0;
    scanf("%d", &n);
    double theta = M_PI / 16;
    double* a = (double*)calloc(n + 1, sizeof(double));
    a[0] = 1;
    a[1] = cos(theta);
    
    for (int i = 2; i <= n; i++)
    {
        a[i] = 2 * cos(theta) * a[i - 1] - a[i - 2];
    }
    printf("%.3f\n", a[n]);
    free(a);
}

