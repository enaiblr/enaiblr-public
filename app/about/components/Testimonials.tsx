import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Fadhil",
    role: "Product Manager",
    content: "Platform ini jadi game-changer buat saya. Sekarang bisa bikin konten, analisis data, dan riset jauh lebih cepat. Menghemat waktu saya sampai 70%.",
    image: "icon.png",
  },
  {
    name: "Sarah",
    role: "Digital Marketer",
    content:
      "Website ini sangat membantu saya dalam menghasilkan ide konten, visual, dan copy dalam hitungan menit. Fitur AI-nya lengkap dan sangat membantu creative process saya",
    image: "icon.png",
  },
  {
    name: "Wijaya",
    role: "Peneliti",
    content:
      "Saya terkesan dengan kemudahan akses ke berbagai tools AI dalam satu platform ini. Sangat membantu untuk riset akademis dan membuat materi presentasi.",
    image: "icon.png",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
          {" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Loved 
            </span> {" "}
            by Our Users</h2>
          <p className="text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:px-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;