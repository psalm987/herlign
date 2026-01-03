
export interface Testimonial {
    name: string;
    role: string;
    quote: string;
    image?: string;
    rating: number;
}

const TESTIMONIALS: Testimonial[] = [
    {
        name: "Ada",
        role: "Designer",
        quote:
            "I joined Herlign during a season where I felt stuck. In just weeks, I found clarity, support, and women who understood me. This space feels like home.",
        // image: "https://picsum.photos/seed/ada/100/100",
        rating: 5,
    },
    {
        name: "Tolu",
        role: "Working Mum",
        quote:
            "Finally, a community where I don't feel judged for wanting more. Herlign helped me start the projects I'd been scared of for years.",
        // image: "https://picsum.photos/seed/tolu/100/100",
        rating: 5,
    },
    {
        name: "Chioma",
        role: "Content Creator",
        quote:
            "The supportive environment at Herlign gave me the confidence to pursue my creative dreams. I've grown so much since joining!",
        image: "https://picsum.photos/seed/chioma/100/100",
        rating: 5,
    },
];

export default TESTIMONIALS;