---
title: '🧠 문자열 다루기 기본'
subtitle: '프로그래머스 Level 1'
date: 2019-08-22
category: 'Algorithm'
draft: false
---

## 문제

---

> 문자열 s의 길이가 4 혹은 6이고, 숫자로만 구성돼있는지 확인해주는 함수를 완성하라.
예를 들어 s가 a234이면 False를 리턴하고 1234라면 True를 리턴하면 된다.

* `s`는 길이 1 이상, 길이 8 이하인 문자열이다.

## 나의 풀이

---

```python
def care_str(s):
    if len(s) in [4, 6]:
        try:
            int(s)
            return True
        except:
            return False
    return False
```

4와 6을 리스트로 묶어서 문자열의 길이가 리스트 안에 있는지 확인하고 있을 경우에 int형으로 바꾸어보았다.
이때 문자가 포함되어있다면 `except`로 빠지게 되고 `False`를 리턴하게 된다.

## 다른 사람의 풀이

---

```python
def care_str(s):
    return s.isdigit() and len(s) in (4, 6)
```

`isdigit()` 함수를 보긴 했으나 써먹어본 적이 별로 없어서 기억이 안 났다...
파이썬 내장 함수를 잘 사용하면 정말 간단하게 끝낼 수 있는 문제들이 많다.

## References

---

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12918)
