---
title: '🧠 Reverse Integer'
subtitle: 'LeetCode Easy'
date: 2021-07-06
category: 'Algorithm'
draft: false
---

## 문제

> Given a signed 32-bit integer x, return x with its digits reversed.
> If reversing x causes the value to go outside the signed 32-bit integer range [-2 to the 31, 2 to the 31 - 1], then return 0.

* -2 to the 31 <= x <= 2 to the 31 - 1

## 나의 풀이

```python
def reverse(self, x: int) -> int:
    result = -int(str(x)[1:][::-1]) if x < 0 else int(str(x)[::-1])
    if -2 ** 31 <= result <= (2 ** 31) - 1:
        return result
    return 0
```

나는 문자열 슬라이싱을 통해 해결했다.

## 다른 사람의 풀이

```python
def reverse(self, x: int) -> int:
    rev = int(str(abs(x))[::-1])
    return (-rev if x < 0 else rev) if rev.bit_length() < 32 else 0
```

파이썬의 `int`에는 `bit_length()`라는 비트 길이를 리턴해주는 함수가 있었다!

## References

* [LeetCode](https://leetcode.com/problems/reverse-integer/)
