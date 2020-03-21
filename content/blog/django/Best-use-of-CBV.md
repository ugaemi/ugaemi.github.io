---
title: '🔫 클래스 기반 뷰의 모범적인 이용'
subtitle: 'Two Scoops of Django'
date: 2020-03-21
category: 'Django'
draft: false
---

Django에는 CBV, FBV 두 종류의 뷰가 존재한다.
특히 클래스 기반 뷰는 장고에서 기본적으로 제공하는 제네릭 뷰를 상속해서 사용하면 여러가지 기능을 매우 편리하게 사용할 수 있다.

나는 대부분 함수 기반 뷰로만 작성을 해왔는데 CBV를 잘 활용한 코드가 훨씬 깔끔하고 직관적이라 느껴져 최대한 장고에서 지원해주는 뷰를 잘 사용해보기로 했다.
이번 포스팅은 `Two Scoops of Django` 10장을 읽고 중요한 내용을 정리한 글이다. 더 자세한 내용은 책을 참고하시면 좋다.

## 개요

장고는 클래스 기반 뷰를 작성하는 표준화된 방법을 제공한다.
함수 기반 뷰에서는 뷰 함수 자체가 내장 함수이고, 클래스 기반 뷰에서는 뷰 클래스가 내장 함수를 반환하는 `as_view()` 클래스 메서드를 제공한다.
`django.views.generic.View`에서 해당 메커니즘이 구현되며 모든 클래스 기반 뷰는 이 클래스를 직간접적으로 상속받아 이용한다.
또한 장고는 요즘 대부분의 웹 프로젝트에서 이용되는 제네릭 클래스 기반 뷰(GGBV)를 제공하며, 그 장점을 최대한 살리고 있다.

> 장고의 기본형을 보면 제네릭 클래스 기반 뷰를 위한 중요한 믹스인들이 빠져 있다.
> 하지만 `django-braces` 라이브러리를 이용함으로써 이런 부분들을 해결할 수 있다.
> `django-braces` 라이브러리는 장고의 제네릭 클래스 기반 뷰를 매우 쉽고 빠르게 개발하기 위한 명확한 믹스인들을 제공하고 있다.

## 클래스 기반 를 이용할 때의 가이드라인

- 뷰 코드의 양은 적으면 적을수록 좋다.
- 뷰 안에서 같은 코드를 반복적으로 이용하지 말자.
- 뷰는 프레젠테이션 로직에서 관리하도록 하자. 비즈니스 로직은 모델에서 처리하자. 매우 특별한 경우는 폼에서 처리하자.
- 뷰는 간단 명료해야 한다.
- 403, 404, 500 에러 핸들링에 클래스 기반 뷰는 이용하지 않는다. 대신 함수 기반 뷰를 이용하자.
- 믹스인은 간단 명료해야 한다.

## 클래스 기반 뷰와 믹스인 이용하기

프로그래밍에서는 믹스인이란 실체화된 클래스가 아니라 상속해 줄 기능들을 제공하는 클래스를 의미한다.
프로그래밍 언어에서 다중 상속을 해야 할 때 믹스인을 쓰면 클래스에 더 나은 기능과 역할을 제공할 수 있다.

믹스인을 이용해서 뷰 클래스를 제작할 때 케네스 러브가 제안한 상속에 관한 규칙들을 따르기로 하자.

1. 장고가 제공하는 기본 뷰는 항상 오른쪽으로 진행한다.
2. 믹스인은 기본 뷰에서부터 왼쪽으로 진행한다.
3. 믹스인은 파이썬의 기본 객체 타입을 상속해야만 한다.

```python
from django.views.generic import TemplateView

class FreshFruitMixin(object):
	
    def get_context_data(self, **kwargs):
        context = super(FreshFruitMixin, self).get_context_data(**kwargs)
        context['has_fresh_fruit'] = True
        return context

class FruityFlavorView(FreshFruitMixin, TemplateView):
    template_name = "fruity_flavor.html"
```

이 단순한 예제에서 `FruityFlavorView` 클래스는 `FreshFruitMixin`과 `TemplateView`를 둘 다 상속하고 있다.

`TemplateView`가 장고에서 제공하는 기본 클래스이기 때문에 가장 오른쪽에 위치하며(규칙 1), 그 왼쪽에 `FreshFruitMixin`(규칙 2)을 가져다 놓았다.
마지막으로 `FreshFruitMixin`은 `object`를 상속하고 있다(규칙 3).

## 어떤 장고 제네릭 클래스 기반 뷰를 어떤 태스크에 이용할 것인가?

| 이름 | 목적 |
|--------|----------|
| View      | 어디에서든 이용 가능한 기본 뷰        |
| RedirectView      | 사용자를 다른 URL로 리다이렉트        |
| TemplateView      | 장고 HTML 템플릿을 보여줄 때        |
| ListView      | 객체 목록       |
| DetailView      | 객체를 보여줄 때       |
| FormView      | 폼 전송       |
| CreateView      | 객체를 만들 때       |
| UpdateView      | 객체를 업데이트할 때       |
| DeleteView      | 객체를 삭제       |
| generic dateview      | 시간 순서로 객체를 나열해 보여줄 때      |

## 장고 클래스 기반 뷰에 대한 일반적인 팁

### 인증된 사용자에게만 장고 클래스 기반 뷰/제네릭 클래스 기반 뷰 접근 가능하게 하기

```python
from django.views.generic import DetailView

from braces.views import LoginRequiredMixin

from .models import Flavor


class FlavorDetailView(LoginRequiredMixin, DetailView):
    model = Flavor
```

### 뷰에서 유효한 폼을 이용하여 커스텀 액션 구현하기

뷰에서 폼의 유효성 검사를 할 때 커스텀 액션을 구현하고자 한다면, `form_valid()`는 제네릭 클래스 기반 뷰가 요청을 보내는 곳에 자리잡게 된다.

```python
from django.views.generic import CreateView

from braces.views import LoginRequiredMixin

from .models import Flavor


class FlavorCreateView(LoginRequiredMixin, CreateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')

    def form_valid(self, form):
        # 커스텀 로직이 이곳에 위치
        return super(FlavorCreateView, self).form_valid(form)
```

이미 체크된 폼에 대해 커스텀 로직을 적용하고 싶을 경우, `form_valid()`에 로직을 추가하면 된다.
`form_valid()`의 반환형은 `django.http.HttpResponseRedirect`가 된다.

### 뷰에서 부적합한 폼을 이용하여 커스텀 액션 구현하기

뷰에서 폼의 부적합성 검사를 할 때 커스텀 액션을 구현하고자 한다면, `form_invalid()`는 제네릭 클래스 기반 뷰가 요청을 보내는 곳에 자리잡게 된다.
이 메서드는 `django.http.HttpResponse`를 반환한다.

```python
from django.views.generic import CreateView

from braces.views import LoginRequiredMixin

from .models import Flavor


class FlavorCreateView(LoginRequiredMixin, CreateView):
    model = Flavor

    def form_invalid(self, form):
        # 커스텀 로직이 이곳에 위치
        return super(FlavorCreateView, self).form_invalid(form)
```

`form_valid()`에서 로직을 추가했던 것과 같은 방법으로 `form_invalid()`에서도 로직을 추가할 수 있다.

### 뷰 객체 이용하기

콘텐츠를 렌더링하는 데 클래스 기반 뷰를 이용한다면 자체적인 메서드와 속성을 제공하는 뷰 객체를 이용하여 다른 메서드나 속성에서 호출이 가능하게 하는 방법을 고려해 볼 수 있다. 이런 뷰 객체들은 템플릿에서도 호출할 수 있다.

```python
from django.utils.functional import cached_property
from django.views.generic import UpdateView, TemplateView

from braces.views import LoginRequiredMixin

from .models import Flavor
from .tasks import update_users_who_favorited


class FavoriteMixin(object):

    @cached_property
    def likes_and_favorites(self):
        likes = self.object.likes()
        favorites = self.object.favorites()
        return {
                "likes": likes,
                "favorites": favorites,
                "favorites_count": favorites.count(),
            }


class FlavorUpdateView(LoginRequiredMixin, FavoriteMixin, UpdateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')

    def form_valid(self, form):
        update_users_who_favorited(
                instance=self.object,
                favorites=self.likes_and_favorites['favorites']
        )
        return super(FlavorCreateView, self).form_valid(form)


class FlavorDetailView(LoginRequiredMixin, FavoriteMixin, TemplateView):
    model = Flavor
```

```html
{% extends "base.html" %}

{% block likes_and_favorites %}
<ul>
	<li>Likes: {{ view.likes_and_favorites.likes }}</li>
	<li>Favorites: {{view.likes_and_favorites.favorites_count }}</li>
</ul>
{% endblock likes_and_favorites %}
```

## 제네릭 클래스 기반 뷰와 폼 사용하기

```python
from django.core.urlresolvers import reverse
from django.db import models


STATUS = (
    (0, "zero"),
    (1, "one"),
)


class Flavor(models.Model):
    title = models.CharField(max_lenght=255)
    slug = models.SlugField(unique=True)
    scoops_remaining = models.IntegerField(default=0, choices=STATUS)

    def get_absolute_url(self):
        return reverse("flavors:detail", kwrags={"slug": self.slug})
```

### 뷰 + 모델폼 예제

가장 단순하고 일반적인 장고 폼 시나리오다. 모델을 생성한 후 모델에 새로운 레코드를 추가하거나 기존 레코드를 수정하는 기능들이다.

여기 다음 뷰들이 있다.

1. `FlavorCreateView` : 새로운 종류의 아이스크림을 추가하는 폼
2. `FlavorUpdateView` : 기존 아이스크림을 수정하는 폼
3. `FlavorDetailView` : 아이스크림 추가와 변경을 확정하는 폼

```python
from django.views.generic import CreateView, UpdateView, DetailView

from braces.views import LoginRequiredMixin

from .models import Flavor


class FlavorCreateView(LoginRequiredMixin, CreateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')


class FlavorUpdateView(LoginRequiredMixin, UpdateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')


class FlavorDetailView(DetailView):
    model = Flavor
```

여기서 주의해야 할 점이 있다. 이 뷰들을 `[urls.py](http://urls.py)` 모듈에 연동하고 필요한 템플릿을 생성한 후 다음 문제에 봉착하게 될 것이다.

**FlavorDetailView가 확인 페이지가 아니다.**

문제를 해결하기 위한 첫 번째 절차는 `django.contrib.messages`를 이용하여 사용자가 방문해 아이스크림을 추가하거나 아이스크림을 변경했다는 것을 `FlavorDetailView`에 알리는 것이다.
`FlavorCreateView.form_valid()`와 `FlavorUpdateView.form_valid()` 메서드들을 오버라이딩할 필요가 있다. 이는 `FlavorActionMixin`에서 한번에 편리하게 해결할 수 있다.

이제 장고의 메시지 프레임워크를 이용하여 사용자가 성공적으로 아이템을 추가하거나 수정했을 때 확인 메시지를 보여주게 해보자.
뷰에 확인 메시지를 보여주는 큐를 생성하는 `FlavorActionMixin`을 제작하자.

> 믹스인은 object를 상속해야 한다.
> FlavorActionMixin은 이미 존재하는 믹스인이나 뷰를 상속하지 않고 파이썬의 object 타입을 상속한다는 점을 알아두자.
> 믹스인은 가능한 한 아주 단순한 상속의 연결이 되어야 한다는 것을 잊지 말자.

```python
from django.contrib import messages
from django.views.generic import CreateView, UpdateView, DetailView

from braces.views import LoginRequiredMixin

from .models import Flavor


class FlavorActionMixin(object):

    fields = ('title', 'slug', 'scoops_remaining')

    @property
    def success_msg(self):
        return NotImplemented

    def form_valid(self, form):
        message.info(self.request, self.success_msg)
        return super(FlavorActionMixin, self).form_valid(form)


class FlavorCreateView(LoginRequiredMixin, FlavorActionMixin, CreateView):

    model = Flavor
    success_msg = "Flavor created!"


class FlavorUpdateView(LoginRequiredMixin, FlavorActionMixin, CreateView):

    model = Flavor
    success_msg = "Flavor updated!"


class FlavorDetailView(DetailView):

    model = Flavor
```

종류가 생성되거나 업데이트된 후 메시지 리스트가 `FlavorDetailView`의 `context`로 전송된다. 다음 코드를 뷰의 템플릿에 추가하고 아이스크림 종류를 새로 생성하거나 업데이트하면 이제 메시지들을 볼 수 있을 것이다.

```html
{% if messages %}
  <ul class="messages">
    {% for message in message %}
      <li id="message_{{ forloop.counter }}"
        {% if message.tags %} class="{{ message.tags }}" {% endif %}>
        {{ messsage }}
      </li>
    {% endfor %}
  </ul>
{% endif %}
```

### 뷰 + 폼 예제

때때로 `ModelForm`이 아니라 장고 `Form`을 이용하고 싶을 때도 있을 것이다. 검색 폼과 같은 경우 말이다.
이번 예제에서는 간단한 아이스크림 종류 검색 폼을 만들어 보자. HTML 폼을 만든 후 이 폼의 액션이 ORM을 쿼리하여 쿼리의 결과를 리스트로 검색 결과 페이지에 보여주도록 하겠다.
검색 쿼리에 맞는 검색 결과를 가져오기 위해 `ListView`에서 지원하는 기본 쿼리세트를 수정해야 한다. 이를 위해 `ListView`의 `get_queryset()` 메서드를 오버라이드했다.

```python
from django.views.generic import ListView

from .models import Flavor


class FlavorListView(ListView):

	model = Flavor

	def get_queryset(self):
        queryset = super(FlavorListView, self).get_queryset()

        q = self.request.GET.get("q")
        if q:
            return queryset.filter(title__icontains=q)
        return queryset
```

```html
{% comment %}
  Usage: {% include "flavors/_flavor_search.html" %}
{% endcomment %}
<form action="{% url 'flavor_list' %}" method="GET">
  <input type="text" name="q">
  <button type"submit">search</button>
</form>
```

일단 `ListView`의 `get_queryset()` 메서드를 오버라이딩했다면 나머지 부분은 일반적인 HTML 폼과 다를 게 없어진다.

## django.views.generic.View 이용하기

모든 뷰에서 `django.views.generic.View`만 이용하여 장고 프로젝트 전부를 구성할 수도 있다.

```python
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect
from django.views.generic import View

from braces.views import LoginRequiredMixin

from .forms import FlavorForm
from .models import Flavor


class FlavorView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        flavor = get_object_or_404(Flavor, slug=kwargs['slug'])
        return render(request, "flavors/flavor_detail.html", {"flavor": flavor})

    def post(self, request, *args, **kwargs):
        flavor = get_object_or_404(Flavor, slug=kwargs['slug'])
        form = FlavorForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect("flavors:detail", flavor.slug)
```

물론 이를 함수 기반 뷰로도 만들어 이용할 수도 있다.
하지만 `FlavorView` 안에서 GET/POST 메서드 데코레이션을 이용하는 것이 기존의 `if request.method ==`  식의  조건문을 통하는 것보다 더 낫다는 것은 좀 고민해봐야 할 것이다.
게다가 믹스인을 이용하는 것이 훨씬 직관적이기도 하다.

핵심은 객체 지향의 장점을 살린 클래스 기반 뷰와 함수 기반 뷰를 서로 조합해서 이용함으로써 그 장점을 최대한 살릴 수 있다는 것이다!

이번 장을 읽으며 어떤 식으로 CBV를 활용하면 더 좋을지 감을 잡은 것 같다 :)

## References

* Two Scoops of Django
