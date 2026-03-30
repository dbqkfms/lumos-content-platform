import React, { useState } from "react";
import { useLocation } from "wouter";

import { useAuth } from "@/contexts/AuthContext";
import { DEMO_ACCOUNTS } from "@/data/mockData";
import Header from "@/components/Header";

const roleCards = [
  {
    title: "Buyer / Operator",
    body: "Review collections, align by space, and move into inquiry with the right context.",
  },
  {
    title: "Artist",
    body: "Upload work, track review status, and respond to feedback requests.",
  },
  {
    title: "Admin",
    body: "Moderate content, manage artists, and handle inbound inquiries in one flow.",
  },
];

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, user } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") setLocation("/admin/dashboard");
      else if (user.role === "artist") setLocation("/artist/dashboard");
      else setLocation("/");
    }
  }, [user, setLocation]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const success = await signIn(email, password);
    if (!success) {
      setError("Login failed. Please check your email and password.");
    }
  };

  const handleDemoLogin = async (accountEmail: string) => {
    setError("");
    const success = await signIn(accountEmail, "demo");
    if (!success) setError("Demo login failed.");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <section className="px-6 pb-20 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-5 font-accent text-xs tracking-[0.28em] text-[#D4A843]">SIGN IN</p>
            <h1 className="max-w-3xl text-display text-[2.8rem] leading-[0.94] text-white md:text-[4.6rem]">
              Sign in is where the public demo
              <br />
              hands off into the working platform.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              The public site explains the offer. Sign in explains what changes after access: review, upload, moderation,
              and dashboard flows.
            </p>

            <div className="mt-8 grid gap-4">
              {roleCards.map((item) => (
                <article key={item.title} className="border border-white/8 bg-[#111] p-5">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="border border-white/8 bg-[#111] p-8">
            <div className="mb-8">
              <div className="font-accent text-[10px] tracking-[0.4em] uppercase text-[#D4A843]">Portal Access</div>
              <div className="mt-3 text-2xl text-white">Sign in</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-accent text-[10px] tracking-[0.3em] uppercase text-[#909090]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-[#f5f5f5] focus:border-[#D4A843] focus:outline-none"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block font-accent text-[10px] tracking-[0.3em] uppercase text-[#909090]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-[#f5f5f5] focus:border-[#D4A843] focus:outline-none"
                  placeholder="password"
                  required
                />
              </div>

              {error ? (
                <div className="border border-red-900/30 bg-red-900/20 p-3 text-sm text-red-400">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full bg-[#D4A843] py-3 font-accent text-[10px] tracking-[0.3em] uppercase text-black transition-colors hover:bg-[#F0C060]"
              >
                Sign in
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-4 text-center font-accent text-[10px] tracking-[0.4em] uppercase text-[#909090]">
                Demo Accounts
              </div>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleDemoLogin(account.email)}
                    className="flex w-full items-center justify-between border border-white/5 bg-[#1a1a1a] px-4 py-2.5 transition-colors hover:border-white/15"
                  >
                    <span className="text-sm text-[#e0e0e0]">{account.email}</span>
                    <span className="font-accent text-[9px] tracking-[0.3em] uppercase text-[#909090]">{account.role}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] text-[#666]">Demo password: demo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
