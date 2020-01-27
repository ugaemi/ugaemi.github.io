---
title: '🔫 Django 프로젝트 폴더명 중복 문제 해결'
subtitle: 'No module named <project-name>...'
date: 2019-09-24
category: 'Django'
draft: false
---

## 이슈

[Django에서 단위 테스트 실행하기](https://ugaemi.github.io/2019-08-29-tdd-01/) 포스팅에서 import 관련 이슈를 해결했다.
[클린 코드를 위한 테스트 주도 개발](https://book.naver.com/bookdb/book_detail.nhn?bid=8819504) 책을 보고 따라하시던 분들도 이번 포스팅으로 에러를 해결하실 수 있을거다.

Django를 시작할 때 `django-admin startproject project-name`을 하면 다음과 같은 구조로 디렉터리와 파일들이 생성된다.

```shell
project-name
    ㄴ project-name
        ㄴ __init__.py
        ㄴ settings.py
        ㄴ urls.py
        ㄴ wsgi.py
```

루트 디렉터리와 동일한 이름의 폴더가 하나 더 생기게 된다.

처음엔 별 문제가 없지만 app을 생성하고 import를 하게 될 때 다음처럼 중복된 폴더명 때문에 길을 헤매는 경우가 생긴다.

```shell
ModuleNotFoundError: No module named 'project-name.app'
```

이를 해결하기 위해서는 폴더명을 변경해주어야 한다.

## 해결 방법

하위 폴더명을 `config`(또는 원하는 이름)로 변경한다. 당연히 의존되는 모든 코드를 변경해주어야 한다.

우선 `config.settings` 수정!

```python
WSGI_APPLICATION = 'config.wsgi.application'
```

다음으로 `manage.py` 수정!

```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
```

아마 정상적으로 실행이 될 것이다.

추가적으로 필자의 경우 `config` 하위의 `urls.py`는 `root_urls.py`와 같이 변경하고 app의 url들을 이 파일에 모두 include하여 관리한다.

위와 마찬가지로 루트 url 파일명을 변경했을 시 `settings.py`를 수정해주어야 한다 :)

```python
ROOT_URLCONF = 'config.root_urls'
```
