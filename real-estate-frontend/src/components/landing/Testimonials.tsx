import Image from 'next/image'

const testimonials = [
  {
    name: 'John Doe',
    role: 'Property Investor',
    content: 'Web3 Estate has revolutionized how I manage my property investments. The transparency and security are unmatched.',
    avatar: '/avatars/john-doe.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'Real Estate Agent',
    content: 'As an agent, I\'ve seen a significant increase in efficiency and trust with clients using this platform.',
    avatar: '/avatars/jane-smith.jpg',
  },
  {
    name: 'Mike Johnson',
    role: 'Property Owner',
    content: 'The ease of transferring property ownership through tokenization is incredible. It\'s the future of real estate.',
    avatar: '/avatars/mike-johnson.jpg',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-700 text-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4 text-gray-200">
                <Image src={testimonial.avatar} alt={testimonial.name} width={50} height={50} className="rounded-full mr-4" />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-blue-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-200">&quot;{testimonial.content}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

