---
title: '🤖 간단한 Slack Bot 만들어 배포해보기'
subtitle: '영자봇, 내 점심을 부탁해!'
date: 2019-05-04
category: 'Slack'
draft: false
---

매일 점심, 저녁 시간에 메뉴를 고르는 것도 일이다.
게다가 나와 같은 선택 장애(?)를 앓고 계신 분들은 더더욱이다.
차라리 누군가가 *"오늘은 이거 어때?"* 하며 말해주는 게 더 편할 것 같다..
그래서 지역 기반 메뉴를 추천해주는 프로그램을 만들어 보았다. (짱 쉬운 기능으로)

## Concept

### 맛집 정보는 어디에서, 어떻게 가져올까?

나는 평소에 사람들이 *"ㅇㅇ 맛집 찾아봐"* 하면 가장 먼저 키는 게 네이버였다. (별다른 이유는 없음)
네이버에 **선릉 맛집**을 검색하면 다음과 같이 친절하게 알려준다.

![네이버 선릉 맛집 검색 결과](images/2019/01.png)

물론 지역 기반 맛집 정보를 알려주는 수많은 웹과 앱이 있지만, ~~가장 귀찮을 때~~ 쉽게 접근할 수 있었던 사이트가 네이버이기 때문에 이곳에서 맛집 정보를 긁어 오자고 생각했다.
또한 그저 **(지역명) 맛집**으로 검색해도 퀄리티 있는 정보들이 리스트로 보여지기 때문에 크롤링 하기에도 쉬울 것 같았다.
여러 기능을 추가하고 싶었지만, 복잡한 기능(추후에 추가 예정)들은 우선 모두 제쳐 두고 가장 간단한 기능(**지역 기반 맛집 상위 50개의 리스트를 가져와서 랜덤하게 맛집을 추천해주는 기능**)만 우선 구현하기로 했다.

### Slack Bot의 이름

개발할 땐 네이밍이 가장 중요하지! ^ㅁ^
맛집을 추천해주는 친구이기 때문에, 그에 걸맞는 이름을 지어 주고 싶었다.
고민 끝에, 평소에 좋아하던 미식가 이영자님❤️의 이름을 따기로 했다. ~~(덕분에 봇의 신뢰감이 높아졌다.)~~

## Process

Slack에서는 [Bot을 개발할 수 있는 API](https://api.slack.com/bot-users)를 제공 해주기 때문에 각자 입맛에 맞는 Bot을 직접 개발하여 유용하게 사용할 수 있다.

### Bot 생성하기

문서를 읽다 보면 *Creating a bot user* 부분이 있다.

![Creating a bot user](images/2019/02.png)

요기서 *app's settings page*를 클릭한다.

![Your Apps](images/2019/03.png)

*Your Apps* 페이지에서, *Create New App*을 클릭한다.

![Create New App](images/2019/04.png)

*App Name*에 앱 이름을 적고, *Development Slack Workspace*에는 App을 추가할 Slack Workspace를 선택 해준다.
*Create App*을 누르면 App이 추가된 것을 확인할 수 있다!
좌측 메뉴에서 *Install App*을 선택 후, *Bot User OAuth Access Token*을 복사해서 환경변수에 추가하자.
이 토큰으로 **Bot User ID**를 가져올것이다.

![Installed App Settings](images/2019/05.png)

### User ID 얻기

가상 환경 생성에 대한 설명은 스킵 ~!

Slack Bot 개발을 위한 가상 환경을 구축했다면 다음과 같이 `slackclient`를 설치해주자.

```shell
(yeongja) $ pip install slackclient
```

앞서 생성한 Slack Bot과 통신을 하기 위해서는 **User ID**가 필요하다.
복사해 두었던 Bot 토큰을 이용해 얻어보자.

```shell
(yeongja) $ curl https://yeongja.slack.com/api/auth.test?token=Bot_User_OAuth_Access_Token
```

결과는 다음과 같이 json형식으로 나온다.
`user_id` 또한 환경 변수로 설정해 주도록 하자.

```shell
{"ok":true,"url":"https://dev-tycoon.slack.com/","team":"DevTycoon","user":"yeongja","team_id":"TEKSU...","user_id":"UGS76..."}
```

자, 이제 Bot을 만들기 위한 기초적인 설정은 모두 끝났다!
필자는 [Slack Bot 개발을 위한 스크립트](https://github.com/mattmakai/slack-starterbot/blob/master/starterbot.py)를 참고하여 진행했다.
설명이 아주 잘 되어있어 쉽게 따라할 수 있었다.

### Slack-starterbot

스크립트가 어떻게 구성 되어 있는지 간단하게 살펴보면 다음과 같다.

1. 환경 변수로 저장해 둔 `Slack Bot Token`을 가져와 `SlackClient` 라이브러리를 통해 객체화한다.
2. `rtm_connect` 함수로 Bot 연결을 시도한다.
3. Web API 함수 `auth.test`로부터 봇의 `user ID`를 읽는다.
4. Slack RTM API에서 오는 이벤트 목록을 분석하여 명령에 해당되는 구문이 있는지 확인한다.
5. 명령을 찾으면 그에 해당되는 동작을 한다.

### 기능 구현하기

핵심 동작을 하는 부분인 `handle_command` 함수에 원하는 기능을 넣어 주면 된다.

### Bot 실행하기

저장한 스크립트를 실행해보자!

```shell
python yeongja.py
```

![영자 봇](images/2019/06.png)

영자님이 친절하게 맛집을 알려 주신다.
자, 그럼 이제 배포를 해서 언제나 사용할 수 있도록 해보자.

### Heroku

[heroku](https://dashboard.heroku.com/apps)는 호스팅을 도와주는 클라우드 PaaS이다.
여러 프로그래밍 언어(Ruby, PHP, Python, Node.js...)를 지원해주고, CI/CD까지 도와주기 때문에 쉽게 배포하고 관리할 수 있다!
또한 ~~(제약 조건이 있으나)~~ 무료로 배포해 볼 수 있어서 토이 프로젝트나 연습용으로 사용하기에 제격이다.

### Slack Bot 배포하기

필자는 python으로 구현하였기 때문에 [이 문서](https://devcenter.heroku.com/articles/getting-started-with-python)를 보며 시작했습니다.

![Getting Started on Heroku with Python](images/2019/07.png)

*I'm ready to start* 버튼을 누르면 OS를 선택하는 화면이 나온다.

![OS 선택 화면](images/2019/08.png)

각자 OS에 맞는 heroku를 다운받았다면 터미널에서 로그인한다.

```shell
heroku login
```

성공적으로 로그인되었다면 프로젝트의 루트 폴더에서 heroku를 생성한다.

```shell
heroku create
```

루트 폴더에는 Slack bot 관련 라이브러리 설정이 포함된 `requirements.txt`가 있어야 한다.

```text
beautifulsoup4==4.7.1
slackclient==1.3.1
```

또한 `Procfile`에 어떤 스크립트를 실행할지 명시해주어야 한다.

```shell
worker: python yeongja.py
```

배포하기 전에, 한참 헤맸던 부분이 있었다면 바로 환경변수 설정이었다.
앞서 환경 변수로 저장했던 토큰을 heroku 서버에 저장해주어야 한다.

```shell
heroku config:set SLACK_BOT_TOKEN=xoxb-495912072293...
```

환경변수 설정까지 완료되었다면 배포해보자.

```shell
git push heroku master
```

정상적으로 배포되었는지 확인해보자.

```shell
heroku ps:scale worker=1
```

위 명령어를 치면 방금 배포한 worker 인스턴스 하나가 동작하고 있다는 것을 알 수 있다.
이제 어디서든 영자님께 맛집을 추천 받을 수 있게 되었다!
Heroku의 공식 문서 중 Slack Bot을 배포하는 방법이 자세히 나와있다. (아래 링크 참고)

다음은 yeongja bot의 deploy pipeline이다.

![deploy pipeline](images/2019/09.png)

GitHub 저장소와 연동을 해서, master 브랜치가 업데이트되면 자동으로 빌드하고 배포되도록 파이프라인을 구성해보았다.
CI/CD를 통해 단 몇번의 클릭으로 빠르게 배포할 수 있어 정말 편리했다.

## Review

이렇게 정말 초 간단하게 Slack bot을 만들어 배포까지 해보았다!
개발보다 포스팅이 더 오래 걸릴 정도로...(?) 빠르게 만들 수 있었다. ~~(기능은 개허접)~~
무엇보다 애플리케이션 배포를 처음 해 보았는데 내가 만든 프로그램을 다른 사람~~(예를 들면 뎁타이쿤 멤버들...)~~들도 사용할 수 있게 되니까 더더욱 재미있었던 것 같다.

하지만 예상보다 유용하게 쓰고있진 않다...
아무래도 나중엔 나를 위한 인공지능 모델이 필요할 것 같다 ㅠ 따흑

## Reference

* [python 슬랙 봇 만들기](https://jybaek.tistory.com/575)
* [How to Build Your First Slack Bot with Python](https://www.fullstackpython.com/blog/build-first-slack-bot-python.html)
* [slack-starterbot](https://github.com/mattmakai/slack-starterbot/blob/master/starterbot.py)
* [Getting Started on Heroku with Python](https://devcenter.heroku.com/articles/getting-started-with-python)
* [How to Deploy Your Slack Bots to Heroku](https://blog.heroku.com/how-to-deploy-your-slack-bots-to-heroku)
