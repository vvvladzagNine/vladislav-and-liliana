document.addEventListener("DOMContentLoaded", function() {
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

    // Обработка отправки анкеты
    const form = document.getElementById('rsvpForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const attendance = document.querySelector('input[name="attendance"]').checked;
        const menu = document.querySelector('input[name="menu"]:checked')?.value;
        const drinks = Array.from(document.querySelectorAll('input[name="drinks"]:checked'))
            .map(input => input.value);

        // Формируем текст сообщения
        let menuText = '';
        switch(menu) {
            case 'meat':
                menuText = 'мясные блюда';
                break;
            case 'fish':
                menuText = 'рыбные блюда';
                break;
            case 'vegetarian':
                menuText = 'вегетарианские блюда';
                break;
        }

        let drinksText = '';
        if (drinks.length > 0) {
            drinksText = drinks.map(drink => {
                switch(drink) {
                    case 'wine': return 'вино';
                    case 'champagne': return 'шампанское';
                    case 'beer': return 'пиво';
                    case 'strong': return 'крепкий алкоголь';
                    default: return drink;
                }
            }).join(' и ');
            drinksText = `, предпочитаю ${drinksText}`;
        }

        const message = `Привет! Я ${name}, ${attendance ? 'я приду' : 'к сожалению, я не смогу прийти'}. Предпочитаю ${menuText}${drinksText}.`;

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
                form.reset();
            } else {
                throw new Error('Ошибка при отправке');
            }
        } catch (error) {
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
        }
    });

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
});