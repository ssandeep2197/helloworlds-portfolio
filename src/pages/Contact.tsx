const Contact = () => (
  <section id="contact" className="p-10">
    <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
    <form action="https://formspree.io/f/{your_form_id}" method="POST" className="space-y-4">
      <input type="text" name="name" placeholder="Your Name" className="w-full p-2 border" required />
      <input type="email" name="email" placeholder="Your Email" className="w-full p-2 border" required />
      <textarea name="message" placeholder="Your Message" className="w-full p-2 border" required></textarea>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Send</button>
    </form>
  </section>
);
export default Contact;
