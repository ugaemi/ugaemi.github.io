---
title: '🧠 124 나라의 숫자'
subtitle: '프로그래머스 Level 2'
date: 2019-09-27
category: 'Algorithm'
draft: false
---

## 문제

> 124 나라가 있다.
> 124 나라에서는 10진법이 아닌 다음과 같은 자신들만의 규칙으로 수를 표현한다.
> 124 나라에는 자연수만 존재한다.
> 124 나라에는 모든 수를 표현할 때 1, 2, 4만 사용한다.
> 자연수 n이 매개변수로 주어질 때, n을 124 나라에서 사용하는 숫자로 바꾼 값을 return 하도록 함수를 완성하라.

* `n`은 500,000,000이하의 자연수이다.

| 10진법 | 124 나라 | 10진법 | 124 나라 |
|--------|----------|--------|----------|
| 1      | 1        | 6      | 14       |
| 2      | 2        | 7      | 21       |
| 3      | 4        | 8      | 22       |
| 4      | 11       | 9      | 24       |
| 5      | 12       | 10     | 41       |

## 나의 풀이

```python
import math


def check_zero(n):
    if not n:
        return '4'
    return str(n)


def country_124(n):
    answer = []
    if n <= 2:
        return str(n)
    else:
        while n > 2:
            answer.append(check_zero(n % 3))
            n = math.floor(n / 3) - 1 if not n % 3 else math.floor(n / 3)
        answer.append(str(n))
    return str(int(''.join(answer[::-1])))
```

문제만 봤을 때는 꽤 쉬워보였는데, 막상 풀어보니 시간이 오래 걸렸다.
124 숫자로만 이루어진 나라라면 3진법을 사용하면 되는데, 문제는 3이라는 숫자는 사용되지 않고 대신 4가 쓰인다는 점이다.

우선 필자는 입력으로 1이나 2가 들어오면 바로 리턴시키도록 하고 3부터 `while`문의 구렁텅이에 빠지도록 했다.
입력값이 3의 배수인 경우에는 나머지가 0이므로 무조건 `4`를 추가한다.
아닌 경우에는 나머지 값 그대로 리스트에 추가한다. 그리고 입력값을 3으로 나눈 몫으로 다시 저장해준다.
이렇게되면 몫이 1 또는 2일 때까지 반복하게 되는데, 반복문을 빠져나오면 마지막 몫을 리스트에 추가한다.
이 리스트는 기댓값과는 반대로 저장되어 있으므로 거꾸로 출력해주어야 한다.

## 다른 사람의 풀이

```python
def country_124(n):
    num = ['1','2','4']
    answer = ""
    while n > 0:
        n -= 1
        answer = num[n % 3] + answer
        n //= 3
    return answer
```

이 분은 124를 미리 `num`이라는 리스트에 저장시켜두고 입력값이 0보다 크면 1을 뺀 후 3으로 나눈 나머지에 대한 인덱스에 해당하는 숫자를 결과값에 추가해주었다.
필자는 몫을 구하기 위해 `math.floor`를 사용했는데 이 코드를 보니 그럴 필요 없이 `//`를 해주면 되는 일이었다..
오늘도 많이 배우고 간다. 하핫

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12899)
