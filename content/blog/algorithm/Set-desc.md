---
title: '🧠 정수 내림차순으로 배치하기'
subtitle: '프로그래머스 Level 1'
date: 2019-09-14
category: 'Algorithm'
draft: false
---

## 문제

> 함수 solution은 정수 n을 매개변수로 입력받는다.
> n의 각 자릿수를 큰것부터 작은 순으로 정렬한 새로운 정수를 리턴하라.
> 예를들어 n이 118372면 873211을 리턴하면 된다.

* `n`은 1이상 8000000000 이하인 자연수입니다.

## 나의 풀이

```python
def set_desc(n):
    return int(''.join(
        [str(n) for n in sorted([int(num) for num in str(n)], reverse=True)]))
```

쉽게 풀어낸 듯 하지만 자세히 보면 복잡하다.
불필요한 형변환을 많이 한 느낌이 든다.

## 다른 사람의 풀이

```python
def set_desc(n):
    ls = list(str(n))
    ls.sort(reverse = True)
    return int("".join(ls))
```

문자열에 그저 `list()`만 씌워주면 저절로 문자 하나씩 split되어 리스트에 저장된다는 점...
꼭 짚고 넘어가야 할 것 같다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12933)
