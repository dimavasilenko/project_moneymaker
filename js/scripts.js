document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);

        if (!target) return;

        const headerOffset = -2;
        const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(
                timeElapsed,
                startPosition,
                distance,
                duration
            );
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    });
});

document
    .querySelectorAll('[data-toggle="lesson-details"]')
    .forEach((button) => {
        button.addEventListener('click', function () {
            const moduleBlock = this.closest('.course-program__module');
            const moduleContext = moduleBlock.querySelector(
                '.course-program__module--context'
            );
            const lessonDetails = moduleBlock.querySelector(
                '.course-program__lesson-details'
            );
            const moduleLink = moduleBlock.querySelector(
                '.course-program__module-link'
            );
            const arrowDown = moduleLink.querySelector(
                '.course-program__arrow--down'
            );
            const arrowUp = moduleLink.querySelector(
                '.course-program__arrow--up'
            );

            if (lessonDetails.hasAttribute('hidden')) {
                lessonDetails.removeAttribute('hidden');
                this.textContent = 'Менше';
                arrowDown.style.display = 'none';
                arrowUp.style.display = 'block';
                this.classList.add('active');
                this.classList.add('course-program__module-more--active');
                moduleContext.classList.add(
                    'course-program__module--context-active'
                );
            } else {
                lessonDetails.setAttribute('hidden', '');
                this.textContent = 'Більше';
                arrowDown.style.display = 'block';
                arrowUp.style.display = 'none';
                this.classList.remove('active');
                this.classList.remove('course-program__module-more--active');
                moduleContext.classList.remove(
                    'course-program__module--context-active'
                );
            }
        });
    });
