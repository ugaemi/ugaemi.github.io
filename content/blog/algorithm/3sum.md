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
    if len(nums) < 3:
        return res
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
    res = []
    nums.sort()
    length = len(nums)
    
    for i in range(length-2):
        if nums[i] > 0:
            break
        if i > 0 and nums[i] == nums[i-1]:
            continue
        l, r = i + 1, length - 1
        while l < r:
            total = nums[i] + nums[l] + nums[r]
            if total < 0:
                l += 1
            elif total > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]:
                    l += 1
                while l < r and nums[r] == nums[r-1]:
                    r -= 1
                l += 1
                r -= 1
    return res
```

이 분은 우선 정렬한 배열의 첫번째 값이 양수인 경우 바로 리턴했다. 음수가 없으면 아무리 조합해도 0을 만들 수 없기 때문이다.
다음으로 현재 값과 바로 전 값이 동일하면 지나친다.

현재 인덱스에 1을 더한 값을 `l`, 총 길이에서 1을 뺀 값(=배열의 총 인덱스)을 `r`에 저장한다.
`l`이 `r`보다 작은 동안 while문을 반복한다.

배열의 현재 값과 다음 값, 마지막 값을 더하여 `total`에 저장하고 그 값이 음수인 경우 `l`을 증가시키고 양수인 경우 `r`을 감소시킨다.
세 개의 합이 0인 경우 결과값에 추가하고 `l`값과 `r`값을 조정한다.

나머지 두 숫자를 무작정 같은 배열의 for문으로 돌지 않고 초기화한 후 인덱스를 조절하며 찾아가니 훨씬 빠르다.


## References

* [LeetCode](https://leetcode.com/problems/3sum/)
