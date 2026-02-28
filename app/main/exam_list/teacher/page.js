"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";


export default function ExamAdminPage() {
  // useState, useEffectは必ず関数の先頭で宣言
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ subject: '', exam: '', content: '' });
  // 追加フォームstate（useStateはここで宣言）
  const [addForm, setAddForm] = useState({
    subject: '',
    grade: '',
    class: '',
    exam: '',
    content: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // 認証ユーザー取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(user);
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
      if (!admin) {
        router.replace('/main/home');
        return;
      }
      // データ取得
      const { data, error } = await supabase
        .from('exam')
        .select('*')
        .order('created_at', { ascending: false });
      if (!isMounted) return;
      if (error) setError(error.message);
      else setExams(data || []);
      setLoading(false);
    })();
    return () => { isMounted = false; };
  }, [router]);

  if (loading) return <div style={{padding:'2rem',textAlign:'center'}}>読み込み中...</div>;
  if (error) return <div style={{padding:'2rem',color:'#b00'}}>データ取得エラー: {error}</div>;

  // 学年・クラスごとにグループ化
  const grouped = {};
  for (const exam of exams) {
    if (!grouped[exam.grade]) grouped[exam.grade] = {};
    if (!grouped[exam.grade][exam.class]) grouped[exam.grade][exam.class] = [];
    grouped[exam.grade][exam.class].push(exam);
  }

  const handleEditClick = (exam) => {
    setEditId(exam.id);
    setEditForm({ subject: exam.subject, exam: exam.exam, content: exam.content, class: exam.class });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = async (exam) => {
    const { error } = await supabase
      .from('exam')
      .update({ subject: editForm.subject, exam: editForm.exam, content: editForm.content, class: editForm.class })
      .eq('id', exam.id);
    if (!error) {
      setEditId(null);
      // 最新データ取得
      const { data } = await supabase
        .from('exam')
        .select('*')
        .order('created_at', { ascending: false });
      setExams(data || []);
    }
  };
  const handleEditCancel = () => {
    setEditId(null);
  };

  // 削除ハンドラ
  const handleDelete = async (exam) => {
    if (!window.confirm('本当に削除しますか？')) return;
    setDeleteLoading(true);
    const { error } = await supabase
      .from('exam')
      .delete()
      .eq('id', exam.id);
    setDeleteLoading(false);
    if (error) {
      alert('削除に失敗しました');
      return;
    }
    setEditId(null);
    // 最新データ取得
    const { data } = await supabase
      .from('exam')
      .select('*')
      .order('created_at', { ascending: false });
    setExams(data || []);
  };

  // 選択肢は定数として宣言
  const gradeOptions = [
    '中学1年生', '中学2年生', '中学3年生',
    '高校1年生', '高校2年生', '高校3年生',
  ];
  const classOptions = [
    ...['A','B','C','D','E'],
    ...Array.from({length:10},(_,i)=>(i+1).toString())
  ];
  const examOptions = [
    '1学期中間試験','1学期期末試験','2学期中間試験','2学期期末試験','学年末試験','その他'
  ];
  // 追加フォームハンドラ
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.subject || !addForm.grade || !addForm.class || !addForm.exam || !addForm.content) {
      alert('全ての項目を入力してください');
      return;
    }
    setAddLoading(true);
    const { error } = await supabase.from('exam').insert({
      subject: addForm.subject,
      grade: addForm.grade,
      class: addForm.class,
      exam: addForm.exam,
      content: addForm.content
    });
    setAddLoading(false);
    if (error) {
      alert('追加に失敗しました');
      return;
    }
    setAddForm({ subject: '', grade: '', class: '', exam: '', content: '' });
    // 最新データ取得
    const { data } = await supabase
      .from('exam')
      .select('*')
      .order('created_at', { ascending: false });
    setExams(data || []);
  };

  return (
    <>
      <HeaderSwitcher />
      <div style={{ height: 32 }} />
      <div style={{maxWidth:900,margin:'40px auto',background:'#fff',borderRadius:8,boxShadow:'0 2px 8px #eee',padding:24}}>
      <div style={{marginBottom:16}}>
        <Link href="/main/exam_list">
          <button style={{padding:'6px 18px',borderRadius:6,border:'none',background:'#234',color:'#fff',fontWeight:600,cursor:'pointer'}}>一覧に戻る</button>
        </Link>
      </div>
      <h2 style={{textAlign:'center',marginBottom:24}}>試験範囲管理（管理者専用）</h2>
      {/* 試験範囲作成フォーム */}
      <form onSubmit={handleAddSubmit} style={{margin:'0 auto 32px auto',maxWidth:600,background:'#f8fafc',borderRadius:8,padding:20,boxShadow:'0 1px 4px #0001'}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:10}}>
          <input
            type="text"
            name="subject"
            value={addForm.subject}
            onChange={handleAddChange}
            placeholder="教科"
            style={{flex:'1 1 120px',padding:6,borderRadius:4,border:'1px solid #ccc'}}
          />
          <select name="grade" value={addForm.grade} onChange={handleAddChange} style={{flex:'1 1 120px',padding:6,borderRadius:4,border:'1px solid #ccc'}}>
            <option value="">学年を選択</option>
            {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select name="class" value={addForm.class} onChange={handleAddChange} style={{flex:'1 1 120px',padding:6,borderRadius:4,border:'1px solid #ccc'}}>
            <option value="">クラスを選択</option>
            <optgroup label="A~E組">
              {['A','B','C','D','E'].map(c => <option key={c} value={c}>{c}組</option>)}
            </optgroup>
            <optgroup label="1~10組">
              {Array.from({length:10},(_,i)=>(i+1)).map(n => <option key={n} value={n}>{n}組</option>)}
            </optgroup>
          </select>
          <select name="exam" value={addForm.exam} onChange={handleAddChange} style={{flex:'1 1 160px',padding:6,borderRadius:4,border:'1px solid #ccc'}}>
            <option value="">試験期間を選択</option>
            {examOptions.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <textarea
          name="content"
          value={addForm.content}
          onChange={handleAddChange}
          placeholder="範囲"
          style={{width:'100%',padding:8,borderRadius:4,border:'1px solid #ccc',minHeight:40,marginBottom:10}}
        />
        <button type="submit" disabled={addLoading} style={{padding:'8px 24px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,fontSize:16,cursor:'pointer'}}>
          {addLoading ? '追加中...' : '追加'}
        </button>
      </form>
      <section>
        {Object.keys(grouped).length === 0 && (
          <div style={{textAlign:'center',color:'#888',margin:'3rem 0'}}>データがありません</div>
        )}
        {Object.entries(grouped).sort().map(([grade, classes]) => (
          <div key={grade} style={{marginBottom:'2.5rem'}}>
            <h3 style={{fontSize:'1.2rem',color:'#234',marginBottom:'0.5em',borderLeft:'4px solid #234',paddingLeft:'0.5em'}}>{grade}</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1.5rem'}}>
              {Object.entries(classes).sort().map(([className, exams]) => (
                <div key={className} style={{flex:'1 1 320px',minWidth:260,maxWidth:400,background:'#f8fafc',borderRadius:10,boxShadow:'0 2px 8px #0001',padding:'1.2em 1em',marginBottom:'1em'}}>
                  <div style={{fontWeight:600,fontSize:'1.1em',marginBottom:'0.3em',color:'#234'}}>クラス: {className}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.7em'}}>
                    {exams.map(exam => (
                      <div key={exam.id} style={{borderTop:'1px solid #eee',paddingTop:'0.7em',marginBottom:'0.7em'}}>
                        {editId === exam.id ? (
                          <div>
                            <input
                              type="text"
                              name="subject"
                              value={editForm.subject}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc'}}
                              placeholder="教科"
                            />
                            <input
                              type="text"
                              name="exam"
                              value={editForm.exam}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc'}}
                              placeholder="試験名"
                            />
                            <select
                              name="class"
                              value={editForm.class}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc'}}
                            >
                              <option value="">クラスを選択</option>
                              <optgroup label="A~E組">
                                {['A','B','C','D','E'].map(c => <option key={c} value={c}>{c}組</option>)}
                              </optgroup>
                              <optgroup label="1~10組">
                                {Array.from({length:10},(_,i)=>(i+1)).map(n => <option key={n} value={n}>{n}組</option>)}
                              </optgroup>
                            </select>
                            <textarea
                              name="content"
                              value={editForm.content}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc',minHeight:40}}
                              placeholder="範囲"
                            />
                            <div style={{marginTop:4,display:'flex',gap:8}}>
                              <button onClick={() => handleEditSave(exam)} style={{padding:'4px 16px',borderRadius:4,border:'none',background:'#1976d2',color:'#fff',fontWeight:600}}>保存</button>
                              <button onClick={handleEditCancel} style={{padding:'4px 16px',borderRadius:4,border:'none',background:'#888',color:'#fff'}}>キャンセル</button>
                              <button onClick={() => handleDelete(exam)} disabled={deleteLoading} style={{padding:'4px 16px',borderRadius:4,border:'none',background:'#b00',color:'#fff',fontWeight:600}}>
                                {deleteLoading ? '削除中...' : '削除'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{fontWeight:700,fontSize:'1.1em',color:'#1a3a7c'}}>{exam.subject} <span style={{fontWeight:400,fontSize:'0.95em',color:'#888'}}>（{exam.exam}）</span></div>
                            <div style={{fontSize:'0.97em',color:'#555',margin:'0.2em 0 0.3em 0', whiteSpace:'pre-wrap'}}>範囲: {exam.content}</div>
                            <button onClick={() => handleEditClick(exam)} style={{marginTop:4,padding:'4px 16px',borderRadius:4,border:'none',background:'#1976d2',color:'#fff',fontWeight:600}}>編集</button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      </div>
    </>
  );
}