---
title: '🔍 Django에서 단위 테스트 실행하기'
subtitle: '단위 테스트를 이용한 간단한 홈페이지 테스트'
date: 2019-08-29
category: 'TDD'
draft: false
---

## 단위 테스트와 기능 테스트의 차이

### 기능 테스트

> 사용자 관점에서 애플리케이션 외부를 테스트하는 것
> 상위 레벨의 개발 주도

### 단위 테스트

> 프로그래머 관점에서 애플리케이션 내부를 테스트하는 것
> 하위 레벨의 개발 주도

### TDD 작업 순서

1. 기능 테스트를 작성해서 사용자 관점의 새로운 기능성을 정의하는 것부터 시작한다.
2. 기능 테스트가 실패하고 나면 어떻게 코드를 작성해야 테스트를 통과할지를 생각해보도록 한다.
이 시점에서 하나 또는 그 이상의 단위 테스트를 이용해서 어떻게 코드가 동작해야 하는지 정의한다.
3. 단위 테스트가 실패하고 나면 단위 테스트를 통과할 수 있을 정도의 최소한의 코드만 작성한다.
기능 테스트가 완전해질 때까지 과정 2와 3을 반복해야 할 수도 있다.
4. 기능 테스트를 재실행해서 통과하는지 또는 제대로 동작하는지 확인한다.
이 과정에서 새로운 단위 테스트를 작성해야 할 수도 있다.

## Django에서의 단위 테스트

`startapp`을 통해 앱을 생성하게 되면 하위에 `tests.py` 라는 파일이 생긴다.
해당 파일의 내용은 다음과 같다.

```python
from django.test import TestCase

# Create your tests here.
```

Django의 `TestCase`는 `unittest.TestCase`의 확장 버전으로 Django에 대한 특화 기능들이 추가되어 있다고 한다.
간단한 테스트를 만들어 실행해보자.

```python
from django.test import TestCase


class SmokeTest(TestCase):
    def test_bad_maths(self):
        self.assertEqual(1 + 1, 3)
```

실패할 수 밖에 없는 테스트이지만 우선 실행해보자.

```shell
python manage.py test

Creating test database for alias 'default'...
System check identified no issues (0 silenced).
F
======================================================================
FAIL: test_bad_maths (superlists.lists.tests.SmokeTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/yugyeong/Study/TDD4CleanCode/superlists/lists/tests.py", line 6, in test_bad_maths
    self.assertEqual(1+1, 3)
AssertionError: 2 != 3

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=1)
Destroying test database for alias 'default'...

```

제대로 동작한다.

```shell
System check identified no issues (0 silenced).
EE
======================================================================
ERROR: superlists.lists (unittest.loader._FailedTest)
----------------------------------------------------------------------
ImportError: Failed to import test module: superlists.lists
Traceback (most recent call last):
  File "/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6/unittest/loader.py", line 462, in _find_test_path
    package = self._get_module_from_name(name)
  File "/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6/unittest/loader.py", line 369, in _get_module_from_name
    __import__(name)
ModuleNotFoundError: No module named 'superlists.lists'

```

혹시 참고중인 도서의 내용을 그대로 따라하다가 현 시점에서 위와 같은 에러가 나신 분이 있다면 프로젝트 루트 디렉토리 아래의 `superlists` 폴더의 이름을 임시로 변경해야 한다.
루트 디렉토리 이름과 동일해서 `ImportError`가 나는 것이다.
하지만 또 이부분을 수정하니 서버를 켤 때 문제가 있다... 이 부분은 더 고민해봐야할 것 같다.

## 목표

Django의 기본적인 처리 흐름은 다음과 같다.

1. 특정 URL에 대한 HTTP 요청을 받는다.
2. Django는 특정 규칙을 이용해서 해당 요청에 어떤 뷰 함수를 실행할지 결정한다.
3. 이 뷰 기능이 요청을 처리해서 HTTP 응답으로 반환한다.

따라서 테스트해야 할 것은 두 가지이다.

* URL의 사이트 루트(`/`)를 해석해서 특정 뷰 기능에 매칭시킬 수 있는가?
* 이 뷰 기능이 특정 HTML을 반환하게 해서 기능 테스트를 통과할 수 있는가?

## 첫 번째 테스트

위의 테스트 코드를 다음과 같이 수정하자.

```python
from django.test import TestCase
from django.urls import resolve
from .views import home_page


class HomePageTest(TestCase):
    def test_root_url_resolves_to_home_page_view(self):
        found = resolve('/')
        self.assertEqual(found.func, home_page)
```

`resolve`는 Django의 내부 함수로 URL을 해석해서 일치하는 뷰 함수를 찾는다.
여기서는 `/`가 호출될 때 `resolve`를 실행해서 `home_page`라는 함수를 호출한다.

`home_page`는 곧 작성할 뷰 함수로 HTML을 반환한다.

테스트를 실행해보자.

```shell
System check identified no issues (0 silenced).
E
======================================================================
ERROR: superlists.lists.tests (unittest.loader._FailedTest)
----------------------------------------------------------------------
ImportError: Failed to import test module: superlists.lists.tests
Traceback (most recent call last):
  File "/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6/unittest/loader.py", line 428, in _find_test_path
    module = self._get_module_from_name(name)
  File "/Library/Frameworks/Python.framework/Versions/3.6/lib/python3.6/unittest/loader.py", line 369, in _get_module_from_name
    __import__(name)
  File "/Users/yugyeong/Study/TDD4CleanCode/superlists/lists/tests.py", line 3, in <module>
    from .views import home_page
ImportError: cannot import name 'home_page'
```

첫 번째 에러로 `home_page`를 import 할 수 없다고 뜬다.
그렇다면 `home_page` 함수를 작성해주어야 한다.
우선 `views.py`에 `home_page`를 선언해주자.

```python
from django.shortcuts import render

home_page = None
```

그리고 다시 테스트를 실행해보자.

```shell
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
E
======================================================================
ERROR: test_root_url_resolves_to_home_page_view (superlists.lists.tests.HomePageTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/yugyeong/Study/TDD4CleanCode/superlists/lists/tests.py", line 8, in test_root_url_resolves_to_home_page_view
    found = resolve('/')
  File "/Users/yugyeong/Study/TDD4CleanCode/venv/lib/python3.6/site-packages/django/urls/base.py", line 24, in resolve
    return get_resolver(urlconf).resolve(path)
  File "/Users/yugyeong/Study/TDD4CleanCode/venv/lib/python3.6/site-packages/django/urls/resolvers.py", line 566, in resolve
    raise Resolver404({'tried': tried, 'path': new_path})
django.urls.exceptions.Resolver404: {'tried': [[<URLResolver <URLPattern list> (admin:admin) 'admin/'>]], 'path': ''}

----------------------------------------------------------------------
Ran 1 test in 0.005s

FAILED (errors=1)
Destroying test database for alias 'default'...
```

에러 내용이 바뀌었다.
이번에는 URL 관련 에러다.
우리가 찾으려는 `/`에 해당하는 URL 매핑을 찾을 수 없어서 404 에러가 발생한 걸로 보인다.
`urls.py` 파일을 열어서 URL 패턴을 추가해주자.

```python
from django.urls import path, include

from superlists.lists.views import *

urlpatterns = [
    path('', home_page, name='home'),
]
```

다시 테스트해보자.

```shell
(생략)
TypeError: view must be a callable or a list/tuple in the case of include().
```

`view`를 호출할 수 없다는 메시지가 뜨고 있다.
`home_page`가 아직 함수가 아니기 때문이다.
이제 실제 함수로 변경해보도록 하자.
다시 `views.py`로 돌아가 `home_page`를 함수의 형태로 바꾼다.

```python
def home_page():
    pass
```

다시 테스트해보자.

```shell
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.
----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
Destroying test database for alias 'default'...
```

드디어 첫 단위 테스트가 성공했다.

## 두 번째 테스트

뷰를 위한 테스트를 작성할 때는 빈 함수를 작성하는 것이 아니라 HTML 형식의 실제 응답을 반환하는 함수를 작성해야 한다.
`test.py`를 열어 다음과 같이 새로운 테스트를 추가하자.

```python
from django.http import HttpRequest
from django.test import TestCase
from django.urls import resolve
from .views import home_page


class HomePageTest(TestCase):
    def test_root_url_resolves_to_home_page_view(self):
        found = resolve('/')
        self.assertEqual(found.func, home_page)

    def test_home_page_returns_to_home_page_view(self):
        request = HttpRequest()
        response = home_page(request)
        self.assertTrue(response.content.startswith(b'<html>'))
        self.assertIn(b'<title>To-Do lists</title>', response.content)
        self.assertTrue(response.content.endswith(b'</html>'))
```

`HttpResponse` 객체를 생성해서 사용자가 어떤 요청을 브라우저에 보내는지 확인한다.

이것을 `home_page` 뷰에 전달해서 응답을 취득한다. 이 객체는 `HttpResponse`라는 클래스의 인스턴스다.
응답 내용이 특정 속성을 가지고 있는지 확인한다.

그 다음은 응답 내용이 `<html>`로 시작하고 `</html>`로 끝나는지 확인한다.
`response.content`는 byte형 데이터로 파이썬 문자열이 아니다.
따라서 `b'` 구문을 사용해서 비교한다.

마지막으로 반환 내용의 `<title>` 태그에 **To-Do lists**라는 단어가 있는지 확인한다.

테스트를 실행해보자.

```shell
(생략)
TypeError: home_page() takes 0 positional arguments but 1 was given
```

여기서부터 TDD 단위 테스트 - 코드 주기에 대해 생각해야 한다.

## 단위 테스트 - 코드 주기

1. 터미널에서 단위 테스트를 실행해서 어떻게 실패하는지 확인한다.
2. 편집기상에서 현재 실패 테스트를 수정하기 위한 최소한의 코드를 변경한다.

그리고 이것을 반복한다.

얼마나 빨리 이 주기를 따라갈 수 있는지 확인해보자.

* 최소한의 코드 변경

```python
def home_page(request):
    pass
```

* 테스트

```shell
AttributeError: 'NoneType' object has no attribute 'content'
```

* 코드 : 가정한 대로 `django.http.httpResponse`를 사용한다.

```python
from django.http import HttpResponse


def home_page(request):
    return HttpResponse
```

* 다시 테스트

```shell
AttributeError: 'property' object has no attribute 'startswith'
```

* 다시 코드

```python
def home_page(request):
    return HttpResponse('<html><title>To-Do lists</title>')
```

* 테스트

```shell
AssertionError: False is not true
```

* 코드

```python
def home_page(request):
    return HttpResponse('<html><title>To-Do lists</title></html>')
```

* 테스트 성공!

```shell
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
..
----------------------------------------------------------------------
Ran 2 tests in 0.007s

OK
Destroying test database for alias 'default'...
```

## References

* [파이썬을 이용한 클린코드를 위한 테스트 주도 개발](https://book.naver.com/bookdb/book_detail.nhn?bid=8819504)
