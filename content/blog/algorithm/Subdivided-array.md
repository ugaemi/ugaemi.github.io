---
title: '🧠 나누어 떨어지는 숫자 배열'
subtitle: '프로그래머스 Level 1'
date: 2019-08-09
category: 'Algorithm'
draft: false
---

## 문제

> array의 각 element 중 divisor로 나누어 떨어지는 값을 오름차순으로 정렬한 배열을 반환하는 함수를 작성하라.
divisor로 나누어 떨어지는 element가 하나도 없다면 배열에 -1을 담아 반환하라.

* `arr`은 자연수를 담은 배열이다.
* 정수 `i`, `j`에 대해 `i ≠ j` 이면 `arr [i] ≠ arr [j]`이다.
* `divisor`는 자연수이다.
* `array`는 길이 1 이상인 배열이다.

## 나의 풀이

```python
def num_array(arr, divisor):
    answer = [a for a in arr if a % divisor == 0]
    return sorted(answer) if answer else [-1]
```

이번 문제는 나름 간단하게 풀어낸 것 같다. (뿌듯)
최대한 짧게 써보려고 노력했다.

## 다른 사람의 풀이

```python
def num_array(arr, divisor): return sorted([n for n in arr if n%divisor == 0]) or [-1]
```

이 분처럼 `or`로 간단하게 리스트의 유무를 판단해도 좋을 것 같다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12910)
