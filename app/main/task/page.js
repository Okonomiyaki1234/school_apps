
"use client";

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Link from 'next/link';


export default function TaskListPage() {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userGrade, setUserGrade] = useState("");
  const [userClass, setUserClass] = useState("");
  const [isAdminOrOperator, setIsAdminOrOperator] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const grade = authProfile?.grade || "";
    const className = authProfile?.class || "";
    setUserGrade(grade);
    setUserClass(className);
    const isAdminOp = authProfile?.role === 'admin' || authProfile?.role === 'operator';
    setIsAdminOrOperator(isAdminOp);

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('task')
        .select('*');
      if (error) setError(error.message);
      else {
        const filtered = (data || []).filter(task => task.grade === grade && task.class === className);
        setTasks(filtered);
      }
      setLoading(false);
    })();
  }, [authProfile, authLoading]);

	if (loading) return <div style={{padding:'2rem'}}>読み込み中...</div>;
	if (error) return <div style={{padding:'2rem',color:'#b00'}}>データ取得エラー: {error}</div>;

	return (
		<>
			<div style={{ height: 32 }} />
			<main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
				<h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>課題一覧</h2>
				<div style={{ marginBottom: '1rem', color: '#555' }}>
					{userGrade && userClass ? (
						<>あなたの学年: <b>{userGrade}</b> ／ クラス: <b>{userClass}</b></>
					) : (
						<>学年・クラス情報が取得できません</>
					)}
				</div>
				{isAdminOrOperator && (
					<div style={{ marginBottom: '1.5rem' }}>
						<Link href="/main/task/teacher">
							<button type="button" style={{ background:'#234',color:'#fff',border:'none',borderRadius:6,padding:'0.5em 1.2em',fontWeight:600,cursor:'pointer',fontSize:'1rem',boxShadow:'0 1px 4px #0001' }}>
								課題管理ページへ
							</button>
						</Link>
					</div>
				)}
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr>
							<th style={{ borderBottom: '1px solid #ccc', padding: '0.5em' }}>タイトル</th>
							<th style={{ borderBottom: '1px solid #ccc', padding: '0.5em' }}>内容</th>
							<th style={{ borderBottom: '1px solid #ccc', padding: '0.5em' }}>担当教師</th>
							<th style={{ borderBottom: '1px solid #ccc', padding: '0.5em' }}>出題日</th>
							<th style={{ borderBottom: '1px solid #ccc', padding: '0.5em' }}>期限</th>
						</tr>
					</thead>
					<tbody>
						{tasks.map(task => (
							<tr key={task.id}>
								<td style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>{task.title}</td>
								<td style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>{task.content}</td>
								<td style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>{task.teacher}</td>
								<td style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>{task.created_at ? new Date(task.created_at).toLocaleDateString() : ''}</td>
								<td style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>{task.limit ? new Date(task.limit).toLocaleDateString() : ''}</td>
							</tr>
						))}
					</tbody>
				</table>
			</main>
			<Footer />
		</>
	);
}
