---
title: '🔫 장고 폼의 기초'
subtitle: 'Two Scoops of Django'
date: 2020-03-28
category: 'Django'
draft: false
---

지난 포스팅에 이어 이번에는 Two Scoops of Django 책의 장고 폼에 대한 부분을 요약 정리해보았다.

장고 폼을 제대로 이용하면 그동안 뷰에 거추장스럽게 늘어놓았던 유효성 검사에 대한 부분을 생략할 수 있다.
정말 강력한 기능이니 알차게 써먹도록 하자!

# 장고 폼을 이용하여 모든 입력 데이터에 대한 유효성 검사하기

장고 폼은 파이썬 딕셔너리의 유효성을 검사하는 데 최상의 도구다.
대부분의 경우 POST가 포함된 HTTP 요청을 받아 유효성을 검사하는 데 이용하지만 이런 경우 외에는 절대로 쓰지 말라는 제약은 없다.

다른 프로젝트로부터 CSV 파일을 받아 모델에 업데이트하는 장고 앱을 가지고 있다고 하자.

```python
import csv
import StringIO

from .models import Purchase


def add_csv_purchases(rows):

    rows = StringIO.StringIO(rows)
    records_added = 0

    for row in csv.DictReader(rows, delimiter=','):
        purchase.objects.create(**row)
        records_added += 1
    return records_added
```

이 코드에서 간과하고 있는 점은 `Purchase` 모델에서 문자열 값으로 저장되어 있는 셀러가 실제로 존재하는 셀러인지 그 유효성을 검사하고 있지 않다는 점이다.
물론 `add_csv_purchases()` 함수에 유효성 검사 코드를 추가할 수도 있겠지만 매번 데이터가 바뀔 때마다 복잡한 유효성 검사 코드를 필요에 맞춰 유지 관리하기란 매우 번거로운 일이다.

장고의 모델 폼을 이용하면 다음과 같이 입력 데이터에 대해 간단하게 유효성 검사를 할 수 있다.

```python
import csv
import StringIO

from django import forms

from .models import Purchase, Seller


class PurchaseForm(forms.ModelForm):

    class Meta:
        model = Purchase

    def clean_seller(self):
        seller = self.cleaned_data["seller"]
        try:
            Seller.objects.get(name=seller)
        except Seller.DoesNotExist:
            msg = f"{seller} does not exist in purchase #{self.cleaned_data['purchase_number']}."
            raise forms.ValidationError(msg)
        return seller


def add_csv_purchase(rows):
    
    rows = StringIO.StringIO(rows)

    records_added = 0
    errors = []

    for row in csv.DictReader(rows, delimiter=','):

        from = PurchaseForm(row)
        if form.is_valid():
            form.save()
            records_added += 1
        else:
            errors.append(form.errors)

    return records_added, errors
```

# HTML 폼에서 POST 메서드 이용하기

데이터를 변경하는 모든 HTML 폼은 POST 메서드를 이용하여 데이터를 전송하게 된다.

```html
<form action="{% url 'flavor_add' %}" method="POST">
```

# 데이터를 변경하는 HTTP 폼은 언제나 CSRF 보안을 이용해야 한다

장고에는 CSRF(Cross-Site Request Forgery protection, 사이트 간 위조 요청 방지)가 내장되어 있다.

CSRF 보안을 잠시 꺼 두어도 되는 경우로는 머신들 사이에 이용되는 API 사이트를 제작할 때다.
`django-tastypie`나 `django-rest-framework` 같은 API 프레임워크에서는 이러한 처리를 자동으로 다해준다.
API 요청은 단일 요청을 기반으로 인증 요청/인증 허용을 하기 때문에 이런 경우 일반적으로 HTTP 쿠키를 인증 수단으로 이용하지 않는다.

장고의 `CsrfViewMiddleware`를 사이트 전체에 대한 보호막으로 이용함으로써 일일이 손으로 `csrf_protect`를 뷰에 데코레이팅하지 않아도 된다.

## AJAX를 통해 데이터 추가하기

AJAX를 통해 데이터를 추가할 때는 반드시 장고의 CSRF 보안을 이용해야 한다.
절대 AJAX 뷰를 CSRF에 예외 처리하지 말기 바란다.
대신에 HTTP 헤더에 X-CSRFToken을 설정해두도록 한다.

# 장고의 폼 인스턴스 속성을 추가하는 방법 이해하기

때때로 장고 폼의 `clean()`, `clean_FOO()`, `save()` 메서드에 추가로 폼 인스턴스 속성이 필요할 때가 있다.
이럴 경우에는 `request.user` 객체를 이용하면 된다.

```python
from django import forms

from .models import Taster


class TasterForm(forms.ModelForm):

    class Meta:
        model = Taster

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(TasterForm, self).__init__(*args, **kwargs)
```

```python
from django.views.generic import UpdateView

from braces.views import LoginRequiredMixin

from .forms import TasterForm
from .models import Taster


class TasterUpdateView(LoginRequiredMixin, UpdateView):
    model = Taster
    form_class = TasterForm
    success_url = "/someplace/"

    def get_form_kwargs(self):
            kwargs = super(TasterUpdateView, self).get_form_kwargs()
            kwargs['user'] = self.request.user
            return kwargs
```

# 폼이 유효성을 검사하는 방법 알아두기

`form.is_valid()`가 호출될 때 여러 가지 일이 다음 순서로 진행된다.

1. 폼이 데이터를 받으면 `form.is_valid()`는 `form.full_clean()` 메서드를 호출한다.
2. `form._full_clean()`은 폼 필드들과 각각의 필드 유효성을 하나하나 검사하면서 다음과 같은 과정을 수행한다.
    1. 필드에 들어온 데이터에 대해 `to_python()`을 이용하여 파이썬 형식으로 변환하거나 변환할 때 문제가 생기면 `ValidationError`를 일으킨다.
    2. 커스텀 유효성 검사기를 포함한 각 필드에 특별한 유효성을 검사한다. 문제가 있을 때 `ValidationError`를 일으킨다.
    3. 폼에 `clean_<field>()` 메서드가 있으면 이를 실행한다.
3. `form.full_clean()`이 `form.clean()` 메서드를 실행한다.
4. `ModelForm` 인스턴스의 경우 `form.post_clean()`이 다음 작업을 한다.
    1. `form.is_valid()`가 `True`나 `False`로 설정되어 있는 것과 관계없이 `ModelForm` 데이터를 모델 인스턴스로 설정한다.
    2. 모델의 `clean()` 메서드를 호출한다. 참고로 ORM을 통해 모델 인스턴스를 저장할 때는 모델의 `clean()` 메서드가 호출되지는 않는다.

## 모델폼 데이터는 폼에 먼저 저장된 이후 모델 인스턴스에 저장된다

`ModelForm`에서 폼 데이터는 두 가지 각기 다른 단계를 통해 저장된다.

1. 첫 번째로 폼 데이터가 폼 인스턴스에 저장된다.
2. 그 다음에 폼 데이터가 모델 인스턴스에 저장된다.

`form.save()` 메서드에 의해 적용되기 전까지는 `ModelForm`이 모델 인스턴스로 저장되지 않기 때문에 이렇게 분리된 과정 자체를 장점으로 이용할 수 있다.

예를 들면 폼 입력 시도 실패에 대해 좀 더 자세한 사항이 필요할 때, 사용자가 입력한 폼의 데이터와 모델 인스턴스의 변화를 둘 다 저장할 수 있다.

```python
from django.db import models


class ModelFormFailuserHistory(models.Model):
    form_data = models.TextField()
    model_data = models.TextField()
```

```python
import json


from django.contrib import messages
from django.cors import serializers
from core.models import ModelFormFailuerHistory


class FlavorActionMixin(self):

    @property
    def success_msg(self):
        return NotImplemented

    def form_valid(self, form):
        messages.info(self.request, self.success_msg)
        return super(FlavorActionMixin, self).form_valid(form)

    def form_invalid(self, form):
        form_data = json.dumps(form.cleaned_data)
        model_data = serializers.seralize("json", [form.instance])[1:-1]
        ModelFormFailuserHistory.objects.create(
                form_data=form_data,
                model_data=model_data
        )
        return super(FlavorActionMixin, self).form_invalid(form)
```

# 11.6 Form.add_error()를 이용하여 폼에 에러 추가하기

```python
from django import forms


class IceCreamReviewForm(forms.Form):
    # tester 폼의 나머지 부분

    def clean(self):
        cleaned_data = super(TasterForm, self).clean()
        flavor = cleaned_data.get("flavor")
        age = cleaned_data.get("age")

        if flavor == 'coffee' and age < 3:
            msg = 'Coffee Ice Cream is not for Babies.'
            self.add_error('flavor', msg)
            self.add_error('age', msg)

        return cleaned_data
```

## References

* Two Scoops of Django
