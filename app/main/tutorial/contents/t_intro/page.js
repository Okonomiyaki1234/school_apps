import React from 'react';
// import Header from '../../../../components/Header/HeaderDefault';
import Link from 'next/link';

export default function IntroTutorial() {
	return (
		<div>
			{/* <Header /> */}
			   <main style={{ padding: '2rem', paddingTop: '4.5rem', maxWidth: 900, margin: '0 auto' }}>
				<div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <Link href="/main/tutorial" style={{ display: 'inline-block', background: '#e0e0e0', color: '#333', borderRadius: '8px', padding: '0.5rem 1.2rem', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 3px #eee', transition: 'background 0.2s' }}>← チュートリアルトップへ戻る</Link>
                </div>
				<h1 style={{ fontSize: 32, marginBottom: 24 }}>はじめに</h1>
				<div style={{ background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24, marginBottom: 32 }}>
					<h2 style={{ fontSize: 22, marginBottom: 12 }}>アプリの概要</h2>
					<p style={{ fontSize: 16, color: '#444', marginBottom: 16 }}>
						このアプリは、学校生活をサポートするための様々な機能を提供しています。まずは「マイページ」でプロフィールを作成し、各機能を活用しましょう。
					</p>
				</div>
				<div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24 }}>
					<h2 style={{ fontSize: 20, marginBottom: 12 }}>はじめての手順</h2>
					<ol style={{ fontSize: 16, color: '#444', marginLeft: 20, marginBottom: 24 }}>
						<li style={{ marginBottom: 12 }}>
							<b>マイページにアクセス</b><br />
							<Link href="/main/my_page" style={{ color: '#0070f3', textDecoration: 'underline' }}>マイページ</Link>に移動します。
						</li>
						<li style={{ marginBottom: 12 }}>
							<b>プロフィール情報を入力</b><br />
							名前や学年、クラスなどのプロフィール情報を入力します。
						</li>
						<li style={{ marginBottom: 12 }}>
							<b>保存ボタンを押す</b><br />
							入力内容を確認し、「保存」ボタンを押してプロフィールを登録します。
						</li>
						<li style={{ marginBottom: 12 }}>
							<b>他の機能を使う</b><br />
							プロフィールが完成したら、他の機能（お知らせ、実績、カレンダー、メニュー、試験範囲など）を活用して、学校生活をより便利にしましょう。
						</li>
					</ol>
					<div style={{ fontSize: 15, color: '#888' }}>
						困った時は、各チュートリアルページやヘルプを参照してください。
					</div>
				</div>
			</main>
		</div>
	);
}
