---
title: '🔍 Django 서버 실행 테스트하기 (with selenium)'
subtitle: 'Python Test-Driven Development'
date: 2019-08-24
category: 'TDD'
draft: false
---

## 목표

1. 크롬 브라우저 창을 실행하기 위해 `selenium`의 `webdriver`를 가동한다.
2. 브라우저를 통해 로컬 PC 상의 웹 페이지를 연다.
3. 웹 페이지 타이틀에 **Django** 라는 단어가 있는지 확인한다.

## 첫 번째 테스트

```python
from selenium import webdriver


browser = webdriver.Chrome()
browser.get('http://localhost:8000')

assert 'Django' in browser.title
```

위 소스코드를 실행하면 *selenium을 import 할 수 없다*고 할 것이다.
pip로 `selenium`을 설치해보자.

```shell
pip install -U selenium
```

`selenium`을 이용해 브라우저를 실행시킬 웹 드라이버를 설치해주어야 한다.
적절한 파일을 다운로드하여 원하는 곳에 저장시키자.
필자는 Chrome을 이용할 것이므로 [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home)를 받았다.

드라이버 설치를 완료했다면 다시 실행해보자.

```shell
selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH.
```

위와 같은 오류가 뜬다면 웹 드라이버의 경로를 지정해주지 않아서이다.
웹 드라이버를 저장한 상대 경로나 절대 경로를 다음과 같이 넣어주자.

```python
browser = webdriver.Chrome('/path/to/chromedriver')
```

그리고 다시 실행해보자.

![개발서버와 연결이 안 된 페이지](../../img/post/2019/2019-08-24-01.png)

```shell
Traceback (most recent call last):
  File "functional_test.py", line 11, in
    assert 'Django' in browser.title
AssertionError
```

크롬 창이 뜨긴 하는데 사이트 연결이 안되고 위 에러가 나타난다면 Django 서버가 켜있지 않아서이다.
터미널을 하나 더 켜서 Django 서버를 실행시키자.

```shell
python manage.py runserver
```

그리고 다시 실행해보자.

![selenium으로 접속한 화면](../../img/post/2019/2019-08-24-02.png)

정상적으로 Django 웹 페이지가 보인다.
Title에 **Django: the Web framework ...** 라고 쓰여있다.
그렇다면 위에서 작성한 assert문(Title에 **Django**가 있는지 확인하는 문장)이 `True`여야 한다.
터미널 창을 확인해보면 아무런 에러 메시지가 뜨지 않은 것을 확인할 수 있다.

## 두 번째 테스트

이번에는 `unittest` 모듈을 이용한 테스트 코드를 작성해보자.

```python
from selenium import webdriver
import unittest


class DjangoTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome('/path/to/chromedriver')

    def tearDown(self):
        self.browser.quit()

    def test_can_start_django(self):
        self.browser.get('http://localhost:8000')

        self.assertIn('Django', self.browser.title)


if __name__ == '__main__':
    unittest.main()
```

우선 `unittest.TestCase`를 상속하는 클래스 `DjangoTest`를 만든다.
테스트의 메인 코드는 `test_can_start_django()` 라는 메소드이다.
`setUp()`과 `tearDown()`은 각 테스트 시작 전과 후에 실행되는 메소드로 `setUp`은 브라우저를 열 때, `tearDown`은 닫을 때 사용했다.
`assertIn(a, b)` 메소드는 **a in b**를 확인하는 메소드이다.
위 코드로 **Django**라는 텍스트가 브라우저의 타이틀에 있는지 확인할 수 있다.
에러 메시지가 어떻게 보이는지 알아보기 위해 Django 서버를 끄고 위 코드를 실행해보자.

```shell
Traceback (most recent call last):
  File "functional_tests.py", line 19, in test_can_start_django
    self.assertIn('Django', self.browser.title)
AssertionError: 'Django' not found in 'localhost'
----------------------------------------------------------------------
Ran 1 test in 2.233s

FAILED (failures=1)
```

첫번째 코드와 비교해보면 두번째 코드가 에러가 어떤 함수에서 났는지 또 몇 개의 테스트에서 몇 개가 틀렸는지 정확하게 짚어주는 것을 확인할 수 있다.
예상대로 *'Django' not found in 'localhost'* 라는 에러 메시지가 보인다. 이번엔 Django 서버를 켜고 돌려보자.

```shell
.
----------------------------------------------------------------------
Ran 1 test in 2.130s

OK
```

성공했다.
하지만 여기서 한가지 더 작업해주어야 할 것이 있다.

## 암묵적 대기 기능 추가

`selenium`은 비교적 안정적으로 페이지 로딩이 끝날 때까지 기다렸다가 테스트를 실행하지만 완벽하진 않다.
`implicitly_wait`는 필요에 따라 지정한 시간만큼 동작을 대기 상태로 둘 수 있다.

다음은 3초간 대기 후 처리하도록 하는 코드이다.

```python
def setUp(self):
    self.browser = webdriver.Chrome('/path/to/chromedriver')
    self.browser.implicitly_wait(3)
```

## References

* [파이썬을 이용한 클린코드를 위한 테스트 주도 개발](https://book.naver.com/bookdb/book_detail.nhn?bid=8819504)
