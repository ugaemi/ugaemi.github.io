---
title: '🔫 Django reverse()와 resolve()'
subtitle: 'django.urls utility functions'
date: 2019-10-11
category: 'Django'
draft: false
---

## reverse()

python 코드 안에서 URL 템플릿 태그와 비슷하게 동작하는 기능이다.

```python
from news import views

path('archive/', views.archive, name='news-archive')
```

`urls.py`에서 설정한 URL의 `name`이나, viewname을 통해서 다시 URL로 되돌릴 수 있다.

```python
# name 사용 시
reverse('news-archive')

# viewname 사용 시
from news import views
reverse(views.archive)
```

인수가 있는 URL이라면 다음과 같이 `args`를 포함할 수 있다.

```python
from django.urls import reverse

def myview(request):
    return HttpResponseRedirect(reverse('arch-summary', args=[1945]))
```

`kwargs`로 전달하는 것 또한 가능하다.
하지만 `args`와 `kwargs`를 동시에 전달할 수는 없다.

```python
>>> reverse('admin:app_list', kwargs={'app_label': 'auth'})
'/admin/auth/'
```

일치하는 URL이 없으면 [`NoReverseMatch`](https://docs.djangoproject.com/en/2.2/ref/exceptions/#noreversematch)가 발생한다.

## resolve()

`reverse()`와는 반대되는 기능을 한다.
`ResolverMatch` 객체의 `url_name`을 통해 해당 URL path와 일치하는 이름을 받을 수 있다.

```python
match = resolve('/some/path/')
print(match.url_name)
```

`ResolverMatch` 클래스에는 `url_name` 이외에도 많은 메소드가 있다. (하위 링크 참고)

이러한 메소드를 이용해 `resolve()` 함수를 이용해서 view에서 오류가 발생하는지 테스트해볼 수 있다.

```python
from urllib.parse import urlparse
from django.urls import resolve
from django.http import Http404, HttpResponseRedirect

def myview(request):
    next = request.META.get('HTTP_REFERER', None) or '/'
    response = HttpResponseRedirect(next)

    view, args, kwargs = resolve(urlparse(next)[2])
    kwargs['request'] = request
    try:
        view(*args, **kwargs)
    except Http404:
        return HttpResponseRedirect('/')
    return response
```

위 코드는 URL 패턴과 일치하는 view를 실행해서 오류가 나면 `Http404` 에러를 발생시키는 코드이다.

## References

* [Django 공식 도큐먼트](https://docs.djangoproject.com/ko/2.2/ref/urlresolvers/)
