document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("messageModal");
    const openModalBtn = document.querySelector(".messages-btn");
    const closeModal = document.querySelector(".close");
    const sendBtn = document.getElementById("sendBtn");

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    sendBtn.addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        if (name && phone) {
            alert(`Сообщение отправлено!\nИмя: ${name}\nТелефон: ${phone}`);
            modal.style.display = "none";
        } else {
            alert("Заполните все поля!");
        }
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});