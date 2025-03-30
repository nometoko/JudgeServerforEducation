import React, { useEffect, useState } from "react";
import myaxios from "./axios_client";
import { AuthData } from "@/types/DbTypes";

export const RootAuthGuard: React.FC<{ component1: React.ReactNode; component2: React.ReactNode }> = ({ component1, component2 }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  if (authData && authData.authUserName && authData.authJoinedDate && authData.authUserExp) {
    const authUserExp = Number(authData.authUserExp);
    // ログイン保持期限のチェック
    if (authUserExp < Date.now() / 1000) {
      allowRoute = false;
    } else {
      allowRoute = true;
    }
  } else {
    allowRoute = false;
  }

  if (allowRoute) {
    return <>{component1}</>;
  }
  else {
    return <>{component2}</>;
  }
};
