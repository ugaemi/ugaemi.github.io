---
title: '🔫 Django choices field'
subtitle: 'get_FOO_display()'
date: 2019-08-30
category: 'Django'
draft: false
---

## 기본 사용법

두 개의 아이템으로 이루어진 튜플을 필드로 사용한다.

각 튜플의 첫 번째 요소는 **DB에 저장할 실제 값**이고, 두 번째 요소는 **display 용 이름**이다. 예를 들면 다음과 같다.

```python
YEAR_IN_SCHOOL_CHOICES = [
    ('FR', 'Freshman'),
    ('SO', 'Sophomore'),
    ('JR', 'Junior'),
    ('SR', 'Senior'),
]
```

위와 같이 `CHOICES` 필드를 미리 정의해두고 `CharField`에 사용하는 것이 일반적이다.

```python
from django.db import models


class Student(models.Model):
    FRESHMAN = 'FR'
    SOPHOMORE = 'SO'
    JUNIOR = 'JR'
    SENIOR = 'SR'
    YEAR_IN_SCHOOL_CHOICES = [
        (FRESHMAN, 'Freshman'),
        (SOPHOMORE, 'Sophomore'),
        (JUNIOR, 'Junior'),
        (SENIOR, 'Senior'),
    ]
    year_in_school = models.CharField(
        max_length=2,
        choices=YEAR_IN_SCHOOL_CHOICES,
        default=FRESHMAN,
    )

    def is_upperclass(self):
        return self.year_in_school in (self.JUNIOR, self.SENIOR)
```

## 그룹화

다음처럼 `CHOICES`를 그룹으로 정의할 수도 있다.

```python
MEDIA_CHOICES = [
    ('Audio', (
            ('vinyl', 'Vinyl'),
            ('cd', 'CD'),
        )
    ),
    ('Video', (
            ('vhs', 'VHS Tape'),
            ('dvd', 'DVD'),
        )
    ),
    ('unknown', 'Unknown'),
]
```

각 튜플의 첫 번째 요소는 **그룹에 적용 할 이름**이다.
두 번째 요소는 **2 개의 튜플을 반복** 할 수 있으며 각 2 개의 튜플에는 실제 값과 display 이름이 들어 있다.
그룹화 된 옵션은 단일 목록 내에서 그룹화되지 않은 옵션(`unknown`)과 결합 될 수 있다.

## get_FOO_display()

`choices`가 설정된 모든 필드는 `get_FOO_display()` 메서드를 갖는다.
이 메서드는 사람이 읽을 수 있는 display 용 값을 반환한다.

예를 들면 다음과 같다.

```python
from django.db import models


class Person(models.Model):
    SHIRT_SIZES = (
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
    )
    name = models.CharField(max_length=60)
    shirt_size = models.CharField(max_length=2, choices=SHIRT_SIZES)
```

```python
>>> p = Person(name="Fred Flintstone", shirt_size="L")
>>> p.save()
>>> p.shirt_size
'L'
>>> p.get_shirt_size_display()
'Large'
```

view 뿐만 아니라 template에서도 마찬가지로 잘 동작한다.

## References

* [Django 공식 도큐먼트](https://docs.djangoproject.com/en/2.2/ref/models/fields/)
