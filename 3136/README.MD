# 3136. Угадай функцию

[<kbd>coderun-2</kbd>](https://coderun.yandex.ru/seasons/2024-summer/tracks/frontend/problem/phi-frontend)

Собрались как-то круги, формула, теорема и олимпиада и решили посчитать функцию. К сожалению, им нужно было очень спешить на YoungCon,поэтому они успели посчитать только первые 10 значений. Они очень хотят подарить по значению функции всем участникам конференции, поэтому просят вас помочь посчитать их для различных $n$. Помогите ребятам порадовать всех на конференции!

<details>
<summary>Форматы ввода/вывода и примеры</summary>

## Формат ввода

Вам дано единственное число
$( 1 \leq n \leq 10^9 )$

## Формат вывода

Выведите $f(n)$.

### Пример 1

<table width = "100%">
<tr>
<th>Ввод</th> <th>Вывод</th>
</tr>
<tr valign="top">
<td><pre>
<code>1
</code></pre></td>

<td><pre>
<code>1
</code></pre></td>
</tr>
</table>

### Пример 2

<table width = "100%">
<tr>
<th>Ввод</th> <th>Вывод</th>
</tr>
<tr valign="top">
<td><pre>
<code>2
</code></pre></td>

<td><pre>
<code>NO 
</code></pre></td>
</tr>
</table>

### Пример 3

<table width = "100%">
<tr>
<th>Ввод</th> <th>Вывод</th>
</tr>
<tr valign="top">
<td><pre>
<code>5
0 1 0 0 0
1 0 0 0 0
0 0 0 1 1
0 0 1 0 1
0 0 1 1 0
</code></pre></td>

<td><pre>
<code>YES
3
5 4 3 
</code></pre></td>
</tr>
</table>

</details>

<details>
<summary>Решение <kbd>javascript</kbd></summary>

### 1. Установка зависимостей

```bash
npm install             # Установка зависимостей
```

### 2. Запуск тестирования решения в среде Jest[^1]

```bash
npm run test            # Unit-тестирование
```

</details>

#### Ссылки на документацию

[^1]: [Jest](https://jestjs.io/docs/getting-started)
