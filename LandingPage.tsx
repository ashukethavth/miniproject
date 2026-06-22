import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  BoltIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  GlobeAltIcon, 
  ChartBarIcon, 
  UsersIcon, 
  SparklesIcon, 
  FingerPrintIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Container } from '@/src/components/ui/Container';
import { Section } from '@/src/components/ui/Section';
import { cn } from '@/src/utils/cn';

import { Link } from 'react-router-dom';

const features = [
  {
    icon: LockClosedIcon,
    title: 'Zero-Trust Access',
    description: 'Implement granular access controls and identity-based security across your entire infrastructure.',
    color: 'bg-blue-50 text-blue-600',
    delay: 0.1,
  },
  {
    icon: ShieldCheckIcon,
    title: 'Continuous Compliance',
    description: 'Automated monitoring for SOC2, HIPAA, and GDPR with real-time alerts and remediation guidance.',
    color: 'bg-emerald-50 text-emerald-600',
    delay: 0.2,
  },
  {
    icon: BoltIcon,
    title: 'Threat Detection',
    description: 'AI-powered anomaly detection that identifies and neutralizes potential threats before they escalate.',
    color: 'bg-amber-50 text-amber-600',
    delay: 0.3,
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Infrastructure',
    description: 'Secure your distributed workforce with our global edge network and localized data residency.',
    color: 'bg-purple-50 text-purple-600',
    delay: 0.4,
  },
  {
    icon: ChartBarIcon,
    title: 'Advanced Analytics',
    description: 'Deep visibility into your security posture with customizable dashboards and automated reporting.',
    color: 'bg-rose-50 text-rose-600',
    delay: 0.5,
  },
  {
    icon: UsersIcon,
    title: 'Team Collaboration',
    description: 'Streamline security workflows with integrated team management and shared responsibility models.',
    color: 'bg-indigo-50 text-indigo-600',
    delay: 0.6,
  },
];

const FloatingShape = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={cn("absolute rounded-full blur-3xl opacity-20", className)}
  />
);

const FloatingCloud = ({ className, delay = 0, speed = 20 }: { className?: string; delay?: number; speed?: number }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ 
      x: ['0vw', '100vw'],
      opacity: [0, 0.15, 0.15, 0],
    }}
    transition={{
      duration: speed,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
    className={cn("absolute pointer-events-none z-[-5]", className)}
  >
    <img 
      src={`https://picsum.photos/seed/${Math.random()}/400/200?blur=2`} 
      alt="Cloud" 
      className="w-full h-auto rounded-full filter blur-xl"
      referrerPolicy="no-referrer"
    />
  </motion.div>
);

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="relative pb-32 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <FloatingCloud className="top-[10%] w-64" delay={0} speed={25} />
        <FloatingCloud className="top-[30%] w-96" delay={5} speed={35} />
        <FloatingCloud className="top-[60%] w-80" delay={12} speed={30} />
        <FloatingCloud className="top-[80%] w-72" delay={2} speed={40} />

        <FloatingShape className="top-20 left-[10%] w-96 h-96 bg-primary-400" delay={0} />
        <FloatingShape className="top-40 right-[10%] w-80 h-80 bg-indigo-400" delay={1} />
        <FloatingShape className="bottom-1/3 left-1/4 w-64 h-64 bg-emerald-400" delay={2} />
        <FloatingShape className="bottom-1/4 right-1/3 w-72 h-72 bg-rose-400" delay={3} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      </div>

      {/* Hero Section */}
      <Section py="xl" className="relative px-4 pt-24 sm:px-6 lg:px-8">
        <Container>
          <motion.div 
            style={{ opacity, scale }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Badge variant="primary" className="mb-8 px-5 py-1.5 text-sm glass shadow-lg border-primary-200/50">
                <SparklesIcon className="h-3.5 w-3.5 mr-2 inline text-primary-600 animate-pulse" />
                Next-Gen Cloud Security
              </Badge>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.95]"
            >
              SECURE YOUR <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 via-indigo-600 to-primary-500 animate-gradient-x">CLOUD DATA</span>
            </motion.h1 >

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed"
            >
              CloudLock provides the architecture for secure file sharing using advanced encryption 
              and granular access control. Protect your most critical assets.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-10 py-4 rounded-2xl text-lg shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full px-10 py-4 rounded-2xl text-lg glass hover:bg-white transition-all group">
                  Login to Portal
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-24 relative max-w-6xl mx-auto"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-primary-500 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-slate-900 rounded-4xl border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
              <img 
                src="https://picsum.photos/seed/cloud-security/1600/1000" 
                alt="CloudLock Interface" 
                className="w-full h-auto opacity-90 group-hover:scale-[1.02] transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 z-20 glass p-4 rounded-2xl shadow-2xl border-white/20 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Encryption Active</p>
                    <p className="text-[10px] text-emerald-400">AES-256 Bit Security</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 z-20 glass p-4 rounded-2xl shadow-2xl border-white/20 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-500/20 p-2 rounded-lg">
                    <FingerPrintIcon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Access Control</p>
                    <p className="text-[10px] text-primary-300">Biometric Auth Enabled</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Trust Section */}
      <Section py="md">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">
              Trusted by the world's most secure enterprises
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['FORBES', 'TECHCRUNCH', 'WIRED', 'VERGE', 'WSJ', 'BLOOMBERG'].map((name) => (
                <span key={name} className="text-2xl font-black tracking-tighter text-slate-500">{name}</span>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section py="lg" className="relative">
        <Container>
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">Secure by design. <br />Cloud by default.</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                CloudLock is built on a zero-trust architecture, ensuring your data remains 
                encrypted and accessible only to authorized users.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full p-8 rounded-3xl border-slate-200/60 bg-white/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 group">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500', feature.color)}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section py="lg" className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Encryption Standard', value: 'AES-256' },
              { label: 'Files Secured', value: '10B+' },
              { label: 'Access Logs', value: 'Real-time' },
              { label: 'Global Regions', value: '60+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</p>
                <p className="text-primary-400 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section py="lg">
        <Container>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-500/20"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight leading-[0.95]">LOCK DOWN <br />YOUR DATA</h2>
              <p className="text-primary-100 text-xl mb-12 max-w-2xl mx-auto font-medium">
                Experience the most secure cloud-based file sharing architecture. 
                Start protecting your organization today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-50 w-full sm:w-auto px-12 py-5 rounded-2xl text-xl font-bold shadow-xl">
                  Get Started Now
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto px-12 py-5 rounded-2xl text-xl font-bold backdrop-blur-sm">
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
};
