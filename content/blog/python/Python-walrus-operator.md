---
title: '🐍 Python Walrus Operator'
subtitle: '파이썬의 바다코끼리'
date: 2021-09-02
category: 'Python'
draft: false
---

### Contents
- [개요](#개요)
- [왈러스(walrus) 연산자란?](#왈러스(walrus)-연산자란?)
- [예시](#예시)
- [마무리](#마무리)

## 개요

**파이썬 3.8** 버전부터 왈러스 연산자를 사용할 수 있다.

왈러스 연산자는 `:=`와 같이 사용하는데, 생김새가 마치 바다코끼리의 눈과 엄니를 닮았다하여 이름이 붙여졌다고 한다. (귀여워..)

필자는 [파이썬 코딩의 기술](https://books.google.co.kr/books/about/%ED%8C%8C%EC%9D%B4%EC%8D%AC_%EC%BD%94%EB%94%A9%EC%9D%98_%EA%B8%B0%EC%88%A0_%EA%B0%9C%EC%A0%952%ED%8C%90.html?id=tQYHEAAAQBAJ&printsec=frontcover&source=kp_read_button&hl=ko&redir_esc=y#v=onepage&q&f=false) 책을 읽고 왈러스 연산자에 대해 알게 되었는데, 진즉 알았더라면 많은 코드를 좀 더 클린하게 짤 수 있지 않았을까 생각된다.

## 왈러스(walrus) 연산자란?

왈러스 연산자는 **대입식**이라고도 부르는데 이는 대입문이 쓰일 수 없는 위치에서 변수에 값을 대입할 수 있다.

예를 들면 if문 안에 대입식을 쓸 수 있다.

## 예시

쉬운 예시로 `a`라는 리스트의 길이가 10 이상이면 길이와 함께 리스트가 너무 길다는 문장을 출력하도록 해보자.

```python
if len(a) > 10:
    print(f"List is too long ({len(a)} elements, expected <= 10)")
```

`len(a)`을 두 번 계산해야 하기 때문에 왠지 변수에 담아주고 싶은 마음이 든다.

```python
n = len(a)
if n:
    print(f"List is too long ({n} elements, expected <= 10)")
```

좀 더 깔끔해졌지만 `n`은 if문 안에서만 쓰이는데, 이를 if문 앞에서 선언을 해주니 대단히 중요한 변수처럼 보인다.

이럴 때 사용하는 연산자가 바로 바다 코끼리 왈러스 연산자이다.

왈러스 연산자를 사용하면 if문 안에서 변수를 선언하고 사용할 수 있다.

```python
if (n := len(a)) > 10:
    print(f"List is too long ({n} elements, expected <= 10)")
```

와우! 훨씬 깔끔해졌다.

마찬가지로 정규식을 다룰 때도 왈러스 연산자가 있으면 반복을 피할 수 있다.

```python
discount = 0.0
if (mo := re.search(r'(\d+)% discount', advertisement)):
    discount = float(mo.group(1)) / 100.0
```

loop 종료를 테스트하기 위해 값을 계산한 다음 loop에서 동일한 값을 다시 필요로 하는 while loop에도 유용하게 쓰인다.

```python
while (block := f.read(256)) != '':
    process(block)
```

리스트 컴프리헨션에서 필터링을 하는 경우에도 왈러스 연산자를 활용할 수 있다.

```python
[clean_name.title() for name in names
 if (clean_name := normalize('NFC', name)) in allowed_names]
```

## 마무리

왈러스 연산자를 알고 나니 고칠 수 있는 코드가 많이 보인다.

간단하지만 활용하기 좋은 개념들을 알게 되면 기분이 좋다.

적어도 꾸준히 사용할 언어와 프레임워크들은 업데이트 노트를 주기적으로 확인해야겠단 생각이 든다.

## References

- [Python Documentation](https://docs.python.org/3/whatsnew/3.8.html#assignment-expressions)
