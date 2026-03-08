import React from 'react';
import Link from 'next/link';

const cardColor = '#f6f8fa';
const cardStyle = {
  background: cardColor,
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  minWidth: '240px',
  maxWidth: '340px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  padding: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
};

export default function ExamListTutorial() {
  return (
    <div style={{ padding: '2.5rem', paddingTop: '4.5rem', maxWidth: '900px', margin: '0 auto', lineHeight: 2.0 }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <Link href="/main/tutorial" style={{ display: 'inline-block', background: '#e0e0e0', color: '#333', borderRadius: '8px', padding: '0.5rem 1.2rem', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 3px #eee', transition: 'background 0.2s' }}>← チュートリアルトップへ戻る</Link>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.4 }}>試験範囲機能の使い方</h1>
      <section style={{ marginBottom: '2.5rem', background: cardColor, borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px #eee', lineHeight: 2.0 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>概要</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: 2.0 }}>
          試験範囲機能では、各教科ごとの試験範囲や担当教師を一覧で確認できます。<br />
          学年やクラスごとに絞り込みも可能で、効率よく情報を把握できます。
        </p>
      </section>
      <section style={{ marginBottom: '2.5rem', background: cardColor, borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px #eee', lineHeight: 2.0 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>主なUI構成</h2>
        <ul style={{ fontSize: '1.08rem', lineHeight: 2.0, paddingLeft: '1.2rem' }}>
          <li><b>試験範囲リスト</b>：教科ごとに範囲や担当教師が一覧で表示されます。</li>
          <li><b>絞り込み</b>：学年やクラスで絞り込みができます。</li>
          <li><b>詳細表示</b>：試験範囲をクリックすると詳細が表示されます。</li>
        </ul>
      </section>
      <section style={{ background: cardColor, borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px #eee', lineHeight: 2.0 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>画面イメージ例</h2>
        <div style={{ ...cardStyle, maxWidth: '500px', minWidth: '320px', padding: '2rem', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.7rem', textAlign: 'center', fontWeight: 600, lineHeight: 1.5 }}>試験範囲例</h3>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '1rem', lineHeight: 2.0 }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>教科：数学<br />範囲：教科書p.10〜p.30</span>
          </div>
        </div>
        <p style={{ color: '#888', marginTop: '1.5rem', textAlign: 'center', lineHeight: 2.0 }}>※試験範囲は学年・クラスごとに異なります。</p>
      </section>
    </div>
  );
}
