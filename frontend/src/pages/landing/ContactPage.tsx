import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, ArrowLeft, MessageSquare, Users, Sparkles, Check } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import contactService, { CreateContactData } from '../../services/contact.service';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateContactData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await contactService.submitContact(formData);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus('error');
      setErrorMessage(
        error.response?.data?.message || 
        'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.'
      );
    }
  };

  const features = [
    {
      icon: <MessageSquare className="w-5 h-5 text-[#6366F1]" />,
      title: "Consultas sobre la plataforma",
      desc: "Resolución de dudas técnicas o funcionales sobre Fluxa."
    },
    {
      icon: <Users className="w-5 h-5 text-[#6366F1]" />,
      title: "Colaboraciones o propuestas",
      desc: "Exploremos juntos nuevas formas de automatización e impacto."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#6366F1]" />,
      title: "Solicitudes de acceso o información",
      desc: "Gestión de cuentas, planes y detalles específicos personalizados."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container-xl max-w-7xl">
          {/* Back Button - Top Left */}
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-gray-400 hover:text-[#6366F1] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Volver a la plataforma</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Left Column: Intro Content */}
            <div className="space-y-8">
              <div>
                <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-[#6366F1] mb-6 block">
                  Habla con nosotros
                </span>
                <h1 className="text-[48px] md:text-[56px] font-medium text-gray-900 leading-[1.1] tracking-tight mb-6">
                  Hablemos sobre <span className="text-gradient">Fluxa</span>
                </h1>
                <p className="text-[17px] text-[#6F6F6F] leading-relaxed max-w-lg">
                  Si quieres saber más sobre Fluxa, plantear una colaboración o enviarnos una consulta, 
                  puedes hacerlo desde este formulario. Tu solicitud quedará registrada para revisarla lo antes posible.
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6 pt-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 mb-1">{f.title}</h3>
                      <p className="text-[14px] text-[#6F6F6F] leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-note */}
              <div className="pt-8 border-t border-gray-100 flex items-center gap-3 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Normalmente revisamos las solicitudes manualmente en 24h.</span>
              </div>
            </div>

            {/* Right Column: Form Card */}
            <div className="relative">
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6366F1]/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl -z-10" />

              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-2xl shadow-[#6366F1]/5 ring-1 ring-gray-900/5">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Solicitud recibida!</h2>
                    <p className="text-gray-600 mb-8 mx-auto text-sm leading-relaxed px-4">
                      Gracias por tu interés en Fluxa. Hemos registrado tu consulta y la revisaremos en breve.
                    </p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="cta-button-primary w-full"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-[13px] font-bold text-gray-700 ml-1">Nombre *</label>
                        <input
                          required
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[13px] font-bold text-gray-700 ml-1">Email *</label>
                        <input
                          required
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="hola@empresa.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="company" className="text-[13px] font-bold text-gray-700 ml-1">Empresa</label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Tu empresa"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="subject" className="text-[13px] font-bold text-gray-700 ml-1">Asunto *</label>
                        <input
                          required
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Propuesta, duda..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none transition-all placeholder:text-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-[13px] font-bold text-gray-700 ml-1">Mensaje *</label>
                      <textarea
                        required
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Escribe aquí tu solicitud con el mayor detalle posible..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none transition-all resize-none placeholder:text-gray-400 text-sm"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex gap-2 items-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-[13px] font-medium">{errorMessage}</p>
                      </div>
                    )}

                    <button
                      disabled={status === 'loading'}
                      type="submit"
                      className="w-full cta-button-primary flex items-center justify-center gap-2 group h-[52px]"
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Registrar mi solicitud</span>
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-[11px] text-gray-400">
                      Tus datos están protegidos por nuestra política de privacidad.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
