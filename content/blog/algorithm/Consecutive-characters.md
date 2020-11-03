---
title: '🧠 Consecutive Characters'
subtitle: 'LeetCode NovemberLeetCodingChallenge'
date: 2020-11-03
category: 'Algorithm'
draft: false
---

## 문제

> Given a string s, the power of the string is the maximum length of a non-empty substring that contains only one unique character.
> Return the power of the string.

* 1 <= s.length <= 500
* s contains only lowercase English letters.

## 나의 풀이

```python
def maxPower(self, s: str) -> int:
    count = maxCount = 1
    last = s[0]
    for c in s[1:]:
        if c == last:
            count += 1
        maxCount = max(count, maxCount)
        if c != last:
            count = 1
            last = c
    return maxCount
```

## 다른 사람의 풀이

```python
from itertools import groupby


def maxPower(self, s: str) -> int:
     return max(len(list(j)) for _,j in groupby(s))
```

`itertools`의 `groupby` 함수를 처음 알게 되었다.
`groupby`의 동작은 이터레이터의 키 값이 변경될 때마다 break를 하므로, 가장 긴 리스트의 길이를 리턴해주면 간단하게 풀 수 있는 문제였다.

## groupby()

```python
class groupby:

    # [k for k, g in groupby('AAAABBBCCDAABBB')] --> A B C D A B
    # [list(g) for k, g in groupby('AAAABBBCCD')] --> AAAA BBB CC D

    def __init__(self, iterable, key=None):
        if key is None:
            key = lambda x: x
        self.keyfunc = key
        self.it = iter(iterable)
        self.tgtkey = self.currkey = self.currvalue = object()

    def __iter__(self):
        return self

    def __next__(self):
        self.id = object()
        while self.currkey == self.tgtkey:
            self.currvalue = next(self.it)
            self.currkey = self.keyfunc(self.currvalue)
        self.tgtkey = self.currkey
        return (self.currkey, self._grouper(self.tgtkey, self.id))

    def _grouper(self, tgtkey, id):
        while self.id is id and self.currkey == tgtkey:
            yield self.currvalue
            try:
                self.currvalue = next(self.it)
            except StopIteration:
                return
            self.currkey = self.keyfunc(self.currvalue)
```

간단하지만 굉장히 유용해서 익혀두면 자주 이용할 수 있을 것 같다. 


## References

* [LeetCode](https://leetcode.com/problems/consecutive-characters/solution/)
* [Python Flowdas](https://python.flowdas.com/library/itertools.html)
