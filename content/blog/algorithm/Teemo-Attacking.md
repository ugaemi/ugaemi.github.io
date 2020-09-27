---
title: '🧠 Teemo Attacking'
subtitle: 'LeetCode SeptemberLeetCodingChallenge'
date: 2020-09-27
category: 'Algorithm'
draft: false
---

## 문제

> In LOL world, there is a hero called Teemo and his attacking can make his enemy Ashe be in poisoned condition. Now, given the Teemo's attacking ascending time series towards Ashe and the poisoning time duration per Teemo's attacking, you need to output the total time that Ashe is in poisoned condition.
> You may assume that Teemo attacks at the very beginning of a specific time point, and makes Ashe be in poisoned condition immediately. 

* You may assume the length of given time series array won't exceed 10000.
* You may assume the numbers in the Teemo's attacking time series and his poisoning time duration per attacking are non-negative integers, which won't exceed 10,000,000.

## 나의 풀이

```python
def findPoisonedDuration(self, timeSeries: List[int], duration: int) -> int:
    poisoned = 0
    for idx, ts in enumerate(timeSeries):
        if idx == len(timeSeries) - 1 or ts + duration - 1 < timeSeries[idx+1]:
            poisoned += duration
        else:
            poisoned += timeSeries[idx+1] - ts
    return poisoned
```

현재 인덱스의 값과 다음 인덱스 값을 비교해서 `현재 인덱스 + duration - 1`이 다음 인덱스 값보다 작을 때는 `duration`을, 크거나 같은 경우에는 `다음 인덱스 값 - 현재 인덱스 값`을 더해주도록 했다.
이 방식으로 풀었을 때 문제점은 if문으로 항상 조건을 확인해주어야 한다는 것이다.  

## 다른 사람의 풀이

```python
def findPoisonedDuration(self, timeSeries: List[int], duration: int) -> int:
    n = len(timeSeries)
    if n == 0:
        return 0
    
    total = 0
    for i in range(n - 1):
        total += min(timeSeries[i + 1] - timeSeries[i], duration)
    return total + duration
```

굳이 `enumerate`를 사용하지 않고 마지막 인덱스 바로 전까지 돌다가 마지막에 `duration`을 더해주면 되는 거였다.
또 매번 if문으로 검사를 하지 않고 `min()`을 이용해 두 값 중 더 작은 값을 `total`에 더해주는 것이 코드를 간결하게 해준다.  


## References

* [LeetCode](https://leetcode.com/problems/teemo-attacking/)
