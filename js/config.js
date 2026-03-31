export const CONFIG = {
    // Fluid Simulation (Parâmetros alinhados com Cursify / inspira-ui)
    simResolution: 128,
    dyeResolution: 1440,
    densityDissipation: 0.90,  // Dissipa rápido → efeito cogumelo que some
    velocityDissipation: 0.93, // Velocidade persiste moderado
    pressure: 0.1,             // Baixo → fluido se expande livremente
    curl: 1,                   // Suave → bloom oval, não espiral compacta
    splatRadius: 0.30,         // Rastro mais largo
    splatForce: 3000,          // Força reduzida → expansão controlada
    velocityThreshold: 5,      // Só cria efeito em movimentos mais rápidos
    textOffsetY: 0.12,
    fluidColor: [0.1, 0.4, 1.0], // Base azul vibrante

    // Scroll & Layout
    scroll: {
        scaleMin: 0.10,
        borderMax: 80,
        zoomDistanceMultiplier: 1.0,
        aboutStartFactor: 0.6,
        aboutEndFactor:   1.4,
        lockThresholdFactor: 2.0,
    },

    // Animation & Parallax
    parallax: {
        moveFactor: 60,
        qaMoveFactor: 120,
        boardMoveFactor: 90,
        lerp: 0.07
    },

    // Content
    content: {
        loreText: "Hello! My name is Victor, I’m 25 years old and a Test Automation Specialist with strong expertise in Java and hands-on experience across API, Mobile, and Web automation. I work with tools such as Selenium, Rest-Assured, Cucumber, Appium, and Python, integrating automated tests into CI/CD pipelines using Jenkins, as well as executing tests in cloud environments through device farms. My mission is to drive software quality through intelligent solutions, efficient automation, and a constant focus on delivering value.",
        typing: {
            totalDuration: 6000,
            cmdDelay: 25,
            pauseDelay: 400
        }
    }
};
