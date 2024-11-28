# Как подключать ?

### Вызывает компонент **`Onboard`** на соответствующем странице и передаем в него в пропс **`isLogin`** в соответсвтии с состоянием авторизации.

```html
<Onboard isLogin="{isToken}" />
```

# Какие триггеры применяются

Нужно добавить к триггерным элементам(к кнопкам "В верх, В лево, В право") дата аттрибути data-action="mapping.click", на экране те же элементы с навигацией по направлению по сайту, в Онбординг.

```html
<div className="control">
  <button data-action="mapping.click">⬅️ В лево</button>
  <button data-action="mapping.click">В перед ⬆️</button>
  <button data-action="mapping.click">В право ➡️</button>
</div>
```

на эти элементы при помощи атрибутов , привязывается прослушиватель, для наблюдения за действием пользователя, это изолироает логику колобка от логики сайта и делает его назависимым.

# Примеры как пользоваться были заложены в компоненте `App`, можно посмотреть при запуске сборки.