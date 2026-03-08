"use client";
import React, { useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import styles from '../../QuestionPage.module.css';

const AnswerNewPage = ({ params }) => {
  const { id: questionId } = React.use(params);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userIcons, setUserIcons] = useState({});

  React.useEffect(() => {
    if (questionId) {
      supabase.from('questions').select('*').eq('id', questionId).single().then(({ data }) => {
        setQuestion(data);
      });
      supabase.from('answers').select('*').eq('question_id', questionId).then(({ data }) => {
        setAnswers(data || []);
      });
    }
  }, [questionId]);

  React.useEffect(() => {
    // 全ユーザーのユーザー名とアイコンを取得
    const fetchNames = async () => {
      const { data } = await supabase.from('profiles').select('id, name, icon');
      const nameMap = {};
      const iconMap = {};
      data?.forEach(u => {
        nameMap[u.id] = u.name;
        iconMap[u.id] = u.icon;
      });
      setUserNames(nameMap);
      setUserIcons(iconMap);
    };
    fetchNames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("ログインしてください。");
      return;
    }
    const { error } = await supabase.from('answers').insert([
      { content, user_id: user.id, question_id: questionId }
    ]);
    if (error) {
      setMessage("投稿に失敗しました: " + error.message);
    } else {
      setMessage("回答を投稿しました！");
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
        }}>回答投稿</span>
      </div>
      <div style={{textAlign:'center',marginBottom:'18px'}}>
        <a href={`/main/question`} style={{
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
        {question && (
          <div style={{marginBottom:'24px'}}>
            <div className={styles['question-title']}>{question.title}</div>
            <div className={styles['question-content']}>{question.content}</div>
            <div className={styles['question-user']}>
              <a href={`/main/my_page/${question.user_id}`} style={{textDecoration:'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f5f7fa',borderRadius:'8px',padding:'6px 12px',margin:'8px 0',boxShadow:'0 1px 4px #0001',cursor:'pointer',transition:'box-shadow 0.2s'}}>
                  <img src={userIcons[question.user_id] || '/icons/default.png'} alt="icon" style={{width:'28px',height:'28px',borderRadius:'50%',border:'1px solid #bcd',objectFit:'cover'}} />
                  <span style={{fontWeight:'bold',fontSize:'1rem',color:'#222'}}>
                    {userNames[question.user_id] ? userNames[question.user_id] : (userNames[question.user_id] === '' ? '未登録' : '未登録')}
                  </span>
                </div>
              </a>
            </div>
          </div>
        )}
        <div style={{marginBottom:'24px'}}>
          <div style={{fontWeight:'bold',marginBottom:'8px'}}>既存の回答</div>
          {answers.length === 0 ? (
            <div style={{color:'#888',marginBottom:'8px'}}>まだ回答はありません。</div>
          ) : (
            answers.map(a => (
              <div key={a.id} className={styles['answer-card']} style={{marginBottom:'10px'}}>
                {a.content}
                <div className={styles['answer-user']}>
                  <a href={`/main/my_page/${a.user_id}`} style={{textDecoration:'none'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f5f7fa',borderRadius:'8px',padding:'6px 12px',margin:'8px 0',boxShadow:'0 1px 4px #0001',cursor:'pointer',transition:'box-shadow 0.2s'}}>
                      <img src={userIcons[a.user_id] || '/icons/default.png'} alt="icon" style={{width:'28px',height:'28px',borderRadius:'50%',border:'1px solid #bcd',objectFit:'cover'}} />
                      <span style={{fontWeight:'bold',fontSize:'1rem',color:'#222'}}>
                        {userNames[a.user_id] ? userNames[a.user_id] : (userNames[a.user_id] === '' ? '未登録' : '未登録')}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'18px'}}>
            <label htmlFor="content" style={{fontWeight:'bold',fontSize:'1rem'}}>回答内容</label><br />
            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required 
              style={{width:'100%',marginTop:'6px',padding:'10px',fontSize:'1rem',border:'1px solid #ddd',borderRadius:'6px',minHeight:'120px'}} 
              placeholder="回答内容を詳しく記入してください" />
          </div>
          <button type="submit" style={{padding:'12px 32px',borderRadius:'8px',background:'#1976d2',color:'#fff',border:'none',fontWeight:'bold',fontSize:'1rem',boxShadow:'0 2px 8px rgba(25,118,210,0.12)'}}>投稿</button>
        </form>
        {message && <div style={{marginTop:'20px',padding:'12px',background:'#e3f2fd',color:'#1976d2',borderRadius:'6px',textAlign:'center',fontWeight:'bold'}}>{message}</div>}
      </div>
    </div>
  );
};

export default AnswerNewPage;
