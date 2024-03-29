---
title: '🧠 기능개발'
subtitle: '프로그래머스 Level 2'
date: 2019-09-26
category: 'Algorithm'
draft: false
---

## 문제

> 프로그래머스 팀에서는 기능 개선 작업을 수행 중이다.
> 각 기능은 진도가 100%일 때 서비스에 반영할 수 있다.
> 또, 각 기능의 개발속도는 모두 다르기 때문에 뒤에 있는 기능이 앞에 있는 기능보다 먼저 개발될 수 있고, 이때 뒤에 있는 기능은 앞에 있는 기능이 배포될 때 함께 배포된다.
> 먼저 배포되어야 하는 순서대로 작업의 진도가 적힌 정수 배열 progresses와 각 작업의 개발 속도가 적힌 정수 배열 speeds가 주어질 때 각 배포마다 몇 개의 기능이 배포되는지를 return 하도록 함수를 작성하라.

* 작업의 개수(`progresses`)는 100개 이하이다.
* 작업 진도는 100 미만의 자연수이다.
* 작업 속도는 100 이하의 자연수이다.
* 배포는 하루에 한 번만 할 수 있으며, 하루의 끝에 이루어진다고 가정한다.
* 예를 들어 진도율이 95%인 작업의 개발 속도가 하루에 4%라면 배포는 2일 뒤에 이루어진다.

## 나의 풀이

```python
def dev_func(progresses, speeds):
    max_day = 0
    result = [1]
    for idx, progress in enumerate(progresses):
        work = 100 - progress
        day = math.ceil(work / speeds[idx])
        if not idx:
            max_day = day
        else:
            if day <= max_day:
                result[-1] += 1
            else:
                result.append(1)
                max_day = day
    return result
```

Level 2부터는 확실히 문제를 이해하는 것부터 난관이다..

차근차근 이해를 해보자면, 예를 들어 `[93, 30, 55], [1, 30, 5]`가 입력으로 들어왔을 경우 첫 번째 작업은 93% 완료 되었으므로 7%가 남았다.
이 작업의 개발 속도는 1%이므로 이 작업을 완료하는 데까지 7일이 걸린다.
이 때 `7`을 `max_day`에 넣어준다.
그 다음 작업을 해당 작업과 함께 배포할 수도 있기 때문이다.
첫 번째 작업물은 어찌됐든 처음으로 작업을 완료하므로 `result` 리스트의 첫 번째 인덱스를 `1`로 초기화했다.

두 번째 작업물은 30% 완료되었으므로 70%가 남았고 일일 개발 속도는 30%이다.
완료하기까지는 총 3일이 걸린다.
하지만 그 전 작업을 완료하기까지 7일이 걸리므로 첫 번째 작업과 두 번째 작업은 동시에 배포된다.
그러므로 `result`의 첫 번째 인덱스에 `1`을 증가시킨다.

세 번째 작업물은 55%가 완료된 상태이므로 45%가 남았고 작업속도가 5%이므로 총 9일이 걸린다.
9일은 7일보다 크므로 이전의 작업들과 함께 배포하지 못한다.
그러므로 `result`에 새로운 인덱스를 추가해주어야 하며, `max_day`는 `9`로 변하게 된다.

## 다른 사람의 풀이

```python
def dev_func(progresses, speeds):
    Q=[]
    for p, s in zip(progresses, speeds):
        if len(Q)==0 or Q[-1][0]<-((p-100)//s):
            Q.append([-((p-100)//s),1])
        else:
            Q[-1][1]+=1
    return [q[1] for q in Q]
```

나는 두 리스트의 동일한 인덱스를 접근하기위해 `enumerate()`를 사용했는데, 이 분은 `zip()`을 사용해서 간편하게 풀어냈다.
`zip()` 함수는 다음과 같이 동일한 개수로 이루어진 자료형을 묶어준다.

```python
>>> list(zip([1, 2, 3], [4, 5, 6]))
[(1, 4), (2, 5), (3, 6)]
>>> list(zip([1, 2, 3], [4, 5, 6], [7, 8, 9]))
[(1, 4, 7), (2, 5, 8), (3, 6, 9)]
>>> list(zip("abc", "def"))
[('a', 'd'), ('b', 'e'), ('c', 'f')]
```

이외의 코드들은 비슷한 방법이지만 훨씬 간결하게 풀어내셨다 ㅠㅠ

이런 코드를 볼 때마다 감탄하면서도 좋은 자극이 된다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42586)
