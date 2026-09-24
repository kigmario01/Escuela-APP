import Link from "next/link";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Laptop, 
  CheckCircle2,
  Calendar
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-800">
      
      {/* 1. BARRA SUPERIOR INSTITUCIONAL & NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Identidad */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 block leading-none">
                  Colegio San Martín
                </span>
                <span className="text-xs text-blue-600 font-semibold tracking-wider uppercase mt-1 block">
                  Excelencia Educativa & Valores
                </span>
              </div>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#nosotros" className="hover:text-blue-600 transition-colors">Nosotros</a>
              <a href="#oferta" className="hover:text-blue-600 transition-colors">Oferta Académica</a>
              <a href="#plataforma" className="hover:text-blue-600 transition-colors">Plataforma Digital</a>
              <a href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</a>
            </nav>

            {/* Botón de Acceso al Portal / Login */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/30"
              >
                <span>Acceso al Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Inscripciones Abiertas — Ciclo Escolar 2024-2025</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Formando líderes con <span className="text-blue-600">valores</span> y excelencia académica
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Brindamos una educación integral que combina rigor científico, formación humanista y herramientas digitales para potenciar el talento de cada estudiante.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all"
              >
                <span>Ingresar al Sistema Escolar</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#oferta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <span>Conocer Oferta Educativa</span>
              </a>
            </div>
          </div>

          {/* Estadísticas de impacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-12 border-t border-slate-200/80">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">+25</div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Años de Trayectoria</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">100%</div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Docentes Titulados</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">1,500+</div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Egresados Exitosos</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">#1</div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Calidad Académica</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOSOTROS / PILARES EDUCATIVOS */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Nuestro Enfoque</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              ¿Por qué elegir al Colegio San Martín?
            </p>
            <p className="text-slate-600 mt-4 text-base">
              Nos enfocamos en el desarrollo armónico de las dimensiones intelectuales, afectivas y sociales de nuestros alumnos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Rigor Académico</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Planes de estudio actualizados, metodología basada en competencias y fortalecimiento de habilidades STEAM.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Formación Ética</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Educación fundamentada en respeto, honestidad, empatía y sentido de responsabilidad con la sociedad y el medio ambiente.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Innovación Digital</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Campus conectado y plataforma tecnológica para seguimiento académico, calificaciones y comunicación directa.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Arte y Deporte</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Talleres extracurriculares de música, artes plásticas, clubes de robótica y ligas deportivas de alto rendimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OFERTA ACADÉMICA */}
      <section id="oferta" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Niveles Educativos</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Oferta Académica Integral
            </p>
            <p className="text-slate-600 mt-4 text-base">
              Acompañamos a tus hijos en cada una de sus etapas formativas con docentes especializados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primaria */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col">
              <div className="text-blue-600 font-bold text-sm tracking-wide uppercase">Nivel Básico</div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Educación Primaria</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Desarrollo de habilidades de lectura y escritura, pensamiento analítico, curiosidad científica y aprendizaje del idioma inglés.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Programa bilingüe progresivo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Acompañamiento psicopedagógico</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Laboratorio de cómputo infantil</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                Turno Matutino: 7:30 AM - 2:00 PM
              </div>
            </div>

            {/* Secundaria */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-md p-8 flex flex-col relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                Recomendado
              </div>
              <div className="text-blue-600 font-bold text-sm tracking-wide uppercase">Nivel Medio</div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Educación Secundaria</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Fortalecimiento del pensamiento crítico, proyectos científicos interdisciplinarios, tecnología y maduración socioemocional.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Laboratorios de física y química</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Certificaciones de inglés Cambridge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Clubes de robótica y oratoria</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                Turno Matutino: 7:15 AM - 2:30 PM
              </div>
            </div>

            {/* Bachillerato */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col">
              <div className="text-blue-600 font-bold text-sm tracking-wide uppercase">Nivel Medio Superior</div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Bachillerato General</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Preparación preuniversitaria sólida, orientación vocacional personalizada y convenios con las universidades más prestigiosas.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Talleres preuniversitarios</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Pases directos y becas universitarias</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Emprendimiento y liderazgo juvenil</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                Turno Matutino: 7:00 AM - 3:00 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLATAFORMA DIGITAL ESCUELAAPP */}
      <section id="plataforma" className="py-20 bg-blue-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800 text-blue-200 border border-blue-700">
                <Laptop className="w-3.5 h-3.5" />
                <span>Portal Escolar en Línea</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Acceso 24/7 a la información académica de tus hijos
              </h2>
              <p className="text-blue-100 text-base leading-relaxed">
                Nuestra plataforma institucional <strong>EscuelaApp</strong> conecta a directivos, maestros, alumnos y padres de familia en un solo entorno seguro y amigable.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Boletas y Calificaciones Digitales</h4>
                    <p className="text-sm text-blue-200">Revisión de notas por materia y cálculo de promedios al instante.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Control de Asistencia y Faltas</h4>
                    <p className="text-sm text-blue-200">Registro diario de puntualidad e inasistencias en tiempo real.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Horarios de Clase y Avisos</h4>
                    <p className="text-sm text-blue-200">Comunicados oficiales y horarios actualizados por grupo.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-900 font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-md"
                >
                  <span>Entrar al Portal Escolar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-blue-800/40 border border-blue-700/60 rounded-3xl p-8 backdrop-blur-sm text-slate-100 space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-blue-700/60 pb-4">
                Roles del Sistema
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800 text-center">
                  <Users className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                  <h5 className="font-bold text-sm text-white">Directivos</h5>
                  <p className="text-xs text-blue-200 mt-1">Gestión de inscripciones, importación Excel y estadísticas.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800 text-center">
                  <BookOpen className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                  <h5 className="font-bold text-sm text-white">Docentes</h5>
                  <p className="text-xs text-blue-200 mt-1">Pase de lista digital, captura de notas y avisos.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800 text-center">
                  <GraduationCap className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                  <h5 className="font-bold text-sm text-white">Alumnos</h5>
                  <p className="text-xs text-blue-200 mt-1">Boleta digital, horario semanal y perfil personal.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-800/60 border border-blue-700 flex items-center justify-between">
                <span className="text-sm font-medium">¿Ya eres parte de nuestra comunidad?</span>
                <Link
                  href="/login"
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACTO E INFORMES */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Comunícate con Nosotros</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Visítanos o Solicita Informes
            </p>
            <p className="text-slate-600 mt-4 text-base">
              Nuestro departamento de admisiones está listo para atenderte y brindarte un recorrido guiado por el campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Ubicación del Campus</h4>
              <p className="text-sm text-slate-600">Av. Universidad #1250, Colonia del Valle</p>
              <p className="text-sm text-slate-600">Ciudad de México, CP 03100</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Teléfonos de Atención</h4>
              <p className="text-sm text-slate-600">Conmutador: (55) 5555-0100</p>
              <p className="text-sm text-slate-600">Admisiones: (55) 5555-0101</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Horario de Oficina</h4>
              <p className="text-sm text-slate-600">Lunes a Viernes: 7:30 AM - 3:30 PM</p>
              <p className="text-sm text-slate-600">Sábados: 9:00 AM - 1:00 PM</p>
            </div>
          </div>

          {/* Banner de llamada a la acción */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/20">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold">¿Listo para ingresar al sistema?</h3>
              <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
                Accede a tu cuenta de estudiante, maestro o administrador para consultar tu información académica.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 active:scale-95 transition-all shrink-0 shadow-lg"
            >
              <span>Acceder al Portal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">Colegio San Martín</span>
                <span className="text-xs text-slate-400">Sistema de Gestión Escolar</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a>
              <a href="#oferta" className="hover:text-white transition-colors">Niveles</a>
              <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Iniciar Sesión
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Colegio San Martín. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
