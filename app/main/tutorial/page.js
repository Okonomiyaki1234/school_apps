import React from 'react';
import Header from '../../../components/Header/HeaderDefault';
import Link from 'next/link';

const features = [
	{
		title: 'はじめに',
		description: 'アプリの概要と使い方を見る',
		href: '/main/tutorial/contents/t_intro',
		img: 'https://placehold.jp/120x80.png?text=Intro',
	},
	{
		title: 'ホーム',
		description: 'ホーム画面の説明を見る',
		href: '/main/tutorial/contents/t_home',
		img: 'https://placehold.jp/120x80.png?text=Home',
	},
	{
		title: 'マイページ',
		description: 'マイページ機能の説明を見る',
		href: '/main/tutorial/contents/t_my_page',
		img: 'https://placehold.jp/120x80.png?text=MyPage',
	},
	{
		title: 'お知らせ',
		description: 'お知らせ機能の説明を見る',
		href: '/main/tutorial/contents/t_notice',
		img: 'https://placehold.jp/120x80.png?text=Notice',
	},
	{
		title: '実績',
		description: '実績機能の説明を見る',
		href: '/main/tutorial/contents/t_achievement',
		img: 'https://placehold.jp/120x80.png?text=Achievement',
	},
	{
		title: 'カレンダー',
		description: 'カレンダー機能の説明を見る',
		href: '/main/tutorial/contents/t_calendar',
		img: 'https://placehold.jp/120x80.png?text=Calendar',
	},
	{
		title: 'メニュー',
		description: 'メニュー機能の説明を見る',
		href: '/main/tutorial/contents/t_menu',
		img: 'https://placehold.jp/120x80.png?text=Menu',
	},
	{
		title: '試験範囲',
		description: '試験範囲機能の説明を見る',
		href: '/main/tutorial/contents/t_exam_list',
		img: 'https://placehold.jp/120x80.png?text=Exam',
	},
	{
		title: '食堂',
		description: '食堂機能の説明を見る',
		href: '/main/tutorial/contents/t_cafeteria',
		img: 'https://placehold.jp/120x80.png?text=Cafeteria',
	},
	{
		title: 'クラス',
		description: 'クラス機能の説明を見る',
		href: '/main/tutorial/contents/t_classrooms',
		img: 'https://placehold.jp/120x80.png?text=Classrooms',
	},
	{
		title: '部活・委員会',
		description: '部活・委員会機能の説明を見る',
		href: '/main/tutorial/contents/t_clubs',
		img: 'https://placehold.jp/120x80.png?text=Clubs',
	},
	{
		title: '質問',
		description: '質問機能の説明を見る',
		href: '/main/tutorial/contents/t_question',
		img: 'https://placehold.jp/120x80.png?text=Question',
	},
	{
		title: '課題',
		description: '課題機能の説明を見る',
		href: '/main/tutorial/contents/t_task',
		img: 'https://placehold.jp/120x80.png?text=Task',
	},
	{
		title: 'ツール',
		description: 'ツール機能の説明を見る',
		href: '/main/tutorial/contents/t_tools',
		img: 'https://placehold.jp/120x80.png?text=Tools',
	},
	{
		title: '広告',
		description: '広告機能の説明を見る',
		href: '/main/tutorial/contents/t_ads',
		img: 'https://placehold.jp/120x80.png?text=Ads',
	},
	{
		title: 'Googleチャット',
		description: 'Googleチャットの使い方を見る',
		href: '/main/tutorial/contents/t_i_chat',
		img: 'https://placehold.jp/120x80.png?text=Chat',
	},
];

export default function TutorialHub() {
	return (
		<div>
			<Header />
			<main style={{ padding: '2rem', paddingTop: '4.5rem', maxWidth: 900, margin: '0 auto' }}>
				<h1 style={{ fontSize: 32, marginBottom: 24 }}>チュートリアル</h1>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
					{features.map((feature) => (
						<Link href={feature.href} key={feature.title} style={{ textDecoration: 'none' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
								<img src={feature.img} alt={feature.title} style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
								<div>
									<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>{feature.title}</div>
									<div style={{ fontSize: 15, color: '#444' }}>{feature.description}</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</main>
		</div>
	);
}
