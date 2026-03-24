"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";


export default function TaskAdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', teacher: '', grade: '', class: '', limit: '', created_at: '' });
  const [addForm, setAddForm] = useState({
    title: '',
    content: '',
    teacher: '',
    grade: '',
    class: '',
    limit: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const router = useRouter();

  const { user: authUser, profile: authProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    setUser(authUser);
    const adminOrOp = authProfile?.role === 'admin' || authProfile?.role === 'operator';
    setIsAdmin(adminOrOp);
    if (authProfile?.name) {
      setAddForm(f => ({ ...f, teacher: authProfile.name }));
    }
    if (!adminOrOp) {
      router.replace('/main/home');
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setTasks(data || []);
      setLoading(false);
    })();
  }, [authUser, authProfile, authLoading, router]);

  if (loading) return <div style={{padding:'2rem',textAlign:'center'}}>読み込み中...</div>;
  if (error) return <div style={{padding:'2rem',color:'#b00'}}>データ取得エラー: {error}</div>;

  // フィルタ
  let filtered = tasks;
  if (selectedGrades.length > 0) {
    filtered = filtered.filter(t => selectedGrades.includes(t.grade));
  }
  if (selectedClasses.length > 0) {
    filtered = filtered.filter(t => selectedClasses.includes(t.class));
  }
  // 学年・クラスごとにグループ化
  const grouped = {};
  for (const task of filtered) {
    if (!grouped[task.grade]) grouped[task.grade] = {};
    if (!grouped[task.grade][task.class]) grouped[task.grade][task.class] = [];
    grouped[task.grade][task.class].push(task);
  }

  const handleEditClick = (task) => {
    setEditId(task.id);
    setEditForm({
      title: task.title,
      content: task.content,
      teacher: task.teacher,
      grade: task.grade,
      class: task.class,
      limit: task.limit ? task.limit.slice(0, 10) : '',
      created_at: task.created_at
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = async (task) => {
    const { error } = await supabase
      .from('task')
      .update({
        title: editForm.title,
        content: editForm.content,
        teacher: editForm.teacher,
        grade: editForm.grade,
        class: editForm.class,
        limit: editForm.limit ? new Date(editForm.limit).toISOString() : null
      })
      .eq('id', task.id);
    if (!error) {
      setEditId(null);
      // 最新データ取得
      const { data } = await supabase
        .from('task')
        .select('*')
        .order('created_at', { ascending: false });
      setTasks(data || []);
    }
  };
  const handleEditCancel = () => {
    setEditId(null);
  };

  // 削除ハンドラ
  const handleDelete = async (task) => {
    if (!window.confirm('本当に削除しますか？')) return;
    setDeleteLoading(true);
    const { error } = await supabase
      .from('task')
      .delete()
      .eq('id', task.id);
    setDeleteLoading(false);
    if (error) {
      alert('削除に失敗しました');
      return;
    }
    setEditId(null);
    // 最新データ取得
    const { data } = await supabase
      .from('task')
      .select('*')
      .order('created_at', { ascending: false });
    setTasks(data || []);
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
  // 追加フォームハンドラ
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.title || !addForm.grade || !addForm.class || !addForm.content) {
      alert('タイトル・内容・学年・クラスは必須です');
      return;
    }
    setAddLoading(true);
    const { error } = await supabase.from('task').insert({
      title: addForm.title,
      content: addForm.content,
      teacher: addForm.teacher,
      grade: addForm.grade,
      class: addForm.class,
      limit: addForm.limit ? new Date(addForm.limit).toISOString() : null
    });
    setAddLoading(false);
    if (error) {
      alert('追加に失敗しました');
      return;
    }
    setAddForm({ title: '', content: '', teacher: addForm.teacher, grade: '', class: '', limit: '' });
    // 最新データ取得
    const { data } = await supabase
      .from('task')
      .select('*')
      .order('created_at', { ascending: false });
    setTasks(data || []);
  };

  return (
    <>
      <div style={{ height: 32 }} />
      <div style={{maxWidth:900,margin:'40px auto',background:'#fff',borderRadius:8,boxShadow:'0 2px 8px #eee',padding:24}}>
      <div style={{marginBottom:16}}>
        <Link href="/main/task">
          <button style={{padding:'6px 18px',borderRadius:6,border:'none',background:'#234',color:'#fff',fontWeight:600,cursor:'pointer'}}>一覧に戻る</button>
        </Link>
      </div>
      <h2 style={{textAlign:'center',marginBottom:24}}>課題管理（管理者・教員専用）</h2>
      {/* フィルタ */}
      <div style={{display:'flex',gap:16,marginBottom:24}}>
        <select multiple value={selectedGrades} onChange={e => setSelectedGrades(Array.from(e.target.selectedOptions, o => o.value))} style={{padding:6,borderRadius:4,border:'1px solid #ccc'}}>
          <option value="">学年で絞り込み</option>
          {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select multiple value={selectedClasses} onChange={e => setSelectedClasses(Array.from(e.target.selectedOptions, o => o.value))} style={{padding:6,borderRadius:4,border:'1px solid #ccc'}}>
          <option value="">クラスで絞り込み</option>
          {classOptions.map(c => <option key={c} value={c}>{c}組</option>)}
        </select>
      </div>
      {/* 課題作成フォーム */}
      <form onSubmit={handleAddSubmit} style={{margin:'0 auto 32px auto',maxWidth:600,background:'#f8fafc',borderRadius:8,padding:20,boxShadow:'0 1px 4px #0001'}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:10}}>
          <input
            type="text"
            name="title"
            value={addForm.title}
            onChange={handleAddChange}
            placeholder="タイトル"
            style={{flex:'1 1 120px',padding:6,borderRadius:4,border:'1px solid #ccc'}}
          />
          <input
            type="text"
            name="teacher"
            value={addForm.teacher}
            onChange={handleAddChange}
            placeholder="担当教師"
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
          <div style={{display:'flex',alignItems:'center',gap:4,flex:'1 1 180px'}}>
            <label htmlFor="add-limit" style={{fontWeight:500,color:'#1976d2',marginRight:4}}>期限</label>
            <input
              id="add-limit"
              type="date"
              name="limit"
              value={addForm.limit}
              onChange={handleAddChange}
              style={{padding:6,borderRadius:4,border:'1px solid #1976d2',background:'#f0f7ff',minWidth:120}}
            />
            <span style={{fontSize:'1.2em',color:'#1976d2',marginLeft:2}} title="カレンダー">📅</span>
          </div>
        </div>
        <textarea
          name="content"
          value={addForm.content}
          onChange={handleAddChange}
          placeholder="内容"
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
              {Object.entries(classes).sort().map(([className, tasks]) => (
                <div key={className} style={{flex:'1 1 320px',minWidth:260,maxWidth:400,background:'#f8fafc',borderRadius:10,boxShadow:'0 2px 8px #0001',padding:'1.2em 1em',marginBottom:'1em'}}>
                  <div style={{fontWeight:600,fontSize:'1.1em',marginBottom:'0.3em',color:'#234'}}>クラス: {className}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.7em'}}>
                    {tasks.map(task => (
                      <div key={task.id} style={{borderTop:'1px solid #eee',paddingTop:'0.7em',marginBottom:'0.7em'}}>
                        {editId === task.id ? (
                          <div>
                            <input
                              type="text"
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc'}}
                              placeholder="タイトル"
                            />
                            <input
                              type="text"
                              name="teacher"
                              value={editForm.teacher}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc'}}
                              placeholder="担当教師"
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
                            <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:6}}>
                              <label htmlFor={`edit-limit-${task.id}`} style={{fontWeight:500,color:'#1976d2',marginRight:4}}>期限</label>
                              <input
                                id={`edit-limit-${task.id}`}
                                type="date"
                                name="limit"
                                value={editForm.limit}
                                onChange={handleEditChange}
                                style={{padding:4,borderRadius:4,border:'1px solid #1976d2',background:'#f0f7ff',minWidth:120}}
                              />
                              <span style={{fontSize:'1.2em',color:'#1976d2',marginLeft:2}} title="カレンダー">📅</span>
                            </div>
                            <textarea
                              name="content"
                              value={editForm.content}
                              onChange={handleEditChange}
                              style={{width:'90%',marginBottom:6,padding:4,borderRadius:4,border:'1px solid #ccc',minHeight:40}}
                              placeholder="内容"
                            />
                            <div style={{marginTop:4,display:'flex',gap:8}}>
                              <button onClick={() => handleEditSave(task)} style={{padding:'4px 16px',borderRadius:4,border:'none',background:'#1976d2',color:'#fff',fontWeight:600}}>保存</button>
                              <button onClick={handleEditCancel} style={{padding:'4px 16px',borderRadius:4,border:'none',background:'#888',color:'#fff'}}>キャンセル</button>
                              <button onClick={() => handleDelete(task)} disabled={deleteLoading} style={{padding:'4px 16px',borderRadius:4,border:'none',background:'#b00',color:'#fff',fontWeight:600}}>
                                {deleteLoading ? '削除中...' : '削除'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{fontWeight:700,fontSize:'1.1em',color:'#1a3a7c'}}>{task.title} <span style={{fontWeight:400,fontSize:'0.95em',color:'#888'}}>（{task.teacher}）</span></div>
                            <div style={{fontSize:'0.97em',color:'#555',margin:'0.2em 0 0.3em 0', whiteSpace:'pre-wrap'}}>内容: {task.content}</div>
                            <div style={{fontSize:'0.95em',color:task.limit ? '#1976d2' : '#b00',fontWeight:task.limit ? 600 : 400,display:'flex',alignItems:'center',gap:4}}>
                              <span>期限:</span>
                              {task.limit ? (
                                <span style={{background:'#e3f2fd',padding:'2px 8px',borderRadius:6}}>{new Date(task.limit).toLocaleDateString()}</span>
                              ) : (
                                <span style={{color:'#b00'}}>未設定</span>
                              )}
                            </div>
                            <button onClick={() => handleEditClick(task)} style={{marginTop:4,padding:'4px 16px',borderRadius:4,border:'none',background:'#1976d2',color:'#fff',fontWeight:600}}>編集</button>
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
      <Footer />
      </div>
    </>
  );
}