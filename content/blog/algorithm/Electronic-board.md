---
title: '🧠 전광판'
subtitle: '프로그래머스 실리콘밸리 잡페어 온라인 코딩테스트 문제 1'
date: 2019-09-09
category: 'Algorithm'
draft: false
---

## 문제

> 14 글자를 출력할 수 있는 전광판에 happy-birthday라는 문구를 지나가게 하려 한다.
> 이때, 문구는 다음 규칙에 따라 화면을 지나간다.
> 전광판은 화면에 14자 글자를 출력한다.
> 문구는 1초에 왼쪽으로 한 칸씩 움직인다.
> 문구 이외의 부분은 _로 표시된다.
> 처음에는 문구를 보여주지 않는다.
> 3초 뒤에는 화면에 "***hap"가 보인다.
> 14초 뒤에는 화면에 "happy-birthday"가 보인다.
> 20초 뒤에는 화면에 "birthday*"가 보인다.
> 28초 뒤에는 모든 문자열이 지나간 후 "**________"가 보인다.
> 29초 뒤에는 다시 첫 번째 문자부터 나타나며, "_____________h"가 보인다.
> 문구를 담은 문자열 phrases와 초를 담은 second가 매개변수로 주어질 때, s초가 지난 후 화면에 보이는 문자열을 출력하도록 함수를 작성하라.

* 문구를 담은 문자열 `phrases`와 초를 담은 `second`가 주어진다.
* `phrases`는 `happy-birthday`이다.
* `second`는 1 이상 10,000 이하인 자연수이다.

## 나의 풀이

```python
def electronic_board(phrases, second):
    s = second % 28
    if s <= 14:
        return '_' * (14 - s) + phrases[0:s]
    return phrases[s-14:] + '_' * (s - 14)
```

주어진 문구가 모두 지나가고 다시 초기화면이 될 때까지를 한 세트라고 했을 때, 한 세트가 끝나려면 28초가 걸린다.
`phrases`의 문구가 맨앞부터 차례로 보이는 시간은 14초까지이다.
14초 이후부터는 앞글자가 하나씩 사라지게 되므로 필자는 14초를 기준으로 경우를 나누어보았다.
우선 주어지는 초가 28초보다 길 수 있으므로 `second`를 28로 나눈다.
나눈 값이 14보다 작으면 앞부분을 `_`로 채워준다.
남은 부분에는 주어진 문자열 `phrases`를 앞글자부터 차례로 `s`만큼 넣어준다.
14보다 큰 경우에는 문자열을 먼저 넣어주고 남은 부분을 `_`로 채운다.

온라인 코딩 테스트같은 경우에는 기간이 끝나면 문제와 답을 확인할 수가 없다...
그래도 다행히 문제는 모두 복사해왔다.
하지만 내 코드가 100% 정답이라는 보장을 못한다 ^^;

## References

* [프로그래머스](https://programmers.co.kr/competitions/104/siliconvalley-jobfair2019)
