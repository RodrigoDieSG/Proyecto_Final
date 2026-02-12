document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. EFECTO DE ESCRITURA---
    const txtElement = document.querySelector('.txt-type');
    
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = parseInt(txtElement.getAttribute('data-wait'), 10);
        let txt = '';
        let wordIndex = 0;
        let isDeleting = false;

        function type() {
            const current = wordIndex % words.length;
            const fullTxt = words[current];

            if (isDeleting) {
                txt = fullTxt.substring(0, txt.length - 1);
            } else {
                txt = fullTxt.substring(0, txt.length + 1);
            }

            txtElement.innerHTML = `<span class="txt">${txt}</span>`;

            let typeSpeed = isDeleting ? 100 : 200;

            if (!isDeleting && txt === fullTxt) {
                typeSpeed = wait; 
                isDeleting = true;
            } else if (isDeleting && txt === '') {
                isDeleting = false;
                wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => type(), typeSpeed);
        }
        type();
    }

    // --- 2. FILTRADO DE PROYECTOS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active', 'bg-emerald-500', 'text-white'));
            btn.classList.add('active', 'bg-emerald-500', 'text-white');
            
            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 3. CONEXIÓN CON LA API EXPRESS ---
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Recoge los datos del formulario
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                // Hacemos la petición al servidor Express
                const response = await fetch('http://localhost:3000/api/contacto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    contactForm.classList.add('hidden');
                    successMsg.classList.remove('hidden');
                }
            } catch (error) {
                console.error("Error conectando con Express:", error);
                alert("Hubo un problema. ¿Encendiste el servidor con 'node server.js'?");
            }
        });
    }
});