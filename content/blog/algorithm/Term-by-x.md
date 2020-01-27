---
title: '🧠 x만큼 간격이 있는 n개의 숫자'
subtitle: '프로그래머스 Level 1'
date: 2019-09-15
category: 'Algorithm'
draft: false
---

## 문제

> 함수 solution은 정수 x와 자연수 n을 입력 받아, x부터 시작해 x씩 증가하는 숫자를 n개 지니는 리스트를 리턴해야 한다.
> 다음 제한 조건을 보고, 조건을 만족하는 함수를 완성하라.

* `x`는 -10000000 이상, 10000000 이하인 정수입니다.
* `n`은 1000 이하인 자연수입니다.

## 나의 풀이

```python
def term_by_x(x, n):
    answer = [x]
    for i in range(n - 1):
        answer.append(answer[-1] + x)
    return answer
```

## 다른 사람의 풀이

```python
def term_by_x(x, n):
    return [i * x + x for i in range(n)]
```

제너레이터로 한 줄이면 될걸...따흑

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12954)
