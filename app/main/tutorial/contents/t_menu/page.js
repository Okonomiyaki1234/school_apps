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

export default function MenuTutorial() {
  return (
    <div style={{ padding: '2.5rem', paddingTop: '4.5rem', maxWidth: '900px', margin: '0 auto', lineHeight: 2.0 }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <Link href="/main/tutorial" style={{ display: 'inline-block', background: '#e0e0e0', color: '#333', borderRadius: '8px', padding: '0.5rem 1.2rem', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 3px #eee', transition: 'background 0.2s' }}>← チュートリアルトップへ戻る</Link>
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.4 }}>食堂メニュー機能の使い方</h1>
      <section style={{ marginBottom: '2.5rem', background: cardColor, borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px #eee', lineHeight: 2.0 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>概要</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: 2.0 }}>
          このページでは、学校食堂のメニューをカテゴリごとに一覧表示します。<br />
          メニューは「メイン系」「弁当メイン系」「軽食」「夜間」「その他」の5つのカテゴリに分かれています。<br />
          各カテゴリごとに料理名と価格が見やすく表示され、該当メニューがない場合は「該当なし」と表示されます。
        </p>
      </section>
      <section style={{ marginBottom: '2.5rem', background: cardColor, borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px #eee', lineHeight: 2.0 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>主なUI構成</h2>
        <ul style={{ fontSize: '1.08rem', lineHeight: 2.0, paddingLeft: '1.2rem' }}>
          <li><b>カテゴリカード</b>：各カテゴリごとにカード型で区切られ、料理名と価格が一覧で表示されます。</li>
          <li><b>読み込み・エラー表示</b>：データ取得中やエラー時には、中央にメッセージが表示されます。</li>
          <li><b>将来機能</b>：モバイルオーダー機能など、今後の拡張もあるかも？（望み薄）</li>
        </ul>
      </section>
      <section style={{ background: cardColor, borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px #eee', lineHeight: 2.0 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5 }}>画面イメージ例</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.7rem', textAlign: 'center', fontWeight: 600, lineHeight: 1.5 }}>メイン系</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', lineHeight: 2.0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.7rem 1.1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', lineHeight: 2.0 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>カレーライス</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>350円</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.7rem 1.1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', lineHeight: 2.0 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>ラーメン</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>400円</span>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.7rem', textAlign: 'center', fontWeight: 600, lineHeight: 1.5 }}>軽食</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', lineHeight: 2.0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.7rem 1.1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', lineHeight: 2.0 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>サンドイッチ</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 2.0 }}>250円</span>
              </div>
            </div>
          </div>
        </div>
        <p style={{ color: '#888', marginTop: '1.5rem', textAlign: 'center', lineHeight: 2.0 }}>※実際のメニューは日によって異なる可能性もあります。</p>
      </section>
    </div>
  );
}
