---
title: '🔫 django-crontab 사용하기'
subtitle: 'cron에게 주기적인 업무 부여하기'
date: 2019-10-19
category: 'Django'
draft: false
---

## 개요

매일 정각에 새로운 필드를 만들어내야 하는 기능이 필요하게 됐다.

주기적으로 함수를 실행하기 위해 [django-crontab](https://pypi.org/project/django-crontab/)을 사용한 경험을 정리한다.


## 설치 및 설정

다음 명령어를 통해 설치한다.

```shell
pip install django-crontab
```

설치를 완료했다면, `settings.py`의 `INSTALLED_APPS`에 `django_crontab`을 추가해주자.

하이픈(`-`)이 아니라 언더바(`_`)이니 헷갈리지 않도록 주의하도록 하자.

```python
INSTALLED_APPS = (
    'django_crontab',
    ...
)
```

이제 cron에게 넘겨줄 업무 함수를 구현한다.
간단하게 **1분마다 hello를 출력하도록 하는 함수**를 만들어 테스트해보자.
app 폴더 하위에 `cron.py` 파일을 만들고 함수를 정의한다.

```python
def hello_every_minute():
    print('hello')
```

이 함수를 cron에게 넘겨주어야 한다.
다시 `settings.py`로 돌아가서 다음과 같이 작성해준다.

```python
CRONJOBS = [
    ('* * * * *', 'app.cron.hello_every_minute', '>> /tmp/log/ggbc_cron.log'),
]
```

`CRONJOBS` 리스트에는 여러 개의 Job을 넣어줄 수 있다.

첫 번째 인자에는 업무를 어느 주기로 실행할지에 대한 내용이다.
처음부터 분, 시, 일, 월, 요일에 대한 값이며 모두 `*`인 경우에는 매 분마다 실행한다.

예를 들어 필자와 같이 자정마다 이 작업을 실행하고 싶으면 `'* 0 * * *'`과 같이 작성해주면 된다.
일주일마다 돌고 싶으면 `'* * */3 * *`과 같이 작성해준다.

슬래시(`/`)가 있으면 매 분(또는 시, 일, 월, 요일)마다 실행하는 것이고 없으면 특정 시간에 실행한다는 뜻이 된다.
슬래시와 숫자 사이에 공백이 없도록 주의하자.

두 번째 인자는 업무 함수의 경로이다.

세 번째 인자는 cron 실행 로그를 쌓을 파일의 경로이다.
출력값을 매번 확인할 수 없으니 위와 같이 로그 파일로 저장하도록 하자.


## 실행

다음 명령어로 cron에게 업무들을 추가해주자.

```shell
python manage.py crontab add
```

잘 들어갔는지 확인하기 위해 다음 명령어로 현재 cron에 부여된 업무 리스트를 확인하자.

```shell
python manage.py crontab show
```

업무들이 한 리스트(`CRONJOBS`) 안에 있으므로 한 번에 삭제되고 한 번에 추가된다.
삭제하는 명령어는 다음과 같다.

```shell
python manage.py crontab remove
```

삭제할 때 에러가 난다면 추가 명령어를 다시 해보고 삭제해보자.

자, 이제 cron이 돌면서 매 분 로그 파일에 *hello*가 추가되어야 하는데, 로그 파일이 생성이 되지 않는다 ?

그렇다면 로컬이 아니라 실 서버에 올려서 실행해보자.

필자는 맥에서 실행해보았는데 스케줄링이 잘 안되는지 로그 파일이 생성되지 않았다 ㅠㅠ
하지만 리눅스 환경에서는 잘 돌아가는 것을 확인했다. (휴)
