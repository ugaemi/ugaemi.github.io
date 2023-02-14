---
title: '🧠 입양 시각 구하기(2)'
subtitle: '프로그래머스 Level 4'
date: 2023-02-15
category: 'SQL'
draft: false
---

## 문제

> `ANIMAL_OUTS` 테이블은 동물 보호소에서 입양 보낸 동물의 정보를 담은 테이블입니다.
> `ANIMAL_OUTS` 테이블 구조는 다음과 같으며, `ANIMAL_ID`, `ANIMAL_TYPE`, `DATETIME`, `NAME`, `SEX_UPON_OUTCOME`는 각각 동물의 아이디, 생물 종, 입양일, 이름, 성별 및 중성화 여부를 나타냅니다.
 
| NAME             | TYPE       | NULLABLE |
|------------------|------------|----------|
| ANIMAL_ID        | VARCHAR(N) | FALSE    |
| ANIMAL_TYPE      | VARCHAR(N) | FALSE    |
| DATETIME         | DATETIME   | FALSE    |
| NAME             | VARCHAR(N) | TRUE     |
| SEX_UPON_OUTCOME | VARCHAR(N) | FALSE    |
 
> 보호소에서는 몇 시에 입양이 가장 활발하게 일어나는지 알아보려 합니다. 
> 0시부터 23시까지, 각 시간대별로 입양이 몇 건이나 발생했는지 조회하는 SQL문을 작성해주세요. 
> 이때 결과는 시간대 순으로 정렬해야 합니다.

## 풀이

```sql
WITH RECURSIVE hour AS (
	SELECT 0 AS h
	UNION ALL
	SELECT h+1 FROM hour WHERE h<23
)

SELECT hour.h AS hour, COUNT(hour(a.DATETIME)) AS count FROM hour
LEFT JOIN ANIMAL_OUTS AS a ON hour.h = hour(a.DATETIME)
GROUP BY hour
ORDER BY hour;
```

도저히 {0시, 1시, … 23시}를 새로운 컬럼으로 빼내는 방법이 떠오르지 않았다.
프로그래머스 SQL 문제를 풀다가 구글링을 한 건 처음이었다.
`WITH RECURSIVE` 구문 자체가 초면이었기에 블로그의 풀이를 보고도 한참 생각해야 했다.
풀이를 통해 억지로 이해를 해내긴 했지만 더 정확히 이해하기 위해 MySQL 공식문서를 확인했다.

### WITH(Common Table Expressions)

공통 테이블 표현식이라고도 불리는 `WITH` 구문은 다른 명령문에서 참조할 수 있는 임시 결과 집합이다.
다른 명령문에서 참조할 수 있듯이 다른 `WITH` 문에서도 결과 집합을 참조해 사용할 수 있다.

### WITH RECURSIVE

재귀 CTE라고 불리는 `WITH RECURSIVE` 구문은 반복적으로 생성되는 행 집합이다.
비재귀 CTE와 차이점으로는 다음 두번째 SELECT에서 `cte_name`을 참조하는지 여부라고 볼 수 있겠다.

```sql
WITH RECURSIVE cte_name AS
(
	  SELECT ...      <-- specifies initial set
	  UNION ALL
	  SELECT ...      <-- specifies how to derive new rows
)
```

첫번째 `SELECT`에서는 반복할 행을 초기화하고 두번째 `SELECT`에서는 행을 어떻게 확장할 지 작성한다.
더이상 행을 생성하지 않을때까지 반복하게 되므로 `WHERE`절을 작성하여 루프 종료를 트리거할 수 있다.

풀이에서는 0으로 행을 초기화하고 0+1, 1+1, 2+1 … 처럼 `h`를 1씩 증가하며 행을 확장한다.
`h`가 23이 되면 루프가 종료되고 `UNION ALL`을 통해 {0, 1, … 23}이 합집합의 결과로 떨어지게 된다.

### WITH 임시 테이블은 어디에 저장될까?

Real MySQL 8.0 책을 공부하면서 임시테이블의 경우 메모리에 저장해두었다가 용량이 커지면 디스크로 옮기는 과정이 있다는 것을 알게 되었다.
그럼 WITH 구문의 결과를 저장할 때도 비슷하게 동작할까? 찾아본 결과 동일했다.

> CTE actual cost may also be affected by result set size. 
> A CTE that produces many rows may require an internal temporary table large enough to be converted from in-memory to on-disk format and may suffer a performance penalty.

### WITH vs Subquery

성능적인 면에서도 큰 차이가 없는 WITH 구문과 Subquery은 각각 어떨 때 쓰는 것이 좋을까?

CTE는 재귀적일 수 있다는 점이 가장 큰 특징이다. 또한 WITH 구문은 단일 명령어로 재사용이 가능하기 때문에 Subquery보다 사용성이 좋다.
Subquery의 경우 `WHERE`절에서 바로 필터링이 가능하다는 점, 행이 아닌 열처럼 동작할 수 있다는 점이 특징이다.

각 구문의 특징을 숙지하고 문제 해결의 포인트와 연결시킬 수 있는 구문을 선택하도록 하자.


## References

* [Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/59413)
* [MySQL Document](https://dev.mysql.com/doc/refman/8.0/en/with.html)

