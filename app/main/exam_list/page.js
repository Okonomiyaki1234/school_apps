


"use client";
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
const GradeFilter = dynamic(() => import('./GradeFilter.js'), { ssr: false });
const ClassFilter = dynamic(() => import('./ClassFilter.js'), { ssr: false });

export default function ExamListPage() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const gradeOptions = [
    '中学1年生', '中学2年生', '中学3年生',
    '高校1年生', '高校2年生', '高校3年生',
  ];

  useEffect(() => {
    (async () => {
      // 認証ユーザー取得
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let admin = false;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        admin = profile?.role === 'admin';
      }
      setIsAdmin(admin);

      // 全件取得
      const { data, error } = await supabase
        .from('exam')
        .select('*');
      if (error) setError(error.message);
      else setExams(data || []);
    })();
  }, []);

  // クラス一覧を取得
  const classOptions = Array.from(new Set(exams.map(e => e.class))).filter(Boolean);

  // クライアントサイドでフィルタリング
  let filtered = exams;
  if (selectedGrades.length > 0) {
    filtered = filtered.filter(e => selectedGrades.includes(e.grade));
  }
  if (selectedClasses.length > 0) {
    filtered = filtered.filter(e => selectedClasses.includes(e.class));
  }

  // 学年・クラスごとにグループ化
  const grouped = {};
  for (const exam of filtered) {
    if (!grouped[exam.grade]) grouped[exam.grade] = {};
    if (!grouped[exam.grade][exam.class]) grouped[exam.grade][exam.class] = [];
    grouped[exam.grade][exam.class].push(exam);
  }

  if (error) return <div style={{padding:'2rem',color:'#b00'}}>データ取得エラー: {error}</div>;

  return (
    <>
      <HeaderSwitcher />
      <div style={{ height: 32 }} />
      <main style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
      }}>
      <header style={{marginBottom:'2rem'}}>
        <h1 style={{fontSize:'2rem',fontWeight:700,marginBottom:'0.5rem',color:'#234'}}>試験範囲一覧</h1>
        <p style={{color:'#555',marginBottom:'1.5rem'}}>学年・クラスごとに試験範囲を確認できます。</p>
        <GradeFilter gradeOptions={gradeOptions} selectedGrade={selectedGrades.join(',')} onChange={setSelectedGrades} />
        <ClassFilter classOptions={classOptions} selectedClass={selectedClasses.join(',')} onChange={setSelectedClasses} />
        {isAdmin && (
          <div style={{ marginTop: '1rem' }}>
            <Link href="/main/exam_list/teacher">
              <button type="button" style={{
                background:'#234',color:'#fff',border:'none',borderRadius:6,padding:'0.5em 1.2em',fontWeight:600,cursor:'pointer',fontSize:'1rem',boxShadow:'0 1px 4px #0001'
              }}>教師用ページへ</button>
            </Link>
          </div>
        )}
      </header>
      <section>
        {Object.keys(grouped).length === 0 && (
          <div style={{textAlign:'center',color:'#888',margin:'3rem 0'}}>該当する試験範囲はありません</div>
        )}
        {Object.entries(grouped).sort().map(([grade, classes]) => (
          <div key={grade} style={{marginBottom:'2.5rem'}}>
            <h2 style={{fontSize:'1.3rem',color:'#234',marginBottom:'0.5em',borderLeft:'4px solid #234',paddingLeft:'0.5em'}}>{grade}</h2>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1.5rem'}}>
              {Object.entries(classes).sort().map(([className, exams]) => (
                <div key={className} style={{flex:'1 1 320px',minWidth:260,maxWidth:400,background:'#fff',borderRadius:10,boxShadow:'0 2px 8px #0001',padding:'1.2em 1em',marginBottom:'1em'}}>
                  <div style={{fontWeight:600,fontSize:'1.1em',marginBottom:'0.3em',color:'#234'}}>クラス: {className}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.7em'}}>
                    {exams.map(exam => (
                      <div key={exam.id} style={{borderTop:'1px solid #eee',paddingTop:'0.7em'}}>
                        <div style={{fontWeight:700,fontSize:'1.1em',color:'#1a3a7c'}}>{exam.subject} <span style={{fontWeight:400,fontSize:'0.95em',color:'#888'}}>（{exam.exam}）</span></div>
                        <div style={{fontSize:'0.97em',color:'#555',margin:'0.2em 0 0.3em 0'}}>範囲: {exam.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <style>{`
        @media (max-width: 700px) {
          main { padding: 1rem 0.2rem; }
          h1 { font-size: 1.3rem; }
          h2 { font-size: 1.05rem; }
          section > div { margin-bottom: 1.2rem; }
        }
        @media (max-width: 500px) {
          .exam-card { min-width: 90vw; max-width: 98vw; }
        }
      `}</style>
      </main>
    </>
  );
}
