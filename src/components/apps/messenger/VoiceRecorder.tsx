"use client";

import { useState, useRef } from 'react';
import { Mic, Square, Trash2, Send } from 'lucide-react';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onSend: (url: string) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
    setDuration(0);
    timerInterval.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    if (timerInterval.current) clearInterval(timerInterval.current);
    setIsRecording(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!audioChunks.current.length || !auth.currentUser) return;
    
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const storageRef = ref(storage, `voice/${auth.currentUser.uid}/${Date.now()}.webm`);
    
    await uploadBytes(storageRef, audioBlob);
    const url = await getDownloadURL(storageRef);
    onSend(url);
    setAudioUrl(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 pr-4 flex-1"
    >
      <div className="flex items-center gap-3 flex-1 px-4">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-white/60">{formatDuration(duration)}</span>
          </div>
        ) : audioUrl ? (
          <span className="text-xs font-medium text-white/40">Voice message recorded</span>
        ) : (
          <span className="text-xs font-medium text-white/20">Recording...</span>
        )}
        
        {isRecording && (
          <div className="flex-1 h-8 flex items-center justify-center gap-0.5">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [8, 16, 24, 12, 8] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                className="w-1 bg-white/20 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onCancel}
          className="p-2 rounded-xl text-white/20 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        {isRecording ? (
          <button 
            onClick={stopRecording}
            className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg"
          >
            <Square className="w-4 h-4 text-white" fill="white" />
          </button>
        ) : audioUrl ? (
          <button 
            onClick={handleSend}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        ) : (
          <button 
            onClick={startRecording}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
          >
            <Mic className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
