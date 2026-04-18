"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import styles from './QuestionPage.module.css';

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userIcons, setUserIcons] = useState({});
  const [userRoles, setUserRoles] = useState({});

  useEffect(() => {
    supabase.from('questions').select('*').then(({ data }) => {
      setQuestions(data || []);
    });
    supabase.from('answers').select('*').then(({ data }) => {
      setAnswers(data || []);
    });
  }, []);

  useEffect(() => {
    // 全ユーザーのユーザー名・アイコン・role・isParentを取得
    const fetchNames = async () => {
      const { data } = await supabase.from('profiles').select('id, name, icon, role, isParent');
      const nameMap = {};
      const iconMap = {};
      const roleMap = {};
      const isParentMap = {};
      data?.forEach(u => {
        nameMap[u.id] = u.name;
        iconMap[u.id] = u.icon;
        roleMap[u.id] = u.role;
        isParentMap[u.id] = u.isParent;
      });
      setUserNames(nameMap);
      setUserIcons(iconMap);
      setUserRoles({ role: roleMap, isParent: isParentMap });
    };
    fetchNames();
  }, []);
  // roleラベル判定（isParent対応）
  const getRoleLabel = (role, isParent = false) => {
    if (!role) return '';
    if (role === 'user') return '不法者';
    if (role === 'student' && isParent) return '保護者';
    if (role === 'student' || role === 'council') return '生徒';
    if (role === 'admin') return '教員';
    if (role === 'operator') return '運営';
    return '';
  };

  const getAnswersForQuestion = (questionId) => {
    return answers.filter(a => a.question_id === questionId);
  };

  return (
    <div className={styles['question-page-container']}>
      <h1>質問ページ</h1>
      <a href="/main/question/new" style={{display:'inline-block',marginBottom:'24px',padding:'10px 20px',background:'#1976d2',color:'#fff',borderRadius:'8px',textDecoration:'none'}}>新規質問投稿</a>
      {questions.map(q => (
        <div
          key={q.id}
          className={styles['question-card']}
          style={{cursor:'pointer',transition:'box-shadow 0.2s'}}
          onClick={() => window.location.href = `/main/question/answer/${q.id}`}
        >
          <div className={styles['question-title']}>{q.title}</div>
          <div className={styles['question-content']}>{q.content}</div>
          {/* 質問者情報は匿名化のため非表示 */}
          <div className={styles['answer-list']}>
            {getAnswersForQuestion(q.id).map(a => (
              <div className={styles['answer-card']} key={a.id}>
                {a.content}
                <div className={styles['answer-user']}>
                  <a href={`/main/my_page/${a.user_id}`} style={{textDecoration:'none'}} onClick={e => e.stopPropagation()}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f5f7fa',borderRadius:'8px',padding:'6px 12px',margin:'8px 0',boxShadow:'0 1px 4px #0001',cursor:'pointer',transition:'box-shadow 0.2s'}}>
                      <img src={userIcons[a.user_id] || '/icons/default.png'} alt="icon" style={{width:'28px',height:'28px',borderRadius:'50%',border:'1px solid #bcd',objectFit:'cover'}} />
                      <span style={{fontWeight:'bold',fontSize:'1rem',color:'#222'}}>
                        {userNames[a.user_id] ? userNames[a.user_id] : (userNames[a.user_id] === '' ? '未登録' : '未登録')}
                      </span>
                      {getRoleLabel(userRoles.role?.[a.user_id], userRoles.isParent?.[a.user_id]) && (
                        <span style={{marginLeft:'6px',fontSize:'0.95rem',color:'#222',fontWeight:'bold',background:'#e3f2fd',borderRadius:'4px',padding:'2px 8px'}}>
                          {getRoleLabel(userRoles.role?.[a.user_id], userRoles.isParent?.[a.user_id])}
                        </span>
                      )}
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionPage;
