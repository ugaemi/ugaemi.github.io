---
title: '🧠 체육복'
subtitle: '프로그래머스 Level 1'
date: 2019-08-07
category: 'Algorithm'
draft: false
---

## 문제

> 점심시간에 도둑이 들어, 일부 학생이 체육복을 도난당했다.
다행히 여벌 체육복이 있는 학생이 이들에게 체육복을 빌려주려 한다.
학생들의 번호는 체격 순으로 매겨져 있어, 바로 앞번호의 학생이나 바로 뒷번호의 학생에게만 체육복을 빌려줄 수 있다.
예를 들어, 4번 학생은 3번 학생이나 5번 학생에게만 체육복을 빌려줄 수 있다.
체육복이 없으면 수업을 들을 수 없기 때문에 체육복을 적절히 빌려 최대한 많은 학생이 체육수업을 들어야 한다.
전체 학생의 수 n, 체육복을 도난당한 학생들의 번호가 담긴 배열 lost, 여벌의 체육복을 가져온 학생들의 번호가 담긴 배열 reserve가 매개변수로 주어질 때, 체육수업을 들을 수 있는 학생의 최댓값을 return 하도록 함수를 작성하라.

* 전체 학생의 수는 2명 이상 30명 이하이다.
* 체육복을 도난당한 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없다.
* 여벌의 체육복을 가져온 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없다.
* 여벌 체육복이 있는 학생만 다른 학생에게 체육복을 빌려줄 수 있다.
* 여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있다.
* 이때 이 학생은 체육복을 하나만 도난당했다고 가정하며, 남은 체육복이 하나이기에 다른 학생에게는 체육복을 빌려줄 수 없다.

## 나의 풀이

```python
def gymsuit(n, lost, reserve):
    for r in reserve[:]:
        if r in lost:
            reserve.remove(r)
            lost.remove(r)
    for r in reserve:
        if not lost:
            break
        else:
            for l in lost:
                if abs(l-r) == 1:
                    lost.remove(l)
                    break
    return n - len(lost)
```

이번 문제에는 꼭 짚고 넘어가야 할 함정이 있다.
바로 **여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있다** 는 점이다.
이 부분 때문에 우선적으로 여벌 체육복을 가져온 학생(`r`)이 체육복을 도난당한 학생 리스트(`lost`)에 있는지 확인하고 있을 경우에는 두 개의 리스트에서 해당 학생을 제외해야 했다.
풀이 과정에서 특별하게 어려운 점은 없었으나 이 문장 때문에 좀 더 다양한 테스트 케이스가 필요했다.
프로그래머스에는 테스트 케이스를 통과하지 못했을 때에도 해당 테스트 케이스를 확인할 수 없도록 되어있어서 어떤 부분에서 에러가 났는지 해결하기가 힘들었다 ㅠㅠ
그래서 직접 여러 가지 케이스를 만들어보았다.

### 테스트 케이스

```python
class Test(unittest.TestCase):
    def test(self):
        self.assertEqual(gymsuit(5, [2, 4], [1, 3, 5]), 5)
        self.assertEqual(gymsuit(5, [2, 4], [3]), 4)
        self.assertEqual(gymsuit(3, [3], [1]), 2)
        self.assertEqual(gymsuit(8, [3, 4, 7], [1, 3, 5, 6]), 8)
        self.assertEqual(gymsuit(3, [1, 2], [2, 3]), 2)
        self.assertEqual(gymsuit(9, [2, 4, 7, 8], [3, 6, 9]), 8)
        self.assertEqual(gymsuit(5, [2, 4], [3, 5]), 5)
```

## 다른 사람의 풀이

```python
def gymsuit(n, lost, reserve):
    _reserve = [r for r in reserve if r not in lost]
    _lost = [l for l in lost if l not in reserve]
    for r in _reserve:
        f = r - 1
        b = r + 1
        if f in _lost:
            _lost.remove(f)
        elif b in _lost:
            _lost.remove(b)
    return n - len(_lost)
```

비슷한 방법으로 풀었으나 크게 다른 점은 for문과 if문을 한 줄에 끝내버렸다는 점이다.
이처럼 좀 더 파이썬스럽게 짤 수 있는 방향으로 연습해야겠다.

## References

* [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/42862)
