import { PhysicsData } from '@/types/physics';

export const physicsData: PhysicsData = {
  chapters: [
    {
      number: 15,
      title: "Oscillations",
      summary: "This chapter covers simple harmonic motion (SHM), including the motion of spring-mass systems, pendulums, and damped and forced oscillations. Key concepts include period, frequency, amplitude, phase, angular frequency, and resonance.",
      imageUrl: "/images/oscillations.png",
      formulas: [
        {
          id: "ch15-f1",
          name: "Period of Simple Harmonic Motion (Spring-Mass)",
          latex: "T = 2\\pi \\sqrt{\\frac{m}{k}}",
          description: "The period T of a mass-spring system in simple harmonic motion, where m is the mass and k is the spring constant.",
          textbookRef: {
            chapter: 15,
            page: 418
          },
          relatedProblemIds: ["ch15-p1", "ch15-p2"],
          variables: [
            { symbol: "T", meaning: "Period", unit: "s" },
            { symbol: "m", meaning: "Mass", unit: "kg" },
            { symbol: "k", meaning: "Spring constant", unit: "N/m" }
          ]
        },
        {
          id: "ch15-f2",
          name: "Angular Frequency",
          latex: "\\omega = \\sqrt{\\frac{k}{m}} = 2\\pi f = \\frac{2\\pi}{T}",
          description: "The angular frequency ω of simple harmonic motion, related to the spring constant k and mass m.",
          textbookRef: {
            chapter: 15,
            page: 419
          },
          relatedProblemIds: ["ch15-p1", "ch15-p3"],
          variables: [
            { symbol: "\\omega", meaning: "Angular frequency", unit: "rad/s" },
            { symbol: "f", meaning: "Frequency", unit: "Hz" },
            { symbol: "T", meaning: "Period", unit: "s" }
          ]
        },
        {
          id: "ch15-f3",
          name: "Displacement in SHM",
          latex: "x(t) = A \\cos(\\omega t + \\phi)",
          description: "The position x as a function of time for simple harmonic motion, where A is the amplitude and φ is the phase constant.",
          textbookRef: {
            chapter: 15,
            page: 420
          },
          relatedProblemIds: ["ch15-p3"],
          variables: [
            { symbol: "x(t)", meaning: "Displacement at time t", unit: "m" },
            { symbol: "A", meaning: "Amplitude", unit: "m" },
            { symbol: "\\phi", meaning: "Phase constant", unit: "rad" }
          ]
        },
        {
          id: "ch15-f4",
          name: "Velocity in SHM",
          latex: "v(t) = -A\\omega \\sin(\\omega t + \\phi)",
          description: "The velocity as a function of time in simple harmonic motion.",
          textbookRef: {
            chapter: 15,
            page: 421
          },
          relatedProblemIds: ["ch15-p2", "ch15-p3"],
          variables: [
            { symbol: "v(t)", meaning: "Velocity at time t", unit: "m/s" }
          ]
        },
        {
          id: "ch15-f5",
          name: "Maximum Velocity in SHM",
          latex: "v_{\\text{max}} = A\\omega",
          description: "The maximum velocity occurs when the object passes through the equilibrium position.",
          textbookRef: {
            chapter: 15,
            page: 421
          },
          relatedProblemIds: ["ch15-p2"],
          variables: [
            { symbol: "v_{\\text{max}}", meaning: "Maximum velocity", unit: "m/s" }
          ]
        },
        {
          id: "ch15-f6",
          name: "Mechanical Energy in SHM",
          latex: "E = \\frac{1}{2}kA^2",
          description: "The total mechanical energy of a simple harmonic oscillator, which remains constant.",
          textbookRef: {
            chapter: 15,
            page: 422
          },
          relatedProblemIds: ["ch15-p4"],
          variables: [
            { symbol: "E", meaning: "Total mechanical energy", unit: "J" }
          ]
        },
        {
          id: "ch15-f7",
          name: "Period of Simple Pendulum",
          latex: "T = 2\\pi \\sqrt{\\frac{L}{g}}",
          description: "The period of a simple pendulum for small angles, where L is the length and g is gravitational acceleration.",
          textbookRef: {
            chapter: 15,
            page: 425
          },
          relatedProblemIds: ["ch15-p4"],
          variables: [
            { symbol: "L", meaning: "Pendulum length", unit: "m" },
            { symbol: "g", meaning: "Gravitational acceleration", unit: "m/s²" }
          ]
        }
      ],
      problems: [
        {
          id: "ch15-p1",
          chapterNumber: 15,
          problemNumber: 1,
          question: "A 0.50 kg mass is attached to a spring with spring constant k = 20 N/m. What is the period of oscillation?",
          given: [
            "Mass m = 0.50 kg",
            "Spring constant k = 20 N/m"
          ],
          solution: {
            steps: [
              "Use the formula for the period of a spring-mass system: T = 2π√(m/k)",
              "Substitute the given values: T = 2π√(0.50/20)",
              "Calculate: T = 2π√(0.025) = 2π(0.158) ≈ 0.99 s"
            ],
            finalAnswer: "T ≈ 0.99 s"
          },
          usedFormulaIds: ["ch15-f1", "ch15-f2"],
          difficulty: "easy"
        },
        {
          id: "ch15-p2",
          chapterNumber: 15,
          problemNumber: 2,
          question: "A mass-spring system oscillates with amplitude A = 10 cm and angular frequency ω = 5.0 rad/s. What is the maximum velocity of the mass?",
          given: [
            "Amplitude A = 10 cm = 0.10 m",
            "Angular frequency ω = 5.0 rad/s"
          ],
          solution: {
            steps: [
              "The maximum velocity in SHM is given by: v_max = Aω",
              "Substitute: v_max = (0.10 m)(5.0 rad/s)",
              "Calculate: v_max = 0.50 m/s"
            ],
            finalAnswer: "v_max = 0.50 m/s"
          },
          usedFormulaIds: ["ch15-f4", "ch15-f5"],
          difficulty: "easy"
        },
        {
          id: "ch15-p3",
          chapterNumber: 15,
          problemNumber: 3,
          question: "A 2.0 kg mass on a spring oscillates with a period of 0.50 s. If the displacement at t = 0 is x = 5.0 cm with zero initial velocity, write the equation for x(t) and find the displacement at t = 0.10 s.",
          given: [
            "Mass m = 2.0 kg",
            "Period T = 0.50 s",
            "Initial displacement x₀ = 5.0 cm = 0.050 m",
            "Initial velocity v₀ = 0"
          ],
          solution: {
            steps: [
              "Calculate angular frequency: ω = 2π/T = 2π/0.50 = 12.57 rad/s",
              "Since v₀ = 0 and x₀ > 0, the phase constant φ = 0, and amplitude A = x₀ = 0.050 m",
              "The equation is: x(t) = 0.050 cos(12.57t) meters",
              "At t = 0.10 s: x(0.10) = 0.050 cos(12.57 × 0.10) = 0.050 cos(1.257 rad)",
              "Calculate: x(0.10) = 0.050 × 0.309 ≈ 0.015 m = 1.5 cm"
            ],
            finalAnswer: "x(t) = 0.050 cos(12.57t) m; x(0.10 s) ≈ 1.5 cm"
          },
          usedFormulaIds: ["ch15-f2", "ch15-f3", "ch15-f4"],
          difficulty: "medium"
        },
        {
          id: "ch15-p4",
          chapterNumber: 15,
          problemNumber: 4,
          question: "A simple pendulum has a length of 2.0 m. (a) What is its period on Earth (g = 9.8 m/s²)? (b) If a spring-mass system has the same period, and k = 50 N/m, what is the mass? (c) What is the total energy if the spring's amplitude is 8.0 cm?",
          given: [
            "Pendulum length L = 2.0 m",
            "g = 9.8 m/s²",
            "Spring constant k = 50 N/m",
            "Amplitude A = 8.0 cm = 0.080 m"
          ],
          solution: {
            steps: [
              "(a) Use pendulum period formula: T = 2π√(L/g) = 2π√(2.0/9.8) ≈ 2.84 s",
              "(b) For spring-mass with same period: T = 2π√(m/k), so m = kT²/(4π²)",
              "Calculate: m = 50 × (2.84)²/(4π²) ≈ 10.2 kg",
              "(c) Total energy: E = (1/2)kA² = (1/2)(50)(0.080)² = 0.16 J"
            ],
            finalAnswer: "(a) T ≈ 2.84 s; (b) m ≈ 10.2 kg; (c) E = 0.16 J"
          },
          usedFormulaIds: ["ch15-f7", "ch15-f1", "ch15-f6"],
          difficulty: "hard"
        }
      ]
    }
  ]
};
