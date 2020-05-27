---
title: '🧠 3Sum'
subtitle: 'LeetCode Medium'
date: 2020-05-27
category: 'Algorithm'
draft: false
---

## 문제

> Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? 
> Find all unique triplets in the array which gives the sum of zero.

* The solution set must not contain duplicate triplets.

## 나의 풀이

```python
def threeSum(self, nums: List[int]) -> List[List[int]]:
    nums = sorted(nums)
    res = []
    for i in range(len(nums)):
        needs = 0 - nums[i]
        for j in range(i+1, len(nums)):
            need = needs - nums[j]
            tmp_nums = nums[:]
            tmp_nums.remove(nums[i])
            tmp_nums.remove(nums[j])
            if need in tmp_nums:
                answer = [nums[i], nums[j], need]
                if sorted(answer) not in res:
                    res.append(answer)
    return res
```

주어진 배열 `nums`에서 더하면 0이 되는 3개의 숫자 set을 구하여 리턴하는 문제이다.

나는 우선 `nums`를 정렬시킨 다음 for문을 돌며 `i`가 0이 되기 위해 필요한 두 수를 찾아내면 `answer`에 더하는 식으로 해결했는데 결국 Time Limit에 걸렸다.
어찌보면 당연한게 정렬 후 이중 for문에서 if문으로 `tmp_nums`를 또 탐색하는 코드이기 때문에 느릴 수밖에 없었다.

## 다른 사람의 풀이

```python
def threeSum(self, nums: List[int]) -> List[List[int]]:
    ans = set()
    setP = set()
    setN = set()
    
    if len(nums) < 3: 
        return ans 
    
    if nums.count(0) >= 3: 
        ans.add((0,0,0)) 
    
    nums_set = set(nums)
    numMax, numMin = max(nums_set), min(nums_set)
    
    if numMax <= 0 or numMin >= 0: 
        return ans
    
    setP = set(num for num in nums_set if (num > 0 and num <= -2 * numMin))
    setN = set(num for num in nums_set if (num < 0 and num >= -2 * numMax))

    count = collections.Counter(nums)
    for numP in setP:
        for numN in setN:
            numD = -numP - numN
            if numD in nums_set:
                val = tuple(sorted([numD,numP,numN]))
                if val.count(numD) <= count[numD] \
                    and val.count(numP) <= count[numP] \
                        and val.count(numN) <= count[numN]:
                    ans.add(val)
    return ans
```

이 분은 우선 0이 3개 이상인 경우 결과에 (0,0,0)을 추가했다.

그 다음 주어진 배열을 `set()`으로 묶고 가장 작은 값과 가장 큰 값을 저장했다.
가장 큰 값이 0보다 작거나 가장 작은 값이 0보다 크면 어차피 0을 만들 수 없기 때문에 (0을 만들기 위해서는 무조건 음수, 양수의 조합이 필요하다) 바로 (0,0,0)을 리턴한다.

다음으로 `nums_set`을 돌며 양수를 판별하는데 이 때 추가 조건으로 `num <= -2 * numMin`가 들어간다.
이 부분에서 짝을 절대 찾을 수 없는 숫자들이 제외된다.
예를 들어 `nums = [-1, 0, 1, 5]`일 때, `numMin`은 -1이 되는데, `num`이 5일 때 `num <= 2 * numMin`은 `5 <= -2`로 False가 된다.
5가 제외되는 이유는 5와 가장 작은 값인 -1을 더하면 4, 곧 0이 되기 위해서는 -4가 필요한데 가장 작은 값은 -1이기 때문에 짝을 찾을 수 없는 숫자가 된다.
음수인 경우도 마찬가지이다.

다음 for문은 필자가 생각했던 부분과 비슷하게 진행된다.
두 가지 숫자로 나머지 한 값을 찾아내는 방식이다.
여기서 다른 점은 이 분은 `collections.Counter()`를 이용해 구한 값들의 각 count가 실제 `nums`의 count에 벗어나지 않는지 체크해준다.

속도 차이를 줄일 수 있었던 부분 중에 하나는 불필요한 숫자를 애초에 제거하고 반복하는 부분인 것 같다.


## References

* [LeetCode](https://leetcode.com/problems/3sum/)
