export const PageType = {
    Private: 'private',
    Public: 'public',
} as const; // string型ではなく、'private' | 'public' という文字列リテラル型になる
export type PageType = typeof PageType[keyof typeof PageType];
export const AllPageType = Object.values(PageType);

//// 正しい
//const page1: PageType = 'private';
//const page2: PageType = 'public';

//// 間違い（'secret' は PageType にない）
//const page3: PageType = 'secret'; // エラー！
