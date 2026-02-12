document.addEventListener('DOMContentLoaded', () => {

    // --- DEFINICIÓN DE VARIABLES GLOBALES (LO QUE FALTABA) ---
    // Buscamos los elementos en el HTML por su ID para usarlos más abajo
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    
    // --- 1. EFECTO DE ESCRITURA ---
    const txtElement = document.querySelector('.txt-type');
    
    if (txtElement) {
        try {
            // Añadí un try-catch por seguridad para el JSON
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
        } catch (error) {
            console.error("Error en el efecto de escritura:", error);
        }
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
                    // Usamos style.display vacío para que recupere su display original (block o flex)
                    // o 'block' si prefieres forzarlo.
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 3. CONEXIÓN CON LA API EXPRESS (OPTIMIZADA) ---
    // Ahora 'contactForm' ya existe porque lo declaramos arriba
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Referencia al botón para dar feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Enviando...";
            submitBtn.disabled = true;

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch('/api/contacto', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    contactForm.reset(); 
                    contactForm.classList.add('hidden');
                    // 'successMsg' también ya existe
                    successMsg.classList.remove('hidden');
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Vaya, parece que el servidor no responde. ¡Inténtalo más tarde!");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});