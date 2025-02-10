// Axios のカスタムインスタンスである myaxios に対してインターセプターを設定し、HTTP リクエストやレスポンスの共通処理を実装するためのコンポーネント
import { useEffect } from 'react'
import axios, { HttpStatusCode } from 'axios'
import { useNavigate } from 'react-router-dom'

export const myaxios = axios.create({
    // 必要に応じてconfigを設定
});

const SERVER_IP: string = import.meta.env.VITE_PUBLIC_SERVER_IP;
const BACKEND_PORT: string = import.meta.env.VITE_BACKEND_PORT

myaxios.defaults.baseURL = `http://${SERVER_IP}:${BACKEND_PORT}`;
myaxios.defaults.withCredentials = true;

// グローバルに使用される変数を他のファイルから読み込めるようにする
export default myaxios;

// useeffectがあるから、インターセプターの設定と削除ができる
export function Myaxios_provider({ children }: { children: React.ReactElement }) { // 横取りして割り込み処理を挟むインターセプター
  const navigate = useNavigate() // 遷移するための関数

  // コンポーネントがマウントされたとき、アンマウントされたとき、指定した値が変更されたときに実行される関数を登録
  useEffect(() => { 
    const request_interceptors = myaxios.interceptors.request.use() //request
    const response_interceptor = myaxios.interceptors.response.use( // response
      (response) => {
        //if (response.status === HttpStatusCode.Ok) { // 正常なレスポンス（例: 200 OK）のときにトークンの更新処理を実行
        //  const handle_refresh_token = async () => { // トークンの更新処理
        //    await axios.get("/refresh_token").catch(refreshError => {
        //      console.error(refreshError.response.error);
        //    })
        //  }
        //  handle_refresh_token();
        //}
		if (response.status === HttpStatusCode.Ok) {
			     const handle_refresh_token = async () => {
			        await axios.post("/refresh_token", { 
			          refresh_token: localStorage.getItem("refresh_token") // 例：localStorageから取得
			        }).catch(refreshError => {
			          console.error(refreshError.response?.error);
			        });
			      };
			      handle_refresh_token();
				  console.log("response", response);
			    }
        return response
      },
      (error) => {
        if (error.response?.status) { // error.response が存在しない場合でもエラーにならず、undefined
          if (error.response.status === HttpStatusCode.Unauthorized) {
            navigate("login") // 401 Unauthorized のときはログイン画面に遷移
          } else {
            console.error(error.response.error);
          }
        } else {
          console.error(error);
        }
        return Promise.reject(error) // エラーが上位のエラーハンドリングロジックで処理できる
      }
    )
    // クリーンアップ
	// コンポーネントがアンマウントされるときに実行される処理
    return () => {
      myaxios.interceptors.request.eject(request_interceptors)
      myaxios.interceptors.response.eject(response_interceptor)
    }
  }, [])

  return (<>{children}</>)
}