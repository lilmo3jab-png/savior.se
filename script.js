document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       MOBILE NAVIGATION
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = 'rgba(252, 251, 250, 0.98)';
                navMenu.style.padding = '1.5rem';
                navMenu.style.borderBottom = '1px solid var(--color-border)';
                navMenu.style.gap = '1.25rem';
            } else {
                icon.className = 'fa-solid fa-bars';
                navMenu.removeAttribute('style');
            }
        });
        
        // Close nav when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
                    navMenu.removeAttribute('style');
                }
            });
        });
    }

    /* ==========================================================================
       INTERACTIVE CALCULATOR
       ========================================================================== */
    const rangeSavings = document.getElementById('rangeSavings');
    const rangeYears = document.getElementById('rangeYears');
    const rangeReturn = document.getElementById('rangeReturn');
    
    const valSavings = document.getElementById('valSavings');
    const valYears = document.getElementById('valYears');
    const valReturn = document.getElementById('valReturn');
    
    const resYears = document.getElementById('resYears');
    const resTotal = document.getElementById('resTotal');
    const resInvested = document.getElementById('resInvested');
    const resInterest = document.getElementById('resInterest');
    
    const barInvested = document.getElementById('barInvested');
    const barInterest = document.getElementById('barInterest');

    // Starting principal amount from the Excel template
    const START_PRINCIPAL = 10000; 

    function formatCurrency(amount) {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 0
        }).format(amount).replace('kr', 'kr');
    }

    function calculateCompoundInterest() {
        const monthlySavings = parseFloat(rangeSavings.value);
        const years = parseInt(rangeYears.value);
        const annualReturn = parseFloat(rangeReturn.value) / 100;
        
        const monthlyRate = annualReturn / 12;
        const totalMonths = years * 12;
        
        // Compound interest calculation matching standard Excel PMT accumulation
        let futureValue = START_PRINCIPAL;
        let totalInvested = START_PRINCIPAL;
        
        for (let m = 1; m <= totalMonths; m++) {
            // Apply monthly interest first, then add monthly savings, matching standard flow
            futureValue = (futureValue + monthlySavings) * (1 + monthlyRate);
            totalInvested += monthlySavings;
        }
        
        const totalProfit = Math.max(0, futureValue - totalInvested);
        
        // Update display text
        valSavings.textContent = formatCurrency(monthlySavings);
        valYears.textContent = `${years} år`;
        valReturn.textContent = `${rangeReturn.value}%`;
        
        resYears.textContent = years;
        resTotal.textContent = formatCurrency(futureValue);
        resInvested.textContent = formatCurrency(totalInvested);
        resInterest.textContent = formatCurrency(totalProfit);
        
        // Update visual chart bars
        const investedPercent = (totalInvested / futureValue) * 100;
        const interestPercent = 100 - investedPercent;
        
        barInvested.style.width = `${investedPercent}%`;
        barInterest.style.width = `${interestPercent}%`;
        
        // Accessibility labels inside style widths
        barInvested.setAttribute('title', `Insatt belopp: ${Math.round(investedPercent)}%`);
        barInterest.setAttribute('title', `Ränta på ränta: ${Math.round(interestPercent)}%`);
    }

    if (rangeSavings && rangeYears && rangeReturn) {
        // Add events
        rangeSavings.addEventListener('input', calculateCompoundInterest);
        rangeYears.addEventListener('input', calculateCompoundInterest);
        rangeReturn.addEventListener('input', calculateCompoundInterest);
        
        // Initial run
        calculateCompoundInterest();
    }

    /* ==========================================================================
       FAQ ACCORDION
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            // Check if active
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                accItem.classList.remove('active');
                accItem.querySelector('.accordion-content').style.maxHeight = '0';
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    /* ==========================================================================
       TESTIMONIALS SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    if (nextBtn && prevBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // reset interval
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // reset interval
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                showSlide(index);
                startAutoSlide(); // reset interval
            });
        });

        // Initialize Slider
        showSlide(0);
        startAutoSlide();
    }

    /* ==========================================================================
       SIMULATED CHECKOUT INTERACTION
       ========================================================================== */
    window.simulateCheckout = function() {
        // Premium alert/modal interaction instead of generic browser alert
        const modal = document.createElement('div');
        modal.className = 'checkout-modal-overlay';
        modal.innerHTML = `
            <div class="checkout-modal">
                <div class="modal-icon"><i class="fa-solid fa-circle-check"></i></div>
                <h3>Säker kassa laddas...</h3>
                <p>I din fullständiga Shopify-butik kommer den här knappen att leda kunden direkt till kassan (Shopify Checkout) med Klarna, Swish eller kortbetalning förberedd för det digitala paketet.</p>
                <div class="modal-details">
                    <span><strong>Produkt:</strong> Konsten att spara pengar (PDF + Excel)</span>
                    <span><strong>Pris:</strong> 299 kr (Engångsavgift)</span>
                </div>
                <button class="btn btn-secondary close-modal-btn">Stäng förhandsvisning</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add Modal Styling Dynamically
        const style = document.createElement('style');
        style.id = 'modal-dynamic-style';
        style.innerHTML = `
            .checkout-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(26, 39, 25, 0.6);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease forwards;
            }
            .checkout-modal {
                background-color: var(--color-bg-light);
                border-radius: var(--border-radius-lg);
                border: 1px solid var(--color-border);
                padding: 2.5rem;
                max-width: 460px;
                width: 90%;
                box-shadow: 0 25px 60px rgba(0,0,0,0.15);
                text-align: center;
                animation: slideUp 0.3s ease forwards;
            }
            .modal-icon {
                font-size: 3rem;
                color: var(--color-primary);
                margin-bottom: 1rem;
            }
            .checkout-modal h3 {
                margin-bottom: 0.75rem;
                font-size: 1.5rem;
            }
            .checkout-modal p {
                font-size: 0.875rem;
                color: var(--color-text-muted);
                margin-bottom: 1.5rem;
                line-height: 1.5;
            }
            .modal-details {
                background-color: var(--color-bg-alt);
                border-radius: var(--border-radius-sm);
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                font-size: 0.8125rem;
                text-align: left;
                margin-bottom: 1.75rem;
                border: 1px solid var(--color-border);
            }
            .close-modal-btn {
                width: 100%;
                padding: 0.75rem;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Close event
        const closeBtn = modal.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeIn 0.2s ease reverse forwards';
            modal.querySelector('.checkout-modal').style.animation = 'slideUp 0.2s ease reverse forwards';
            setTimeout(() => {
                modal.remove();
                document.getElementById('modal-dynamic-style').remove();
            }, 200);
        });
    };
});
