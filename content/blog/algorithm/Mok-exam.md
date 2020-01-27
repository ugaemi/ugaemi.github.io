---
title: '🧠 모의고사'
subtitle: '프로그래머스 Level 1'
date: 2019-08-04
category: 'Algorithm'
draft: false
---

## 문제

> 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려 한다.
수포자는 1번 문제부터 마지막 문제까지 다음과 같이 찍는다.
1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...
1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 함수를 작성하라.

* 시험은 최대 10,000 문제로 구성되어있다.
* 문제의 정답은 1, 2, 3, 4, 5중 하나이다.
* 가장 높은 점수를 받은 사람이 여럿일 경우, return하는 값을 오름차순 정렬하라.

## 나의 풀이

```python
def mok_exam(answers):
    j = 0
    k = 0
    pattern2 = [1, 3, 4, 5]
    pattern3 = [3, 1, 2, 4, 5]
    score = [0, 0, 0]
    result = []
    for i in range(0, len(answers)):
        if answers[i] == i % 5 + 1:
            score[0] += 1
        if i % 2 == 0:
            if answers[i] == 2:
                score[1] += 1
            if answers[i] == pattern3[j % len(pattern3)]:
                score[2] += 1
            k += 1
        else:
            if answers[i] == pattern2[k % len(pattern2) - 1]:
                score[1] += 1
            if answers[i] == pattern3[j % len(pattern3)]:
                score[2] += 1
            j += 1
    max_score = max(score)
    i = 0
    for s in score:
        if max_score == s:
            result.append(i + 1)
        i += 1
    return result
```

조잡하기 그지없다... 당장 내가 내일 일어나서 봐도 이해 못할 만큼 길고 형편없다.
for문을 돌면서 index를 변수로 따로 처리해주다보니 이렇게 길어졌다. 또 패턴마다 다르게 비교하느라 쓸데없는 if문이 많아졌다.
다른 사람의 풀이를 보고 나서야 파이썬의 `enumerate()`를 기억해냈다.
알고리즘 문제를 풀 때가 해당 언어의 기본 문법에 가장 신경쓸 수 있는 시간인 것 같다.

## 다른 사람의 풀이

```python
def mok_exam(answers):
    pattern1 = [1,2,3,4,5]
    pattern2 = [2,1,2,3,2,4,2,5]
    pattern3 = [3,3,1,1,2,2,4,4,5,5]
    score = [0, 0, 0]
    result = []

    for idx, answer in enumerate(answers):
        if answer == pattern1[idx%len(pattern1)]:
            score[0] += 1
        if answer == pattern2[idx%len(pattern2)]:
            score[1] += 1
        if answer == pattern3[idx%len(pattern3)]:
            score[2] += 1

    for idx, s in enumerate(score):
        if s == max(score):
            result.append(idx+1)

    return result
```

`enumerate`를 이용하면 index와 value를 함께 처리할 수 있어 부가적인 변수 선언이 필요하지 않다.
또한 세가지 답안 패턴에 대해 정확한 정의를 하고 index를 각 패턴의 길이로 나눈 나머지를 구해주면 훨씬 간결하게 답안을 얻을 수 있다.
파이썬의 내장 함수를 잘 사용할 수 있도록 많은 연습을 해야겠다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42840)
