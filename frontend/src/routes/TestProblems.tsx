// ✅ 共通のダミーデータファイル `data.ts`
export interface Problem {
    Id: string;
    Name: string;
    OpenDate: string;
    CloseDate: string;
    IsPetitCoder: boolean;
    Statement: string;
    Constaints: string,

}

export interface problemWithStatus {
    Problem: Problem;
    Status: boolean;
}

// ✅ すべてのコンポーネントで共通のデータを使う
export const dummyProblems: problemWithStatus[] = [
    {
        Problem: {
            Id: "1",
            Name: "問題1",
            OpenDate: "2024-02-01T00:00:00",
            CloseDate: "2024-02-15T00:00:00",
            Statement: "キーボード (標準入力)から文字を受け取り、その文字がアルファベットなら、次の処理を実行するプログラムを作成してください。\n 入力が大文字なら小文字に、小文字なら大文字に変換する。\n ただし入力はEOF(Ctrl + D) を受け取るまで繰り返されます。",
            Constaints: "scanfを使わないこと",
            IsPetitCoder: false,
        },
        Status: false,
    },
    {
        Problem: {
            Id: "2",
            Name: "問題2",
            OpenDate: "2024-02-05T00:00:00",
            CloseDate: "2024-02-20T00:00:00",
            Statement: "キーボード (標準入力)から文字を受け取り、その文字がアルファベットなら、次の処理を実行するプログラムを作成してください。\n 入力が大文字なら小文字に、小文字なら大文字に変換する。\n ただし入力はEOF(Ctrl + D) を受け取るまで繰り返されます。",
            Constaints: "scanfを使わないこと",
            IsPetitCoder: true,
        },
        Status: true,
    },
    {
        Problem: {
            Id: "3",
            Name: "問題3",
            OpenDate: "2024-02-10T00:00:00",
            CloseDate: "2024-02-25T00:00:00",
            Statement: "キーボード (標準入力)から文字を受け取り、その文字がアルファベットなら、次の処理を実行するプログラムを作成してください。\n 入力が大文字なら小文字に、小文字なら大文字に変換する。\n ただし入力はEOF(Ctrl + D) を受け取るまで繰り返されます。",
            Constaints: "scanfを使わないこと",
            IsPetitCoder: false,
        },
        Status: false,
    },
];
