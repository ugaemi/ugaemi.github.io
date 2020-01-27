---
title: '🔍 TDD csrf token 문제 해결'
subtitle: '테스트하기 어려운 코드 제외하기'
date: 2019-10-14
category: 'TDD'
draft: false
---

## 이슈

요즘 [파이썬을 이용한 클린코드를 위한 테스트 주도 개발](https://book.naver.com/bookdb/book_detail.nhn?bid=8819504) 책을 따라해가며 TDD로 Django를 다루는 법을 배워가고 있다.

어제는 입력 폼을 만드는 부분을 만들고 테스트해보았는데 자꾸 실패를 했다.
이유는 `form`안의 csrf token 때문이었다.

### CSRF(Cross-Site Request Forgery)란

> CSRF는 웹사이트 취약점 공격의 하나로, 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위(수정, 삭제, 등록 등)를 특정 웹사이트에 요청하게 하는 공격을 말한다. 사이트 간 스크립팅(XSS)을 이용한 공격이 사용자가 특정 웹사이트를 신용하는 점을 노린 것이라면, CSRF는 특정 웹사이트가 사용자의 웹 브라우저를 신용하는 상태를 노린 것이다. 일단 사용자가 웹사이트에 로그인한 상태에서 사이트간 요청 위조 공격 코드가 삽입된 페이지를 열면, 공격 대상이 되는 웹사이트는 위조된 공격 명령이 믿을 수 있는 사용자로부터 발송된 것으로 판단하게 되어 공격에 노출된다.

이와 같은 CSRF 공격을 막기 위한 수단으로 token을 사용하여 사용자를 인증을 하는 방식이 있다.
Django에서는 `form` 태그 안에 추가하여 간편하게 사용할 수 있다.

하지만 이 token을 추가하면서 테스트하기가 번거로워졌다.
응답을 받은 html에는 `hidden` type의 `input`으로 token이 생성되어있지만, template html에는 생성되지 않았기 때문이다.

```shell
FAIL: test_home_page_returns_correct_html (lists.tests.HomePageTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/yugyeong/Study/tdd-4-clean-code/superlists/lists/tests.py", line 19, in test_home_page_returns_correct_html
    self.assertEqual(response.content.decode(), expected_html)
AssertionError: '<htm[229 chars]     <input type="hidden" name="csrfmiddleware[206 chars]l>\n' != '<htm[229 chars]     \n        </form>\n        <table id="id_[85 chars]l>\n'
```

## 고민

이 문제를 만나기 전까지의 테스트는 매우 순조로웠다.
비교하는 대상의 값을 모두 알고 있었기 때문이다.

언젠가 *랜덤한 값은 어떻게 테스트하지?* 라는 의문이 든 적이 있었다.
이 코드는 종호오빠가 [참고하라고 보내주신 링크](https://www.slideshare.net/OKJSP/okkycon-120497749?from_m_app=ios) 속 **테스트하기 어려운 코드**에 포함된다고 생각했다.

내가 생각한 해결 방법은 총 3가지였다.

1. 테스트용 html 파일을 따로 만들자.
2. 테스트하기 쉬운 코드와 어려운 코드를 분리하자.
3. 테스트에서 제외시키자.

1번은 참 무식한 방법이다.
테스트용 html 파일을 또 하나 만들게되면, 이번은 쉽게 넘어갈지라도 앞으로 비용이 어마어마하게 들 것이다.

2번은 테스트하기 쉬운 코드와 어려운 코드를 분리하는 방법(종호오빠 추천 방법!)이다.
[클린 아키텍처](https://engineering.21buttons.com/clean-architecture-in-django-d326a4ab86a9)와 함께 생각해보면 csrf token을 사용하는 부분은 원의 가장 바깥쪽이 되고 html은 좀 더 안쪽 원에 위치한다.
테스트하기 어려운 코드를 따로 빼서 테스트하는 방법이다.
(분리도 하고 테스트도 하는) 가장 이상적인 방법이지만, 현재 테스트하고 있는 부분(html)은 분리한다고 해서 결과를 바꿀 수 있는 것이 아니라는 판단이 섰다.

3번은 테스트에서 제외시키는 방법이다.
가장 쉽고 빠르게 할 수 있는 방법이기도 하다.

나는 고민 끝에 3번을 택했다.
csrf token은 항상 변경되는 값이기 때문에 테스트에서 제외한다고 해서 실제 코드에 영향이 있는 것은 아니므로 괜찮을 것이라 판단했다.

더 나은 방법으로 해결하신 분이 계시다면 댓글로 남겨주시면 감사하겠습니당 :)

## 해결

[스택 오버플로우](https://stackoverflow.com/questions/34629261/django-render-to-string-ignores-csrf-token)에서 나와 같은 이슈를 겪고 있는 질문을 발견했다.
그에 대한 답 중에 정규식으로 csrf token 부분을 찾아내어 삭제한 후 비교하는 코드를 보았고 나는 이를 적용하기로 했다.

다음은 `test.py`의 `HomePageTest` 클래스의 전체 코드이다.

```python
import re

class HomePageTest(TestCase):

    @staticmethod
    def remove_csrf(html_code):
        csrf_regex = r'<input[^>]+csrfmiddlewaretoken[^>]+>'
        return re.sub(csrf_regex, '', html_code)

    def assertEqualExceptCSRF(self, html_code1, html_code2):
        return self.assertEqual(
            self.remove_csrf(html_code1),
            self.remove_csrf(html_code2)
        )

    def test_root_url_resolves_to_home_page_view(self):
        found = resolve('/')
        self.assertEqual(found.func, home_page)

    def test_home_page_returns_correct_html(self):
        request = HttpRequest()
        response = home_page(request)
        self.assertEqualExceptCSRF(
            render_to_string('home.html', request=request),
            response.content.decode()
        )

    def test_home_page_can_save_a_POST_request(self):
        request = HttpRequest()
        request.method = 'POST'
        request.POST['item_text'] = '신규 작업 아이템'

        response = home_page(request)

        self.assertIn('신규 작업 아이템', response.content.decode())
        self.assertEqualExceptCSRF(
            render_to_string('home.html', {'new_item_text' : '신규 작업 아이템'}),
            response.content.decode()
        )
```

위 코드를 실행하면 문제 없이 테스트가 통과될 것이다.

아직 TDD 초짜라 책을 따라가는 것도 조금은 벅차다..
한 장 넘길때마다 삽질 중이긴 한데, 그래도 재밌당 :D

## References

* [파이썬을 이용한 클린코드를 위한 테스트 주도 개발](https://book.naver.com/bookdb/book_detail.nhn?bid=8819504)
* [위키백과](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%9A%94%EC%B2%AD_%EC%9C%84%EC%A1%B0)
* [스택 오버플로우](https://stackoverflow.com/questions/34629261/django-render-to-string-ignores-csrf-token)
