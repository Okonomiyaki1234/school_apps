import React from 'react';
import Link from 'next/link';

export default function GoogleChatTutorial() {
	return (
		<div>
			<main style={{ padding: '2rem', paddingTop: '4.5rem', maxWidth: 900, margin: '0 auto' }}>
				<div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
					<Link href="/main/tutorial" style={{ display: 'inline-block', background: '#e0e0e0', color: '#333', borderRadius: '8px', padding: '0.5rem 1.2rem', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 3px #eee', transition: 'background 0.2s' }}>← チュートリアルトップへ戻る</Link>
				</div>
				<h1 style={{ fontSize: 32, marginBottom: 24 }}>Googleチャットの使い方講座</h1>
				<div style={{ background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24, marginBottom: 32 }}>
					<h2 style={{ fontSize: 22, marginBottom: 12 }}>Googleチャットとは？</h2>
					<p style={{ fontSize: 16, color: '#444', marginBottom: 16 }}>
						Googleチャットは、学校のGoogleアカウントで利用できるメッセージアプリです。クラスや部活動、先生との連絡など、様々な場面で活用できます。<br />
						チームやグループでのコミュニケーション、ファイル共有、リアルタイムのやり取りが簡単に行えます。
					</p>
				</div>
				<div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24, marginBottom: 32 }}>
					<h2 style={{ fontSize: 20, marginBottom: 12 }}>学校での健全な使い方</h2>
					<ul style={{ fontSize: 16, color: '#444', marginLeft: 20, marginBottom: 24 }}>
						<li style={{ marginBottom: 12 }}><b>学校のGoogleアカウントを使う</b><br />配布された学校用アカウントでログインし、個人アカウントは使わないようにしましょう。</li>
						<li style={{ marginBottom: 12 }}><b>公的な目的で利用する</b><br />授業や連絡、課題提出など、学校活動に関係する内容のみ利用しましょう。</li>
						<li style={{ marginBottom: 12 }}><b>個人情報や機密情報は送らない</b><br />個人情報や機密情報の送信は避け、必要な場合は先生に相談しましょう。</li>
						<li style={{ marginBottom: 12 }}><b>言葉遣い・マナーを守る</b><br />相手を尊重し、丁寧な言葉遣いを心がけましょう。不適切な発言や迷惑行為は控えましょう。</li>
						<li style={{ marginBottom: 12 }}><b>先生や管理者の指示に従う</b><br />グループのルールや先生の指示を守り、健全なコミュニケーションを心がけましょう。</li>
					</ul>
				</div>
				<div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24 }}>
					<h2 style={{ fontSize: 20, marginBottom: 12 }}>グループ機能の紹介</h2>
					<ul style={{ fontSize: 16, color: '#444', marginLeft: 20, marginBottom: 24 }}>
						<li style={{ marginBottom: 12 }}><b>スペース（グループチャット）</b><br />複数人で会話できる「スペース」を作成し、クラスや部活動などのグループで情報共有ができます。</li>
						<li style={{ marginBottom: 12 }}><b>ファイル共有</b><br />Googleドライブと連携して、資料や課題を簡単に共有できます。</li>
						<li style={{ marginBottom: 12 }}><b>リアクション・返信</b><br />メッセージにリアクションや返信を付けて、コミュニケーションを円滑にできます。</li>
						<li style={{ marginBottom: 12 }}><b>検索機能</b><br />過去のメッセージやファイルを簡単に検索できます。</li>
					</ul>
					<div style={{ fontSize: 15, color: '#888' }}>
						詳しい使い方は、Googleチャットの公式ヘルプや先生に確認してください。
					</div>
				</div>
			</main>
		</div>
	);
}
