document.addEventListener("DOMContentLoaded", () => {

    const sections =
        document.querySelectorAll(".contribution-card");

    const hero =
        document.querySelector(".contribution-intro");

    const ending =
        document.querySelector(".contribution-ending");

    const contributionLogo =
        document.querySelector(".contribution-logo");

    const currentSection =
        document.getElementById("currentSection");

    const progressLabel =
        document.getElementById("progressLabel");

    const progress =
        document.querySelector(".contribution-progress");

    const updateProgress = () => {

        const endingTop =
            ending.getBoundingClientRect().top;

        const endingIsVisible =
            endingTop < window.innerHeight;

        ending.classList.toggle("is-visible", endingIsVisible);

        contributionLogo.classList.toggle(
            "is-hidden",
            endingIsVisible
        );

        if (endingTop <= window.innerHeight * 0.55) {
            progress.classList.add("is-hidden");
            return;
        }

        let activeSection = null;

        sections.forEach((section) => {

            const bounds =
                section.getBoundingClientRect();

            if (
                bounds.top <= window.innerHeight * 0.55 &&
                bounds.bottom > 0
            ) {
                activeSection = section;
            }
        });

        if (activeSection) {
            currentSection.textContent =
                activeSection.dataset.section;

            progressLabel.textContent =
                activeSection.dataset.label;

            progress.classList.remove("is-hidden");
            return;
        }

        progress.classList.add("is-hidden");
    };


    /* =========================================
       SECTION PROGRESS
    ========================================= */

    const observer =
        new IntersectionObserver(
            (entries) => {

                updateProgress();

            },
            {
                threshold: 0.55
            }
        );


    sections.forEach((section) => {
        observer.observe(section);
    });

    observer.observe(hero);
    observer.observe(ending);
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);


    /* =========================================
       SUPPORT AMOUNTS
    ========================================= */

    const amountButtons =
        document.querySelectorAll(
            ".support-amounts button"
        );


    amountButtons.forEach((button) => {

        button.addEventListener("click", () => {

            amountButtons.forEach((item) => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

        });

    });


    /* =========================================
       SHARE
    ========================================= */

    const shareButton =
        document.getElementById("shareButton");

    const shareFeedback =
        document.getElementById("shareFeedback");


    shareButton.addEventListener("click", async () => {

        const shareData = {

            title: "The ArtWork Stories",

            text:
                "Every art has a story. Discover, create and share them with The ArtWork Stories.",

            url: window.location.origin

        };


        try {

            if (navigator.share) {

                await navigator.share(shareData);

                shareFeedback.textContent =
                    "Thanks for sharing the story.";

                return;
            }


            await navigator.clipboard.writeText(
                window.location.origin
            );

            shareFeedback.textContent =
                "Link copied. Share the story with someone who'd love it.";

        } catch (error) {

            shareFeedback.textContent =
                "Copy the page link and share it with someone who'd love it.";

        }

    });


    /* =========================================
       SUPPORT BUTTON
    ========================================= */

    const supportButton =
        document.getElementById("supportButton");


    supportButton.addEventListener("click", (event) => {

        event.preventDefault();

        /*
         * Payment integration will be added later.
         */

        alert(
            "Support payments will be available soon."
        );

    });




});