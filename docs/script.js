document.addEventListener("DOMContentLoaded", function() {
    // Функция для получения параметров из URL
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Функция для обновления имен гостей
    function updateGuestNames() {
        const guestNamesElement = document.getElementById('guestNames');
        if (!guestNamesElement) {
            console.log('Element guestNames not found');
            return;
        }

        const guests = getUrlParameter('guests');
        const gender = getUrlParameter('gender'); // m - мужской, f - женский
        console.log('URL guests parameter:', guests);
        console.log('URL gender parameter:', gender);
        
        if (!guests) {
            console.log('No guests parameter, setting default');
            guestNamesElement.innerHTML = 'Гость';
            guestNamesElement.closest('.invitation-title').querySelector('.dear').textContent = 'Дорогой';
            return;
        }

        // Разделяем имена гостей, если их несколько
        const guestNames = decodeURIComponent(guests).split(',');
        console.log('Decoded guest names:', guestNames);
        
        if (guestNames.length === 1) {
            // Если один гость
            console.log('Single guest:', guestNames[0]);
            guestNamesElement.innerHTML = guestNames[0];
            // Определяем обращение по полу
            if (gender === 'f') {
                guestNamesElement.closest('.invitation-title').querySelector('.dear').textContent = 'Дорогая';
            } else {
                guestNamesElement.closest('.invitation-title').querySelector('.dear').textContent = 'Дорогой';
            }
        } else if (guestNames.length === 2) {
            // Если два гостя
            console.log('Two guests:', guestNames[0], guestNames[1]);
            guestNamesElement.innerHTML = `${guestNames[0]}<br>и ${guestNames[1]}`;
            guestNamesElement.closest('.invitation-title').querySelector('.dear').textContent = 'Дорогие';
        }
    }

    // Вызываем функцию при загрузке страницы
    console.log('DOMContentLoaded event fired');
    updateGuestNames();

    // Модальное окно сообщений
    const modal = document.getElementById("messageModal");
    const messagesBtn = document.getElementById("messagesBtn");
    const closeModal = document.querySelector(".close");
    const sendBtn = document.getElementById("sendBtn");

    // Обработчик для кнопки сообщений
    if (messagesBtn) {
        messagesBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    // Обработчик для закрытия модального окна
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // Обработчик для отправки сообщения
    if (sendBtn) {
        sendBtn.addEventListener("click", async () => {
            const name = document.getElementById("name").value;
            const message = document.getElementById("message").value;
            
            if (name && message) {
                try {
                    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            service_id: 'service_cafl515',
                            template_id: 'template_c6kr64s',
                            user_id: 'lZL_OiR6Dm_XnpEY2',
                            template_params: {
                                from_name: name,
                                message: message,
                                to_email: 'wladzag999@gmail.com'
                            },
                            accessToken: 'ABzc2ZS6P14emVOm4EHAj'
                        })
                    });

                    if (response.ok) {
                        alert('Сообщение успешно отправлено!');
                        modal.style.display = "none";
                        // Очистка полей формы после успешной отправки
                        document.getElementById("name").value = '';
                        document.getElementById("message").value = '';
                    } else {
                        throw new Error('Ошибка при отправке');
                    }
                } catch (error) {
                    alert('Произошла ошибка при отправке сообщения');
                }
            } else {
                alert("Заполните все поля!");
            }
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Обработка удаления из избранного
    const removeFavoriteButtons = document.querySelectorAll('.remove-favorite');
    removeFavoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const vacancyCard = this.closest('.vacancy-card');
            vacancyCard.remove();
        });
    });

    // Активация текущего пункта меню на основе URL
    const currentPage = window.location.pathname.split('/').pop();
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.querySelector('span:last-child').textContent.toLowerCase();
        
        if (currentPage === 'vacancies.html' && btnText === 'вакансии' ||
            currentPage === 'favorites.html' && btnText === 'избранные' ||
            currentPage === 'index.html' && btnText === 'профиль' ||
            !currentPage && btnText === 'профиль') {
            btn.classList.add('active');
        }
    });

    // Добавим в конец существующего DOMContentLoaded
    const sections = document.querySelectorAll('.section-item');

    sections.forEach(section => {
        section.addEventListener('click', function() {
            // Добавляем эффект ряби при клике
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            // Позиционируем эффект ряби в месте клика
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;

            // Удаляем эффект после анимации
            setTimeout(() => {
                ripple.remove();
            }, 1000);

            // Имитация перехода на страницу редактирования
            const sectionName = this.querySelector('h3').textContent;
            alert(`Переход к редактированию раздела "${sectionName}"`);
        });
    });

    // Добавим анимацию для статистики при достижении определенной прокрутки
    const stats = document.querySelectorAll('.stat-value');
    let animated = false;

    function animateStats() {
        stats.forEach(stat => {
            const value = stat.textContent;
            let start = 0;
            const end = parseInt(value);
            const duration = 1000;
            const increment = end / (duration / 16);

            function updateValue() {
                start += increment;
                if (start < end) {
                    stat.textContent = Math.floor(start);
                    requestAnimationFrame(updateValue);
                } else {
                    stat.textContent = value;
                }
            }

            updateValue();
        });
    }

    // Запускаем анимацию статистики при прокрутке до блока
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateStats();
                animated = true;
            }
        });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Обработка отправки анкеты гостя
    const guestForm = document.getElementById('guestForm');
    
    if (guestForm) {
        guestForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-button');
            submitBtn.disabled = true;
            
            const name = document.querySelector('input[name="name"]').value;
            const attendance = document.querySelector('input[name="attendance"]:checked').value;
            
            // Собираем данные о напитках
            const drinks = Array.from(document.querySelectorAll('input[name="drinks"]:checked'))
                .map(input => input.value);
                
            // Собираем данные об аллергии
            const allergies = Array.from(document.querySelectorAll('input[name="allergy"]:checked'))
                .map(input => input.value);
                
            // Собираем данные о предпочтениях в еде
            const foodPreferences = Array.from(document.querySelectorAll('input[name="food"]:checked'))
                .map(input => input.value);
            
            // Формируем текст сообщения
            let attendanceText = '';
            switch(attendance) {
                case 'yes':
                    attendanceText = 'буду присутствовать на торжестве';
                    break;
                case 'no':
                    attendanceText = 'к сожалению, не смогу присутствовать на торжестве';
                    break;
                case 'late':
                    attendanceText = 'буду присутствовать, но не к началу торжества';
                    break;
            }
            
            let drinksText = '';
            if (drinks.length > 0) {
                drinksText = drinks.map(drink => {
                    switch(drink) {
                        case 'champagne': return 'шампанское';
                        case 'white_wine': return 'белое вино';
                        case 'red_wine': return 'красное вино';
                        case 'strong': return 'крепкий алкоголь';
                        case 'beer': return 'пиво';
                        default: return drink;
                    }
                }).join(', ');
                drinksText = `\nПредпочитаю из напитков: ${drinksText}`;
            }
            
            let allergiesText = '';
            if (allergies.length > 0) {
                allergiesText = allergies.map(allergy => {
                    switch(allergy) {
                        case 'nuts': return 'орехи';
                        case 'citrus': return 'цитрусы';
                        case 'lactose': return 'лактоза';
                        case 'gluten': return 'глютен';
                        case 'chocolate': return 'шоколад';
                        default: return allergy;
                    }
                }).join(', ');
                allergiesText = `\nУ меня аллергия на: ${allergiesText}`;
            }
            
            let foodText = '';
            if (foodPreferences.length > 0) {
                foodText = foodPreferences.map(pref => {
                    switch(pref) {
                        case 'no_meat': return 'не ем мясо';
                        case 'no_fish': return 'не ем рыбу';
                        case 'no_seafood': return 'не ем морепродукты';
                        default: return pref;
                    }
                }).join(', ');
                foodText = `\nПредпочтения в еде: ${foodText}`;
            }
            
            const message = `Я ${name}, ${attendanceText}.${drinksText}${allergiesText}${foodText}`;
            
            try {
                const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        service_id: 'service_cafl515',
                        template_id: 'template_c6kr64s',
                        user_id: 'lZL_OiR6Dm_XnpEY2',
                        template_params: {
                            from_name: name,
                            message: message,
                            to_email: 'wladzag999@gmail.com'
                        },
                        accessToken: 'ABzc2ZS6P14emVOm4EHAj'
                    })
                });
                
                if (response.ok) {
                    alert('Спасибо! Ваш ответ отправлен.');
                    guestForm.reset();
                } else {
                    throw new Error('Ошибка при отправке');
                }
            } catch (error) {
                alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease-out';
        sectionObserver.observe(section);
    });

    // Функции для календаря
    let currentDate = new Date(2025, 7, 11); // 7 - это август (месяцы начинаются с 0)
    
    // Анимация для выделенной даты свадьбы
    function animateWeddingDate() {
        const selectedDay = document.querySelector('.calendar-day.selected');
        if (selectedDay) {
            // Добавляем пульсирующую анимацию
            selectedDay.style.animation = 'pulse 2s infinite';
            
            // Добавляем стили для анимации, если их еще нет
            if (!document.getElementById('wedding-date-animation')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'wedding-date-animation';
                styleElement.textContent = `
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                `;
                document.head.appendChild(styleElement);
            }
        }
    }
    
    // Запускаем анимацию для даты свадьбы
    setTimeout(animateWeddingDate, 1000);

    function generateCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const monthElement = document.querySelector('.current-month');
        
        // Обновляем заголовок с текущим месяцем
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        monthElement.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        
        // Очищаем календарь
        while (calendarGrid.children.length > 7) { // Оставляем заголовки дней недели
            calendarGrid.removeChild(calendarGrid.lastChild);
        }
        
        // Добавляем пустые ячейки до первого дня месяца
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Добавляем дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            const daySpan = document.createElement('span');
            daySpan.textContent = day;
            dayElement.appendChild(daySpan);
            
            // Отмечаем текущий день
            const today = new Date();
            if (day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Отмечаем день свадьбы (11 августа 2025)
            if (day === 11 && 
                currentDate.getMonth() === 7 && // Август (0-based)
                currentDate.getFullYear() === 2025) {
                dayElement.classList.add('selected');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }

    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    }

    // Инициализируем календарь с текущей датой
    generateCalendar();

    // Плавная прокрутка к разделам
    function setupSmoothScrolling() {
        // Находим все ссылки, которые ведут к якорям на странице
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Плавная прокрутка к элементу
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Добавляем эффект подсветки для элемента, к которому прокрутили
                    targetElement.classList.add('highlight');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 1500);
                }
            });
        });
        
        // Добавляем стили для эффекта подсветки, если их еще нет
        if (!document.getElementById('highlight-animation')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'highlight-animation';
            styleElement.textContent = `
                @keyframes highlight {
                    0% {
                        background-color: rgba(212, 175, 55, 0.2);
                    }
                    100% {
                        background-color: transparent;
                    }
                }
                
                .highlight {
                    animation: highlight 1.5s ease-out;
                }
            `;
            document.head.appendChild(styleElement);
        }
    }
    
    // Запускаем настройку плавной прокрутки
    setupSmoothScrolling();

    // Обратный отсчет до свадьбы
    function setupCountdown() {
        // Создаем элемент для отсчета, если его еще нет
        if (!document.querySelector('.wedding-countdown')) {
            const weddingDate = document.querySelector('.wedding-date');
            if (weddingDate) {
                const countdownElement = document.createElement('div');
                countdownElement.className = 'wedding-countdown';
                weddingDate.parentNode.insertBefore(countdownElement, weddingDate.nextSibling);
                
                // Добавляем стили для обратного отсчета
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    .wedding-countdown {
                        font-family: 'Andika', sans-serif;
                        font-size: 16px;
                        text-align: center;
                        margin: 10px 0 30px;
                        color: #535A62;
                    }
                `;
                document.head.appendChild(styleElement);
            }
        }
        
        // Функция обновления обратного отсчета
        function updateCountdown() {
            const countdownElement = document.querySelector('.wedding-countdown');
            if (!countdownElement) return;
            
            // Дата свадьбы: 11 августа 2025
            const weddingDate = new Date(2025, 7, 11, 15, 0, 0); // 15:00 11 августа 2025
            const now = new Date();
            
            // Разница в миллисекундах
            const diff = weddingDate - now;
            
            // Если дата свадьбы уже прошла
            if (diff < 0) {
                countdownElement.textContent = 'Свадьба уже состоялась! ❤️';
                return;
            }
            
            // Расчет оставшегося времени
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Форматирование текста с учетом склонений
            function formatDays(number) {
                const lastDigit = number % 10;
                const lastTwoDigits = number % 100;
                
                if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
                    return `${number} дней`;
                }
                
                if (lastDigit === 1) {
                    return `${number} день`;
                }
                
                if (lastDigit >= 2 && lastDigit <= 4) {
                    return `${number} дня`;
                }
                
                return `${number} дней`;
            }
            
            function formatHours(number) {
                const lastDigit = number % 10;
                const lastTwoDigits = number % 100;
                
                if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
                    return `${number} часов`;
                }
                
                if (lastDigit === 1) {
                    return `${number} час`;
                }
                
                if (lastDigit >= 2 && lastDigit <= 4) {
                    return `${number} часа`;
                }
                
                return `${number} часов`;
            }
            
            // Обновляем текст
            countdownElement.textContent = `До свадьбы осталось: ${formatDays(days)}, ${formatHours(hours)}, ${minutes} мин, ${seconds} сек`;
        }
        
        // Обновляем счетчик каждую секунду
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Запускаем обратный отсчет
    setupCountdown();
});