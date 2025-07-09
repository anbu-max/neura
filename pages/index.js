import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { FaWhatsapp, FaTwitter, FaReddit } from 'react-icons/fa';

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage('Please enter a valid email.');
      return;
    }

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage('✅ You’re on the waitlist!');
      setEmail('');
    } else {
      setMessage(`❌ ${data.error || 'Something went wrong'}`);
    }
  };

  return (
    <>
      <Head>
        <title>Neura — AI Study Buddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      

      <main className={styles.page}>
        <div className={styles.main}>
          <h1 className={styles.title}>Neura A.I</h1>

          <p className={styles.fomo}>
            🚀 Over 1,200+ students joined Neura in 48 hours. Don’t miss out!
          </p>

          <p className={styles.subtitle}>
            Your AI-powered study buddy. Upload boring PDFs and get story-rich, memory-boosting explanations.
          </p>

          <ol>
            <li>🎯 Transforms dull notes into vivid stories</li>
            <li>🔁 Boosts memory with spaced repetition</li>
            <li>🧠 Makes studying fun, not frustrating</li>
          </ol>

          <form onSubmit={handleSubmit} className={styles.ctas}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${styles.emailInput}`}
              required
            />
            <button type="submit" className={styles.primary}>
              Join the Waitlist
            </button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.p
                key="message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={styles.success}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Demo of Neura's Transformation */}
          <div className={styles.neuraDemo}>
            <h2 className={styles.demoTitle}>🎓 How Neura Upgrades Your Notes</h2>

            <div className={styles.demoBlock}>
              <div className={styles.rawBox}>
                <h4>📄 Textbook:</h4>
                <p>
                  The mitochondria is the powerhouse of the cell. It produces ATP through aerobic respiration and powers most cellular processes.
                </p>
              </div>

              <div className={styles.arrow}>⚡</div>

              <div className={styles.aiBox}>
                <h4>🤖 Neura’s Version:</h4>
                <p>
                  Your body is a college 🏫 and each cell has a canteen 🍱 — that's your <strong>mitochondria</strong> (*energy producer*).  
                  It cooks energy snacks called <strong>ATP</strong> (*Adenosine Triphosphate*) using oxygen — <strong>aerobic respiration</strong> 🧪.  
                  Every move, scroll, or blink? Fueled by this snack bar running 24/7 ⚙️.
                </p>
              </div>
            </div>

            <p className={styles.registerNote}>
              Neura turns boring notes into snackable stories 🍿  
              <strong> Want in? </strong> Sign up above ⬆️
            </p>
          </div>

          <div className={styles.footer}>
            <p>Know someone who'd love this?</p>
            <a
              onClick={() => {
                const text = encodeURIComponent(
                  "I just signed up for early access to Neura – the AI study buddy! 🚀 Check it out: https://neura-waitlist.vercel.app"
                );
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className={styles.secondary}
            >
              Share on WhatsApp
            </a>
          </div>
          
          <div className={styles.shareSection}>
  <p className={styles.shareTitle}>Share Neura with your friends 🚀 </p>
  <div className={styles.iconRow}>
    <a
      href={`https://wa.me/?text=${encodeURIComponent(
        "Neura – AI that transforms boring notes into unforgettable stories 📚🚀 Try it now: https://neura-waitlist.vercel.app"
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.icon}
    >
      <FaWhatsapp color="#25D366" size={32} />
    </a>
    <a
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Just joined Neura – your AI-powered study buddy! 🧠🔥 https://neura-waitlist.vercel.app"
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.icon}
    >
      <FaTwitter color="#1DA1F2" size={32} />
    </a>
    <a
      href={`https://www.reddit.com/submit?url=${encodeURIComponent(
        "https://neura-waitlist.vercel.app"
      )}&title=${encodeURIComponent(
        "Neura — AI study tool that turns boring notes into mind-blowing stories! 🚀"
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.icon}
    >
      <FaReddit color="#FF4500" size={32} />
    </a>
  </div>
</div>

        </div>
      </main>
    </>
  );
}
