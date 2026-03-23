"use client";
import React, { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import Footer from "@/components/Footer";
import styles from '../QuestionPage.module.css';

const QuestionNewPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ログインユーザーID取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("ログインしてください。");
      return;
    }
    const { error } = await supabase.from('questions').insert([
      { title, content, user_id: user.id }
    ]);
    if (error) {
      setMessage("投稿に失敗しました: " + error.message);
    } else {
      setMessage("質問を投稿しました！");
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className={styles['question-page-container']}>
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:'28px',
      }}>
        <span style={{
          fontSize:'2rem',
          fontWeight:'bold',
          color:'#222',
          letterSpacing:'0.04em',
          marginRight:'12px',
        }}>新規質問投稿</span>
      </div>
      <div style={{textAlign:'center',marginBottom:'18px'}}>
        <a href="/main/question" style={{
          display:'inline-block',
          padding:'8px 20px',
          background:'#1976d2',
          color:'#fff',
          borderRadius:'8px',
          textDecoration:'none',
          fontWeight:'bold',
          fontSize:'1rem',
          boxShadow:'0 2px 8px rgba(25,118,210,0.12)'
        }}>質問一覧へ戻る</a>
      </div>
      <div className={styles['question-card']} style={{maxWidth:'520px',margin:'0 auto'}}>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'18px'}}>
            <label htmlFor="title" style={{fontWeight:'bold',fontSize:'1rem'}}>タイトル</label><br />
            <input id="title" value={title} onChange={e => setTitle(e.target.value)} required 
              style={{width:'100%',marginTop:'6px',marginBottom:'8px',padding:'10px',fontSize:'1rem',border:'1px solid #ddd',borderRadius:'6px'}} 
              placeholder="例: 学校イベントについて質問があります" />
          </div>
          <div style={{marginBottom:'18px'}}>
            <label htmlFor="content" style={{fontWeight:'bold',fontSize:'1rem'}}>内容</label><br />
            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required 
              style={{width:'100%',marginTop:'6px',padding:'10px',fontSize:'1rem',border:'1px solid #ddd',borderRadius:'6px',minHeight:'120px'}} 
              placeholder="質問内容を詳しく記入してください" />
          </div>
          <button type="submit" style={{padding:'12px 32px',borderRadius:'8px',background:'#1976d2',color:'#fff',border:'none',fontWeight:'bold',fontSize:'1rem',boxShadow:'0 2px 8px rgba(25,118,210,0.12)'}}>投稿</button>
        </form>
        {message && <div style={{marginTop:'20px',padding:'12px',background:'#e3f2fd',color:'#1976d2',borderRadius:'6px',textAlign:'center',fontWeight:'bold'}}>{message}</div>}
      </div>
      <Footer />
    </div>
  );
};

export default QuestionNewPage;
