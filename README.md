# Musical school app :notes:

[![Render](https://img.shields.io/badge/Render_deploy-success-success.svg)](https://www.render.com)
[![frontend](https://img.shields.io/website?down_message=offline&label=client&up_message=online&url=https%3A%2F%2Fimg.shields.io%2Fwebsite%3Fstyle%3Dfor-the-badge%26url%3Dhttps%3A%2F%2Fmusical-school-app.onrender.com)](https://musical-school-app.onrender.com)
![backend](https://img.shields.io/website?down_color=critical&label=server&up_color=success&url=https://musical-school.onrender.com/uptime)
[![license](https://img.shields.io/github/license/neketli/musical-school-app-vue3.svg)](https://github.com/neketli/musical-school-app-vue3/blob/main/LICENSE)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)

Приложение для учеников и сотрудников музыкальной школы. Реализовано в виде web-приложения.

![musical-school-preview](https://user-images.githubusercontent.com/48692866/191684382-1ee908b1-c6cb-47ba-947f-d9e820cb347b.gif)

## Фишечки :hammer_and_wrench:

Реализовано на стеке PEVN.

PosgreSQL, ExpressJS, Vue3, NodeJS.

![pevn](https://user-images.githubusercontent.com/48692866/192093796-b049dea0-6110-480e-9fcd-023b59ec362a.png)

Полностью самостоятельная и автономная фуллстек релаизация проекта. 

#### Что в целом интересного? :star2:

- JWT авторизация, от паролей хранится хэш.
- Возможность бэкапа в любое время, с загрузкой на сревер бэкапа и скачиванием соответсвенно.
- Обеспечена темпоральность данных, т.е. можно отследить историю изменений и отменить любое действие.
- Разделена логика роаботы по ролям: (admin, student, teacher ...).
- Лёгкий деплой приложения. (кстати сейчас приложение как раз задеплено с помощью [render](https://render.com/))

#### Frontend :desktop_computer:

На фронте использовался стек vue3, vuex, vue-router, axios, tailwind, vite, cryptoJS, vue-final-modal, vue-select.

Базовые компоненты вынесены в *components* и доступны через `@/components`.
Логика по работе с данными вынесена в соотвествующие сервайсы в *services*.

Остальное по-классике vue приложений.

#### Backend :gear:

NodeJs, Express, pg, cors, dotenv, jsonwebtoken.

Схема (ER-диаграмма) базы данных

![er](https://user-images.githubusercontent.com/48692866/191688088-8942c72e-8f42-470d-b280-b365e46a7c78.jpg)

После выполнения стандартной настройки и подключения к бд (нужно вписать нужное в `.env`) были настроены роуты и соответсвующие контроллеры для полноценного CRUD цикла на каждую таблицу и отношение.

Специфические контроллеры только:
- Auth нужен для авторизации пользователя и выдачи токенов. Так же есть такой же middleware который этот самый токен проверяет.
- Dump реализует логику работы с загружаемыми или скачиваемы файлов бэкапа. Логику бэкапа бд реализует db_dump.js в корневой директории  с помощью execute утилит pg_dump/pg_restore.
- History обеспечивает просмотр истории изменений запрашиваемой таблицы.

Есть ещё доп. роут: /uptime - возвращает аптайм работы приложения, отвечает 200 если всё ок, нужен для поддержания проверки работоспособности сервера.

 #### Общее :large_blue_diamond:

Менеджер пакетов: `yarn`

***Если вы хотите запустить проект у себя в режиме разработки:***
```bash
// Установите зависимости в проекте на клиенте и на сервере
yarn 

// Для дальнейшего запуска не забудьте сконфигурировать .env файл в соотвествии с примерами в папках. 
// Запускаем проекты в режиме разработки на портах - 5173 для фронта и 3000 для бэкенда. 
yarn dev

// Для билда клиентской части
yarn build
// Запуск серверной части
yarn start
```

**Если остались какие либо вопросы или предложения пишите мне**

 ### :musical_keyboard: Приятного пользования! :sunrise:
 
