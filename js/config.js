export const CONFIG = {
    // Fluid Simulation
    simResolution: 128,
    dyeResolution: 512,
    densityDissipation: 0.900,
    velocityDissipation: 0.990,
    splatRadius: 0.0300,
    splatForce: 0.080,
    velocityThreshold: 4,
    textOffsetY: 0.12,
    fluidColor: [0.1412, 0.2118, 0.3412], // #243657

    // Scroll & Layout
    scroll: {
        scaleMin: 0.10,
        borderMax: 80,
        zoomDistanceMultiplier: 1.0,
        lockThresholdFactor: 2.2,
        loreStartFactor: 0.8,
        loreEndFactor: 1.6,
        fillStartFactor: 0.4,
        fillEndFactor: 1.2
    },

    // Animation & Parallax
    parallax: {
        moveFactor: 60,
        qaMoveFactor: 120,
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
