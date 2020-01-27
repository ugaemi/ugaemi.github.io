---
title: '🧠 서울에서 김서방 찾기'
subtitle: '프로그래머스 Level 1'
date: 2019-08-04
category: 'Algorithm'
draft: false
---

## 문제

> String형 배열 seoul의 element중 Kim의 위치 x를 찾아, 김서방은 x에 있다는 String을 반환하는 함수를 완성하라.
seoul에 Kim은 오직 한 번만 나타나며 잘못된 값이 입력되는 경우는 없다.

* `seoul`은 길이 1 이상, 1000 이하인 배열이다.
* `seoul`의 원소는 길이 1 이상, 20 이하인 문자열이다.
* `Kim`은 반드시 `seoul` 안에 포함되어 있다.

## 나의 풀이

```python
def findKim(seoul):
    idx = 0
    for s in seoul:
        if s == 'Kim':
            return '김서방은 {}에 있다'.format(idx)
        else:
            idx += 1
```

파이썬으로 자바처럼 풀기...ㅎ;
풀면서도 `idx` 변수를 굳이 선언해서 카운팅을 해야하나? 싶었는데 (그럼 왜 안찾아봤어 임마) 예상대로 파이썬에는 입력값의 인덱스를 반환해주는 함수가 존재했다.

## 다른 사람의 풀이

```python
def findKim(seoul):
    return '김서방은 {}에 있다'.format(seoul.index('Kim'))
```

`index()` 함수는 입력값의 인덱스를 반환해준다.
`seoul = ['Jane', 'Kim']` 일 때, `seoul.index('Kim')`은 `seoul` 리스트에서 `'Kim'`의 인덱스를 반환하라는 뜻이므로 1을 반환한다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12919)
