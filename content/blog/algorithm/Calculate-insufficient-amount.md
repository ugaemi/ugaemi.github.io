---
title: '🧠 부족한 금액 계산하기'
subtitle: '프로그래머스 위클리 챌린지'
date: 2021-08-02
category: 'Algorithm'
draft: false
---

### Contents
- [문제](#문제)
- [나의 풀이](#나의-풀이)
    - [Python](#Python)
    - [JavaScript](#JavaScript)
    - [Go](#Go)
- [다른 사람의 풀이](#다른-사람의-풀이)
- [References](#References)


## 문제

> 새로 생긴 놀이기구는 인기가 매우 많아 줄이 끊이질 않습니다.
> 이 놀이기구의 원래 이용료는 price원 인데, 놀이기구를 N 번 째 이용한다면 원래 이용료의 N배를 받기로 하였습니다. 즉, 처음 이용료가 100이었다면 2번째에는 200, 3번째에는 300으로 요금이 인상됩니다.
> 놀이기구를 count번 타게 되면 현재 자신이 가지고 있는 금액에서 얼마가 모자라는지를 return 하도록 solution 함수를 완성하세요.
> 단, 금액이 부족하지 않으면 0을 return 하세요.

* 놀이기구의 이용료 price : 1 ≤ price ≤ 2,500, price는 자연수
* 처음 가지고 있던 금액 money : 1 ≤ money ≤ 1,000,000,000, money는 자연수
* 놀이기구의 이용 횟수 count : 1 ≤ count ≤ 2,500, count는 자연수

## 나의 풀이

### Python
```python
def solution(price, money, count):
    required_amount = sum(map(lambda x: x * price, range(1, count + 1)))
    return required_amount - money if required_amount > money else 0
```

### JavaScript
```javascript
function solution(price, money, count) {
  let requiredAmount = 0;
  for (let i=1; i<count+1; i++) {
    requiredAmount += i * price;
  }
  return Math.abs(Math.min(money - requiredAmount, 0));
}
```

### Go
```go
func Abs(x int) int {
    if x < 0 {
        return -x
    }
    return x
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}

func solution(price, money, count int) int {
    requiredAmount := 0
    for i := 1; i < count + 1; i++ {
    	requiredAmount += i * price
    }
    return Abs(min(money - requiredAmount, 0))
}

```

## 다른 사람의 풀이

```python
def solution(price, money, count): 
    return abs(min(money - sum([price*i for i in range(1,count+1)]),0))
```

금액에서 가지고 있는 금액을 빼고 양/음수 여부를 판단하여 리턴해주는 방법보다 두 값의 차이를 구하고 `abs`로 절대값을 반환해주면 되는 방법을 사용하는 게 더 깔끔해 보이는 것 같다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/82612)
