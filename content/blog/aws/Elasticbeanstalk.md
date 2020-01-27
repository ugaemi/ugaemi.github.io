---
title: '📦 ElasticBeanstalk 시작하기'
subtitle: 'feat. Python + Django + PostgreSQL'
date: 2019-12-15
category: 'AWS'
draft: false
---

## 개요

토이 프로젝트 배포를 어떻게 할까 고민하던 중에 AWS 프리 티어를 마음껏 활용해보자! 생각해서 ElasticBeanstalk으로 배포를 해보기로 했다.

여태까지는 줄곧 EC2로만 배포를 해왔었는데 ElasticBeanstalk을 이용하면 훨씬 쉽고 빠르게 배포를 할 수 있다고 들었다.

하지만 직접 해보기 전까지는 그 편의성을 잘 모르기 때문에 도전해보기로 했다.


## ElasticBeanstalk이란?

> ElasticBeanstalk를 사용하면, 애플리케이션을 실행하는 인프라에 대한 염려 없이 AWS 클라우드에서 애플리케이션을 신속하게 배포 및 관리할 수 있습니다. 선택 또는 제어에 대한 제약 없이 Elastic Beanstalk의 관리 복잡성이 줄어듭니다. 애플리케이션을 업로드하기만 하면 Elastic Beanstalk에서 용량 프로비저닝, 로드 밸런싱, 조정, 애플리케이션 상태 모니터링에 대한 세부 정보를 자동으로 처리합니다.

사실 EC2에 웹 서버(nginX 등)를 연결하고 배포하는 과정이 결코 쉽지만은 않았다. (내 기준)

필요한 패키지 설치부터 시작해서 `requirements.txt` 설치하고.. `uwsgi` 설정하고..

하지만 ElasticBeanstalk을 사용하면 그러한 과정과 시간들이 엄청나게 압축된다는 사실! 빠-밤

알아서 EC2도 생성해주고 `.config` 파일로 배포 설정까지 쉽게 할 수 있도록 도와준다.


## EB CLI 설치

필자는 mac을 사용하고 있으므로 macOS용 설치 방법을 소개한다.

`pip`를 이용해 설치하는 방법도 있지만 필자는 `brew`로 설치했다.

(다른 OS 환경에서 설치하실 분들은 [AWS docs](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/eb-cli3-install-advanced.html)를 참고하자.)

```shell
$ brew update
$ brew install awsebcli
$ eb --version
EB CLI 3.16.0 (Python 3.6.5)
```

## EB CLI 구성

배포할 프로젝트의 루트에서 다음 명령어를 실행한다.

서버의 리전 번호를 입력하고 엔터를 누른다.

```shell
$ eb init
Select a default region
1) us-east-1 : 미국 동부(버지니아 북부)
2) us-west-1 : 미국 서부(캘리포니아 북부 지역)
3) us-west-2 : 미국 서부(오레곤)
4) eu-west-1 : 유럽(아일랜드)
5) eu-central-1 : 유럽(프랑크푸르트)
6) ap-south-1 : 아시아 태평양(뭄바이)
7) ap-southeast-1 : 아시아 태평양(싱가포르)
8) ap-southeast-2 : 아시아 태평양(시드니)
9) ap-northeast-1 : 아시아 태평양(도쿄)
10) ap-northeast-2 : 아시아 태평양(서울)
...
(default is 3): 3
```

`AWS access id`와 `secret key`를 입력한다.

(잘 모르겠다면 [AWS docs](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)를 확인하자.)

```shell
You have not yet set up your credentials or your credentials are incorrect.
You must provide your credentials.
(aws-access-id): aws-access-id
(aws-secret-key): aws-secret-key
```

새로운 애플리케이션을 생성할 것이므로 `1`을 입력한다.

```shell
Select an application to use
1) [ Create new Application ]
(default is 1): 1

```

생성할 애플리케이션의 이름을 입력한다.

기본 애플리케이션 이름은 `eb init`을 실행하는 위치의 폴더 이름이다.

```shell
Enter Application Name
(default is "project_name"): project_name
Application eb has been created.

```

웹 애플리케이션을 개발할 프레임워크와 언어를 선택한다.

필자의 프로젝트는 Python과 Django로 구성했으므로 `3`을 입력했다.

```shell
Select a platform.
1) Node.js
2) PHP
3) Python
4) Ruby
5) Tomcat
6) IIS
7) Docker
8) Multi-container Docker
9) GlassFish
10) Go
11) Java
(default is 1): 3
```

EB 환경에 SSH 키 페어를 할당하려면 y를 입력한다.

잘 모르겠다면 [AWS docs](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/ec2-key-pairs.html)를 확인하자.

```shell
Do you want to set up SSH for your instances?
(y/n): y
```

기존 키 페어를 선택하거나 새로 만든다.

```shell
Select a keypair.
1) [ Create new KeyPair ]
2) ugaemi
(default is 1): 2
```

## 배포 환경 설정

이제 설정 파일을 만들어 보자.

`.ebextensions` 폴더를 만들고 하위에 `.config` 확장자 파일을 생성한다.

파일의 번호 순서로 실행 되므로 `01_init.config`, `02_package.config` 와 같이 정리한다.

```shell
option_settings:
    "aws:elasticbeanstalk:container:python":
      WSGIPath: config/wsgi.py
    "aws:elasticbeanstalk:container:python:staticfiles":
      /static/: "www/static/"
    "aws:elasticbeanstalk:application:environment":
      DJANGO_SETTINGS_MODULE: config.settings
```

설정 파일 작업이 끝났다면 다시 터미널로 가서 `eb create`를 땅 때려 주자.

```shell
$ eb create
Enter Environment Name
(default is EBDjangoProject-dev): project_name-dev
```

DNS CNAME을 입력해준다.

```shell
Enter DNS CNAME prefix
(default is EBDjangoProject-dev): project_name-dev
```

로드 밸런서 타입을 선택 해준다.

```shell
Select a load balancer type
1) classic
2) application
3) network
(default is 1): 2
```

프로젝트에 `.elasticbeanstalk/config.yml` 파일이 생성되었을 것이다.

```shell
branch-defaults:
  master:
    environment: project_name
    group_suffix: null
global:
  application_name: project_name
  branch: null
  default_ec2_keyname: ugaemi
  default_platform: Python 3.6
  default_region: ap-northeast-2
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: eb-cli
  repository: null
  sc: git
  workspace_type: Application
```

정상적으로 배포가 완료 되었다면 `eb open`을 입력해 웹 애플리케이션을 열어 보자!

## 추가 설명

### profile

`profile` 이름은 각 eb 애플리케이션마다 다르게 설정해 주어야 한다.

mac 사용자의 경우 `~/.aws/config` 파일을 열어보면 다음과 같이 생성한 프로필에 대한 설정 값이 나온다.

여기 작성 되어있는 `profile` 이름과 `.elasticbeanstalk/config.yml`의 `profile` 이름은 같아야 한다.

```shell
[profile eb-cli]
aws_access_key_id = access_key_id
aws_secret_access_key = secret_access_key
```

### DB 설정

필자는 RDS PostgreSQL을 사용했는데, DB 설정에서 조금 헤맸다.

특히 PostgreSQL을 사용하기 위해 필요한 패키지를 설치해야 하는 부분을 간과해서 많이 돌아갔다.

```shell
packages:
  yum:
    postgresql96-devel: []
```

바로 이 부분 이었는데, 각자 사용하는 버전을 잘 확인하고 그에 맞는 패키지를 설정 해주면 될 것 같다 :)

### container_commands

컨테이너에서 실행할 명령어를 직접 작성할 수 있다.

필자는 DB migrate와 collectstatic 명령어를 추가적으로 작성해 주었다.

```shell
container_commands:
  01_migrate:
    command: "source /opt/python/run/venv/bin/activate && python manage.py makemigrations && python manage.py migrate"
    leader_only: true
  02_collectstatic:
    command: "source /opt/python/run/venv/bin/activate && python manage.py collectstatic --noinput"
```

## 느낀 점

이번 포스팅은 이쯤에서 마치지만, 작성한 부분 이외에 웹 콘솔과 CLI에서 확인하고 설정할 수 있는 것들이 정말 많다.

그에 대한 부분은 공식 문서를 통해 보면서 공부해 보면 될 것 같다!

확실히 몇 줄 안되는 명령어로 그간 EC2로 배포하며 고생했던 셋팅들을 손쉽게 할 수 있어 놀라웠다.

또 `awsebcli`로 터미널 환경에서 간단하게 배포할 수 있다는 점도 좋았다.

`.ebextensions`를 설정하는 부분은 좀 더 공부해 봐야겠지만, 아무튼 배포가 정말 수월해 진 것은 사실이다..

## References

- [AWS ElasticBeanstalk 공식 문서](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/Welcome.html)