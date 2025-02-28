import React from "react";
import { PageType } from "../types/PageType";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

type Props = {
  component: React.ReactNode;
  pageType: PageType,
}

export const AuthGuard: React.FC<Props> = (props) => {
  let allowRoute = false;
  let message = "";
  const location = useLocation();

//  const [authUserName, setAuthUserName] = useState<string | null>(null);
//  const [authJoinedDate, setAuthJoinedDate] = useState<string | null>(null);
//  const [authUserExp, setAuthUserExp] = useState<string | null>(null);

  const authUserName = localStorage.getItem("authUserName");
  const authJoinedDate = localStorage.getItem("authJoinedDate");
  const authUserExp = localStorage.getItem("authUserExp");

//useEffect(() => {
//    setAuthUserName(localStorage.getItem("authUserName"));
//    setAuthJoinedDate(localStorage.getItem("authJoinedDate"));
//    setAuthUserExp(localStorage.getItem("authUserExp"));
//}, []);

  console.log("autUserExp", authUserExp);
  console.log("props.pageType", props.pageType);

  if ( authUserName && authJoinedDate && authUserExp ) {
    if (Number(authUserExp) < Date.now() / 1000) {
	  console.log("Now", Date.now() / 1000);
	  console.log("autUserExp", authUserExp);
      allowRoute = false;
      message = "ログイン保持期限が切れました。再度ログインしてください。";
    } else if (props.pageType === PageType.Public) {
      allowRoute = true;
    } else if (props.pageType === PageType.Private) {
      [allowRoute, message] = CheckAccessPermission({
        authUserName: authUserName,
        authJoinedDate: new Date(authJoinedDate)
      });
    } else {
      // unknown page type
    }
  } else {
    allowRoute = false;
    message = "コンテンツの閲覧にはログインが必要です。";
  }

//  if (!allowRoute) {
//    alert(message);
//    return <Navigate to="/login" state={{from: location}} replace={false} />
//  }

if (!allowRoute) {
	const shouldLogout = window.confirm(
	  `${message}\nこのままページに留まる場合は「キャンセル」、ログアウトする場合は「OK」をクリックしてください。`
	);
	if (shouldLogout) {
	  // ログアウト処理: ローカルストレージから認証情報を削除
	  localStorage.removeItem("authUserName");
	  localStorage.removeItem("authJoinedDate");
	  localStorage.removeItem("authUserExp");
	  return <Navigate to="/login" replace={false} />;
	} else {
	  // ユーザーがキャンセルした場合、適宜表示するコンテンツを返す
	  // 本当はそのままにしたいけどできていない
	  return (<Navigate to="/dashboard" state={{ from: location }} replace={true} />);
	}
  }

  return <>{props.component}</>;

}

type AuthUserProps = {
  authUserName: string,
  authJoinedDate: Date
}

export const CheckAccessPermission = (props:AuthUserProps): [boolean, string] => {
    const { userName } = useParams()
	//console.log("now", new Date().getFullYear());
	//console.log("authJoinedDate", props.authJoinedDate.getFullYear());
    if (props.authJoinedDate.getFullYear() < new Date().getFullYear()) {
        return [true, ""];  // senior student
    } 
	else {
		return [false, "ページへのアクセス権がありません。\nアクセス権のあるアカウントでログインしてください。"];  // junior student
	}
	// else {
    //    if (props.authUserName == userName) {
    //        return [true, ""];  // matched userName
    //    } else {
    //        return [false, "ページへのアクセス権がありません。アクセス権のあるアカウントでログインしてください。"];  // unmatched userName
    //    }
    //}
}