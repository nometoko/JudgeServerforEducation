import React, { useEffect, useState } from "react";
import { PageType } from "../types/PageType";
import { useLocation, useNavigate } from "react-router-dom";
import myaxios from "./axios_client";
import { AuthData } from "@/types/DbTypes";

type Props = {
  component: React.ReactNode;
  pageType: PageType;
};

export const AuthGuard: React.FC<Props> = ({ component, pageType }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await myaxios.get("/protected");
        setAuthData(response.data);
      } catch (error) {
        console.error("認証情報の取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthData();
  }, []);

  if (loading) return <div>Loading...</div>;

  let allowRoute = false;
  let message = "";

  if (authData && authData.authUserName && authData.authJoinedDate && authData.authUserExp) {
    const authUserExp = Number(authData.authUserExp);
    // ログイン保持期限のチェック
    if (authUserExp < Date.now() / 1000) {
      allowRoute = false;
      message = "ログイン保持期限が切れました。再度ログインしてください。";
    } else if (pageType === PageType.Public) {
      allowRoute = true;
    } else if (pageType === PageType.Private) {
      allowRoute = CheckAccessPermission(new Date(authData.authJoinedDate));
      if (!allowRoute) {
        message = "ページへのアクセス権がありません。\nアクセス権のあるアカウントでログインしてください。";
      }
    }
  } else {
    allowRoute = false;
    message = "コンテンツの閲覧にはログインが必要です。";
  }

  if (!allowRoute) {
    return <LogoutFlow message={message} location={location} />;
  }

  return <>{component}</>;
};

export const CheckAccessPermission = ( authJoinedDate: Date): boolean => {
  // 例: 入学年度が今年より前の場合はアクセス許可（senior student）
  if (authJoinedDate.getFullYear() < new Date().getFullYear()) {
    return true;
  } else {
    return  false;
  }
};

type LogoutFlowProps = {
  message: string;
  location: any;
};

const LogoutFlow: React.FC<LogoutFlowProps> = ({ message, location }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      const shouldLogout = window.confirm(
        `${message}\nこのままページに留まる場合は「キャンセル」、ログアウトする場合は「OK」をクリックしてください。`
      );
      if (shouldLogout) {
        // ローカルストレージの認証情報を削除
        localStorage.removeItem("authUserName");
        localStorage.removeItem("authJoinedDate");
        localStorage.removeItem("authUserExp");
        try {
          const response = await myaxios.post("/logout", null, { withCredentials: true });
          console.log(response.data.message);
        } catch (error) {
          console.error("ログアウトAPIの呼び出しに失敗しました", error);
        }
        navigate("/login");
      } else {
        navigate("/dashboard", { state: { from: location }, replace: true });
      }
    };

    doLogout();
  }, [message, location, navigate]);

  return <div>リダイレクト中...</div>;
};
