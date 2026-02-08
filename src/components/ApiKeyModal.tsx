"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, X, ExternalLink, Check } from "lucide-react";
import { saveApiKeys, hasApiKeys } from "@/lib/api";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ApiKeyModal({ open, onClose, onSaved }: ApiKeyModalProps) {
  const existing = hasApiKeys();
  const [youtubeKey, setYoutubeKey] = useState("");
  const [newsKey, setNewsKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (youtubeKey.trim()) saveApiKeys(youtubeKey.trim(), undefined);
    if (newsKey.trim()) saveApiKeys(undefined, newsKey.trim());
    setSaved(true);
    setTimeout(() => {
      onSaved();
      onClose();
      setSaved(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-gray-950 border border-white/10 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <Key size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">API Keys</h3>
                  <p className="text-xs text-gray-500">
                    Enable real-time news &amp; videos
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* YouTube API Key */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube Data API v3 Key
                {existing.youtube && (
                  <span className="ml-2 text-xs text-green-400">
                    (configured)
                  </span>
                )}
              </label>
              <input
                type="password"
                value={youtubeKey}
                onChange={(e) => setYoutubeKey(e.target.value)}
                placeholder={
                  existing.youtube ? "••••••••••••••" : "AIza..."
                }
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-purple-500/50 transition-colors"
              />
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1.5 transition-colors"
              >
                Get a key from Google Cloud Console
                <ExternalLink size={10} />
              </a>
            </div>

            {/* News API Key */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GNews API Key
                {existing.news && (
                  <span className="ml-2 text-xs text-green-400">
                    (configured)
                  </span>
                )}
              </label>
              <input
                type="password"
                value={newsKey}
                onChange={(e) => setNewsKey(e.target.value)}
                placeholder={existing.news ? "••••••••••••••" : "Your GNews API key"}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-purple-500/50 transition-colors"
              />
              <a
                href="https://gnews.io/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1.5 transition-colors"
              >
                Get a free key from gnews.io
                <ExternalLink size={10} />
              </a>
            </div>

            {/* Info */}
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 mb-6">
              <p className="text-xs text-gray-400 leading-relaxed">
                Keys are stored in your browser&apos;s localStorage only.
                Without keys the site still works using demo data. You can also
                set <code className="text-purple-300">NEXT_PUBLIC_YOUTUBE_API_KEY</code> and{" "}
                <code className="text-purple-300">NEXT_PUBLIC_GNEWS_API_KEY</code> as
                environment variables.
              </p>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!youtubeKey.trim() && !newsKey.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saved ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                "Save & Reload"
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
