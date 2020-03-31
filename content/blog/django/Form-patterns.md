---
title: '🔫 폼 패턴들'
subtitle: 'Two Scoops of Django'
date: 2020-03-31
category: 'Django'
draft: false
---

Two Scoops of Django 책에서 소개한 폼 패턴들을 요약 정리해보았다.

말 그대로 **요약**한 내용이기 때문에 코드에 대한 자세한 설명들은 책을 참고하시는 게 좋다 :)

##패턴 1: 간단한 모델폼과 기본 유효성 검사기

```python
from django.views.generic import CreateView, UpdateView

from braces.views import LoginRequiredMixin

from .models import Flavor


class FlavorCreateView(LoginRequiredMixin, CreateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')


class FlavorUpdateView(LoginRequiredMixin, UpdateView):
    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')
```

- `Flavor` 모델을 `FlavorCreateView`와 `FlavorUpdateView`에서 이용하도록 한다.
- 두 뷰에서 `Flavor` 모델에 기반을 둔 `ModelForm`을 자동 생성한다.
- 생성된 `ModelForm`이 `Flavor` 모델의 기본 필드 유효성 검사기를 이용하게 된다.

## 패턴 2: 모델폼에서 커스텀 폼 필드 유효성 검사기 이용하기

```python
from django.core.exceptions import ValidationError


def validate_tasty(value):
    if not value.startswith("Tasty"):
        msg = "Must start with Tasty"
        raise ValidationError(msg)
```

`validate_tasty()`를 다른 종류의 디저트 모델에 적용하기 위해 우선 `TastyTitleAbstractModel`이라는 프로젝트 전반에서 이용할 수 있는 추상화 모델을 추가한다.
`Flavor`와 `Milkshake` 모델이 각기 다른 모델이라 가정할 때 유효성 검사기를 하나의 앱에만 추가하는 것은 적절하지 않을 것이다.

따라서 그 대신 `core/models.py` 모듈을 만들고 `TastyTitleAbstractModel`을 이곳에 추가하겠다.

```python
from django.db import models

from .validators import validate_tasty


class TastyTitleAbstractModel(models.Model):
    title = models.CharField(max_length=255, validators=[validate_tasty])

    class Meta:
        abstract = True
```

앞의 `core/models.py` 코드에서 마지막 두 줄이 `TastyTitleAbstractModel`을 추상화 모델로 만들어 준다.
이제 원래 `flavors/models.py`의 `Flavor` 코드에서 `TastyTitleAbstractModel`을 부모 클래스로 지정해 보겠다.

```python
from django.core.urlresolvers import reverse
from django.db import models

from core.models import TastyTitleAbstractModel


class Flavor(TastyTitleAbstractModel):
    slug = models.SlugField()
    scoops_remaining = models.IntegerField(default=0)

    def get_absolute_url(self):
        return reverse("flavors:detail", kwargs={"slug": self.slug})
```

- 단지 폼에만 `validate_tasty()`를 이용하고자 할 때는 어떻게 해야 할까?
- 타이틀 말고 다른 필드에 이를 적용하고 싶을 때는 어떻게 할 것인가?

이러한 경우들을 처리하기 위해 커스텀 필드 유효성 검사기를 이용하는 커스텀 `FlavorForm`을 작성하기로 한다.

```python
from django import forms

from core.validators import validate_tasty
from .models import Flavor


class FlavorForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(FlavorForm, self).__init__(*args, **kwargs):
        self.fields["title"].validators.append(validate_tasty)
        self.fields["slug"].validators.append(validate_tasty)

    class Meta:
        model = Flavor
```

장고의 모델 기반 수정 뷰는 뷰의 모델 속성을 기반으로 모델폼을 자동으로 생성해 준다.

```python
from django.contrib import messages
from django.views.generic import CreateView, UpdateView, DetailView

from braces.views import LoginRequiredMixin

from .models import Flavor
from .forms import FlavorForm


class FlavorActionMixin(object):

    model = Flavor
    fields = ('title', 'slug', 'scoops_remaining')

    @property
    def success_msg(self):
        return NotImplemented

    def form_valid(self, form):
        messages.info(self.request, self.success_msg)
        return super(FlavorActionMixin, self).form_valid(form)


class FlavorCreateView(LoginRequiredMixin, FlavorActionMixin, CreateView):

    success_msg = "created"
    form_class = FlavorForm


class FlavorUpdateView(LoginRequiredMixin, FlavorActionMixin, UpdateView):

    success_msg = "updated"
    form_class = FlavorForm


class FlavorDetailView(DetailView):

    model = Flavor
```

## 패턴 3: 유효성 검사의 클린 상태 오버라이딩하기

- 다중 필드에 대한 유효성 검사
- 이미 유효성 검사가 끝난 데이터베이스의 데이터가 포함된 유효성 검사

위 두 가지 경우 전부 커스텀 로직으로 `clean()` 또는 `clean_<field_name>()` 메서드를 오버라이딩 할 수 있는 최적의 경우다.
기본 또는 커스텀 필드 유효성 검사기가 실행된 후, 장고는 다음 과정으로 `clean()` 메서드나 `clean_<field_name>()` 메서드를 이용하여 입력된 데이터의 유효성을 검사하는 절차를 진행한다.

1. `clean()` 메서드는 어떤 특별한 필드에 대한 정의도 가지고 있지 않기 때문에 두 개 또는 그 이상의 필드들에 대해 서로 간의 유효성을 검사하는 공간이 된다.
2. 클린(`clean`) 유효성 검사 상태는 영속 데이터에 대해 유효성을 검사하기에 좋은 장소다. 이미 유효성 검사를 일부 마친 데이터에 대해 불필요한 데이터베이스 연동을 줄일 수 있다.

```python
from django import forms
from flavors.models import Flavor


class IceCreamOrderForm(forms.Form):

    slug = forms.ChoiceField("Flavor")
    toppings = forms.CharField()

    def __init__(self, *args, **kwargs):
        super(IceCreamOrderForm, self).__init__(*args, **kwargs)
        self.fields["slug"].choices = [(x.slug, x.title) for x in Flavor.objects.all()]

    def clean_slug(self):
        slug = self.cleaned_data["slug"]
        if Flavor.objects.get(slug=slug).scoops_remaining <= 0:
                raise forms.ValidationError(msg)
        return msg

def clean(self):
    cleaned_data = super(IceCreamOrderForm, self).clean()
    slug = cleanec_data.get("slug", "")
    toppings = cleaned_data.get("toppings", "")

    if "chocolate" in slug.lower() and "chocolate" in toppings.lower():
        msg = "Your order has too much chocolate."
        raise forms.ValidationError(msg)
    return cleaned_data

```

## 패턴 4: 폼 필드 해킹하기(두 개의 CBV, 두 개의 폼, 한 개의 모델)

```python
from django.core.urlresolvers import reverse
from django.db import models


class IceCreamStore(models.Model):
    title = modes.CharField(max_length=100)
    block_address = models.TextField()
    phone = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)

    def get_absolute_url(self):
        return reverse("store_detail", kwargs={"pk": self.pk})
```

사용자가 `title`과 `block_address`는 입력해야 하지만 `phone`과 `description` 필드는 입력하지 않아도 되게 구성되어 있다.
후에 사용자가 `phone`과 `description` 필드를 추가적으로 업데이트하는 것이 가능하도록 구성하고 싶다면 어떻게 해야할까?

장고 폼을 사용할 땐 반드시 다음 사항을 기억하자.

실체화된 폼 객체는 유사 딕셔너리 객체인 `fields` 속성 안에 그 필드들을 저장한다.
따라서 폼으로 필드의 정의를 복사, 붙이기 하는 대신에 간단하게 `ModelForm`의 `__init__()` 메서드에서 새로운 속성을 적용하면 된다.

```python
from .models import IceCreamStore


class IceCreamStoreUpdateForm(forms.ModelForm):

    class Meta:
        model = IceCreamStore

    def __init__(self, *args, **kwargs):
        super(IceCreamStoreUpdateForm, self).__init__(*args, **kwargs)
        self.fields["phone"].required = True
        self.fields["description"].required = True
```

결국 기억해야 할 중요한 점은 장고의 폼도 결국 **파이썬 클래스**라는 사실이다.
장고의 폼 또한 객체로 실체화되고 슈퍼클래스가 되어 다른 클래스를 상속하기도 한다.

```python
from django import forms

from .models import IceCreamStore


class IceCreamStoreCreateForm(forms.ModelForm):

    class Meta:
        model = IceCreamStore
        fields = ("title", "block_address", )


class IceCreamStoreUpdateForm(IceCreamStoreCreateForm):

    def __init__(self, *args, **kwargs):
        super(IceCreamStoreUpdateForm, self).__init__(*args, **kwargs)
        self.fields["phone"].requird = True
        self.fields["description"].required = True

    class Meta(IceCreamStoreCreateForm.Meta):
        fields = ("title", "block_address", "phone", "description", )
```

```python
from django.views.generic import CreateView, UpdateView

from .forms import IceCreamStoreCreateForm
from .forms import IceCreamStoreUpdateForm
from .models import IceCreamStore


class IceCreamCreateView(CreateView):

    model = IceCreamStore
    form_class = IceCreamStoreCreateForm


class IceCreamUpdateView(UpdateView):

    model = IceCreamStore
    form_class = IceCreamStoreUpdateForm
```

## 패턴 5: 재사용 가능한 검색 믹스인 뷰

```python
class TitleSearchMixin(object):

    def get_queryset(self):
        queryset = super(TitleSearchMixin, self).get_queryset()

        q = self.request.GET.get("q")
        if q:
                return queryset.filter(title__icontains=q)
        return queryset
```

```python
from django.views.generic import ListView

from core.views import TitleSearchMixin
from .models import Flavor


class FlavorListView(TitleSearchMixin, ListView):

    model = Flavor
```

```python
from django.views import ListView

from core.views import TitleSearchMixin
from .models import Store


class IceCreamStoreListView(TitleSearchMixin, ListView):

    model = Store
```

```html
<form action="" method="GET">
    <input type="text" name="q" />
    <button type="submit">search</button>
</form>
```

## References

* Two Scoops of Django
