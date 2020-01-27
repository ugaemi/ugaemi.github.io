---
title: '🧠 정수 제곱근 판별'
subtitle: '프로그래머스 Level 1'
date: 2019-08-28
category: 'Algorithm'
draft: false
---

## 문제

> 임의의 정수 n에 대해, n이 어떤 정수 x의 제곱인지 아닌지 판단하려 한다.
n이 정수 x의 제곱이라면 x+1의 제곱을 리턴하고, n이 정수 x의 제곱이 아니라면 -1을 리턴하는 함수를 완성하라.

* `n`은 1이상, 50000000000000 이하인 정수입니다.

## 나의 풀이

```python
import math


def is_sqrt(n):
    return (math.sqrt(n)+1)**2 if str(math.sqrt(n)).split('.')[-1] == '0' else -1
```

제곱근! 을 보자마자 냅다 `import math`부터 했다.
`sqrt` 메소드를 이용해 제곱근을 구해서 위와 같이 풀었다.

## 다른 사람의 풀이

```python
def is_sqrt(n):
    sqrt = n ** (1/2)

    if sqrt % 1 == 0:
        return (sqrt + 1) ** 2
    return 'no'
```

하지만 굳이 `math` 모듈을 import 해서 풀어낼 필요는 없을 것 같다.
이 분처럼 제곱근을 구하는 방법을 알았다면.. 훨씬 속도가 빨라졌을 것이다.
알고리즘 문제를 풀 때는 되도록 외부 모듈을 사용하지 않고 풀어내는 방법을 고민해봐야겠다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12934)
