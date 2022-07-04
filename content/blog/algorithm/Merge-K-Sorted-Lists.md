---
title: '🧠 Merge K Sorted Lists'
subtitle: 'LeetCode Hard'
date: 2022-07-04
category: 'Algorithm'
draft: false
---

## 문제

> You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
> Merge all the linked-lists into one sorted linked-list and return it.

## 풀이 1

```python
from typing import List, Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        """
        Brute Force

        Time complexity: O(N log N)
        Space complexity: O(N)
        """
        self.nodes = []
        head = point = ListNode(0)
        for l in lists:
            while l:
                self.nodes.append(l.val)
                l = l.next
        for x in sorted(self.nodes):
            point.next = ListNode(x)
            point = point.next
        return head.next
```

가장 쉽게 떠올릴 수 있는 Brute Force 방식이라 할 수 있다.

리스트를 돌면서 새로운 리스트에 값을 추가하고 `sorted()` 함수를 이용해 리스트를 정렬한 후 새로운 연결 리스트를 만드는 방식이다.

위 방법의 시간 복잡도는 `sorted()` 함수로 정렬을 하기 때문에 O(N log N)이며, 공간 복잡도는 O(N)이다.

여기서 말하는 `N`은 리스트의 길이가 아닌 파라미터로 받은 모든 연결리스트 노드의 합이다.

연결 리스트를 정렬할 수 있는 방법 중 시간 복잡도를 줄일 수 있는 방식이 무엇이 있을까? 답은 힙이다.

## 풀이 2

```python
import heapq
from typing import List, Optional


class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        """
        Optimize Approach 2 by heapq
        """
        h = [(l.val, idx) for idx, l in enumerate(lists) if l]
        heapq.heapify(h)
        head = cur = ListNode()
        while h:
            val, idx = heapq.heappop(h)
            cur.next = ListNode(val)
            cur = cur.next
            node = lists[idx] = lists[idx].next
            if node:
                heapq.heappush(h, (node.val, idx))
        return head.next
```

python의 `heapq` 모듈은 우선순위 알고리즘의 구현을 제공한다.

우선순위 큐 알고리즘을 구현한 모듈로는 `priorityQueue`도 있는데, 이 모듈 또한 `heapq` 모듈을 기반으로 만들어졌지만 둘은 Thread-safe 지원 여부에 따라 다르다.
`priorityQueue`는 멀티 쓰레드 환경에서 데이터를 안전하게 교환해야 하는 경우 유용하며, `heapq`는 이러한 Thread-safe 를 지원하지는 않는다.
락킹을 하지 않기 때문에 `heapq`의 속도가 더 빠른 장점이 있으며, 사실상 멀티 쓰레드 환경에서 개발하는 것이 아닌 경우에는 `heapq`를 대부분 사용한다.

힙(min heap)은 모든 부모 노드가 자식보다 작거나 같은 값을 갖는 이진 트리이기 때문에, 우리는 이 힙을 사용해서 연결 리스트를 오름차순으로 정렬하여 사용할 수 있다.
`heapq` 모듈의 `heapify()` 함수를 통해 힙큐를 만들 수 있으며, `heappop()`을 통해 힙큐에서 가장 작은 요소를 꺼낼 수 있다.

먼저 리스트를 힙큐로 만든 다음 요소가 없어질 때까지 반복하며 힙큐에서 요소를 꺼낸다.
꺼낸 요소는 연결 리스트에 추가하며, 기존 리스트에서 다음 노드를 가져와 힙큐에 넣는다.
힙큐에 남은 요소가 없으면 만들어진 연결 리스트의 두번째 노드(`head.next`)를 리턴해주면 된다.

이렇게 구현을 할 경우, 시간 복잡도는 `O(N log k)`로 모든 리스트를 돌았을 때보다 단축된 시간으로 정답을 구할 수 있다.

모든 경우에 `sorted()`보다 힙을 이용한 정렬이 빠른 것은 아니지만, 이와 같이 내부 순서를 보존하며 삽입을 하는 경우에는 힙큐를 활용하는 것이 더 효율적인 방법이다.  

## References

* [LeetCode](https://leetcode.com/problems/merge-k-sorted-lists/)
* [Python Documentation](https://docs.python.org/ko/3/library/heapq.html)
